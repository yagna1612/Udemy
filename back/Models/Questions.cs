using System.Collections.Generic;

namespace back.Models
{
    public class Questions
    {
        public int Id { get; set; }
        public string Question { get; set; }
        public List<Option> Options {get; set;}
    }
    public class Option{
        public int Id { get; set; }
        public string Options { get; set; }
    }
    public class Score{
        public int Id { get; set; }
        public string Answer { get; set; }
    }
}