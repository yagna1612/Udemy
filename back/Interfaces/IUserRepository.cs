using System.Threading.Tasks;
using back.Models;

namespace back.Interfaces
{
    public interface IUserRepository
    {
         public Task<User> Authenticate(string userName,string passwordText);
         public string getcontentType(string fileName);
    }
}