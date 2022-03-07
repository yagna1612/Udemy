using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using back.Data.Repository;
using back.Interfaces;
using back.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration Configuration;
        private readonly DataContext dc;
        private readonly IUnitOfWork _ur;
        private readonly IFileProvider _fileProvider;

        public UserController(DataContext dc, IMapper mapper, IConfiguration configuration, IUnitOfWork ur, IFileProvider fileProvider)
        {
            this._fileProvider = fileProvider;
            this._ur = ur;
            this.dc = dc;
            this._mapper = mapper;
            this.Configuration = configuration;
        }


        [HttpPost]
        public async Task<IActionResult> RegisterUser(UserRegister user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            byte[] passwordHash, passwordKey;
            using (var hmac = new HMACSHA512())
            {
                passwordKey = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password));
            }
            var temp = new User();
            temp.EmailID = user.EmailID;
            temp.FullName = user.FullName;
            temp.MobileNo = user.MobileNo;
            temp.UserName = user.UserName;
            temp.Password = passwordHash;
            temp.PasswordKey = passwordKey;
            temp.isAdmin = false;
            dc.Users.Add(temp);
            await dc.SaveChangesAsync();
            return Ok(temp.UserID);
        }

        [HttpGet("{credentials}")]
        public async Task<IActionResult> LoginUser(string credentials)
        {
            byte[] byteArray = Convert.FromBase64String(credentials);

            string jsonBack = Encoding.UTF8.GetString(byteArray);
            var accountBack = JsonConvert.DeserializeObject<LoginDTO>(jsonBack);
            // var x = this._mapper.Map<UserViewModel>(dc.Users.FirstOrDefault(t => t.UserName == accountBack.UserName && t.Password == accountBack.Password));

            var x = await this._ur.UserRepository.Authenticate(accountBack.UserName, accountBack.Password);
            if (x == null)
                return BadRequest("Username/Password entered is incorrect.");
            var temp = this._mapper.Map<UserViewModel>(x);
            temp.Token = CreateJWT(x);
            return Ok(temp);
        }
        private string CreateJWT(User u)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("AppSettings:Key").Value));
            var claims = new Claim[]{
                new Claim(ClaimTypes.Name,u.UserName),
                new Claim(ClaimTypes.NameIdentifier,u.UserID.ToString()),
            };
            var signingCredentials = new SigningCredentials(
                key, SecurityAlgorithms.HmacSha256Signature
            );
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(6),
                SigningCredentials = signingCredentials,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpGet("/scores")]
        public async Task<IActionResult> getScores()
        {
            string sqlOrderDetails = "select u.FullName,s.Score from users as u inner join scores as s on u.UserID=s.UserID order by score desc,PlayedOn ;";
            List<Scores> orderDetails = new List<Scores>();
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                orderDetails = connection.Query<Scores>(sqlOrderDetails).ToList();
            }
            return Ok(orderDetails);
        }

        [HttpGet("/piescore")]
        public async Task<IActionResult> getPieScore()
        {
            string above_avg = "SELECT count(score) as above FROM scores where score >= ( SELECT avg(score) FROM Scores )";
            string below_avg = "SELECT count(score) as below FROM scores where score < (   SELECT avg(score) FROM Scores )";
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                int above = await connection.ExecuteScalarAsync<int>(above_avg);
                int below = await connection.ExecuteScalarAsync<int>(below_avg);
                int[] vals = { above, below };
                return Ok(vals);
            }
            return null;
        }

        [HttpGet("/highest/{id}")]
        [Authorize]
        public async Task<IActionResult> getHighestScore(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", id);
            string highest = "select top 1 Score from scores where UserID=@UserID order by score desc";
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                var h = await connection.ExecuteScalarAsync(highest, parameters);
                return Ok(h);
            }
            return null;
        }
        [HttpPut("/edit/{id}")]
        [Authorize]
        public async Task<IActionResult> editProfile(int id, UserEdit u)
        {
            if (id != u.UserID)
                return BadRequest("User ID Mismatch");
            var user = await this.dc.Users.FirstOrDefaultAsync(x => x.UserID == id);
            user.EmailID = u.EmailID;
            user.MobileNo = u.MobileNo;
            user.ProfilePic = u.ProfilePic;
            user.FullName = u.FullName;
            this.dc.Entry(user).State = EntityState.Modified;
            var x = this._mapper.Map<UserViewModel>(user);
            x.Token = u.Token;
            await this.dc.SaveChangesAsync();
            return Ok(x);
        }
        [HttpGet("/profilepic/{id}")]
        [Authorize]
        public async Task<IActionResult> getProfilePic(int id)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@UserID", id);
            string profilepic = "select  profilepic from users where UserID=@UserID";
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                var h = await connection.ExecuteScalarAsync<string>(profilepic, parameters);
                if (h == null)
                    return BadRequest("Invalid User Id.");
                // var filePath = Path.Join(Directory.GetCurrentDirectory(), h);
                if(!System.IO.File.Exists(h))
                    return Ok();
                IFileInfo fileInfo = this._fileProvider.GetFileInfo(h);
                var readStream = fileInfo.CreateReadStream();
                var type = this._ur.UserRepository.getcontentType(h);
                return File(readStream, type, "ProfilePic");
            }
        }
    }
}