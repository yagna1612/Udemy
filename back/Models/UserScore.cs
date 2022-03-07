using System;
using AutoMapper;

namespace back.Models
{
    public class UserScore
    {
        public int UserScoreID { get; set; }
        public int UserID { get; set; }
        public float Score { get; set; }
        public DateTime PlayedOn { get; set; }
    }
    public class UserScorePost
    {
        public int UserID { get; set; }
        public float Score { get; set; }
        public DateTime PlayedOn { get; set; }
    }
    public class Scores
    {
        public string FullName {get; set;}
        public float Score{get;set;}
    }
    public class ScoreProfile : Profile
    {
        public ScoreProfile()
        {
            CreateMap<UserScore, UserScorePost>();
        }
    }
}