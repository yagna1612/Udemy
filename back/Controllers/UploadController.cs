using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _configuration;
        public UploadController(IWebHostEnvironment env, IConfiguration configuration)
        {
            _configuration = configuration;
            _env = env;

        }
        public Boolean isImage(string fileName)
        {
            List<string> ImageTypes = new List<string>() { ".jpg", ".png", ".jpeg" };
            if (ImageTypes.Contains(Path.GetExtension(fileName)))
                return true;
            return false;
        }
        [HttpPost("{id}"), DisableRequestSizeLimit]
        public IActionResult Upload(int id)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Join("Resources", "User_" + id);
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                if (!Directory.Exists(pathToSave))
                    Directory.CreateDirectory(pathToSave);
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"').ToLower();
                    if (!isImage(fileName))
                        return BadRequest("File must be an image.");
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var parameters = new DynamicParameters();
                    parameters.Add("@UserID", id);
                    string profilepic = "select  profilepic from users where UserID=@UserID";
                    using (var connection = new SqlConnection(_configuration.GetConnectionString("Default")))
                    {
                        var h = connection.ExecuteScalar<string>(profilepic, parameters);
                        if(h!=null)
                        {
                            var p = Path.Combine(Directory.GetCurrentDirectory(),h);
                            if (System.IO.File.Exists(p))
                                System.IO.File.Delete(p);
                        }
                    }
                    fileName = "ProfilePic" + Path.GetExtension(fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(dbPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
    }
}