using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using back.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IConfiguration Configuration;
        private readonly DataContext dc;

        public QuestionsController(DataContext dc, IMapper mapper,IConfiguration configuration)
        {
            this.dc = dc;
            this._mapper = mapper;
            this.Configuration = configuration;
        }

        [HttpGet("/questions")]
        [AllowAnonymous]
        public async Task<IActionResult> getquestions(){
            string questions = "select * from questions;";
            List<Questions> q = new List<Questions>();
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                q = connection.Query<Questions>(questions).ToList();
                foreach(var x in q){
                    string option = "select id,options from options where id is not null and questionId="+x.Id;
                    List<Option> op = new List<Option>();
                    op = connection.Query<Option>(option).ToList();
                    if(op.Count>0)
                        x.Options = op;
                }
                return Ok(q);
            }
            return null;
        }

        [HttpGet("/answers")]
        public async Task<IActionResult> generateScore(){
            var answers = "SELECT id, answer= STUFF((SELECT ',' + str(answer) FROM answers as b WHERE b.questionid = a.id FOR XML PATH('')), 1, 2, '') FROM questions as a GROUP BY id";
            using (var connection = new SqlConnection(Configuration.GetConnectionString("Default")))
            {
                List<Score> ans = new List<Score>();
                ans = connection.Query<Score>(answers).ToList();
                return Ok(ans);
            }
            
            return Ok();
        }

        [HttpPost("/score")]
        [Authorize]
        public async Task<IActionResult> addScore(UserScore score)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            dc.Scores.Add(score);
            await dc.SaveChangesAsync();
            return Ok(score.UserID);
        }
    }
}