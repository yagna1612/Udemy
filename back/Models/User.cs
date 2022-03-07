using System.ComponentModel.DataAnnotations;
using AutoMapper;
namespace back.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public byte[] Password { get; set; }
        public byte[] PasswordKey { get; set; }
        public string EmailID { get; set; }
        public string MobileNo { get; set; }
        public string ProfilePic {get;set;}
        public bool isAdmin {get;set;}
    }
    public class UserRegister
    {
        [Required]
        public string UserName { get; set; }
        public string FullName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string EmailID { get; set; }
        public string MobileNo { get; set; }
        public bool isAdmin {get;set;}
    }
    public class UserEdit
    {
        [Required]
        public int UserID { get; set; }
        public string FullName { get; set; }
        [Required]
        public string EmailID { get; set; }
        public string Token { get; set; }
        public string MobileNo { get; set; }
        public string ProfilePic { get; set;}
    }
    public class UserViewModel
    {
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string EmailID { get; set; }
        public string MobileNo { get; set; }
        public string Token { get; set; }
        public string ProfilePic { get; set; }
        public bool isAdmin {get;set;}
    }
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserViewModel>();
            CreateMap<User, UserRegister>();
            CreateMap<UserEdit, User>();
        }
    }
}