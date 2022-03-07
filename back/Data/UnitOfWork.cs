using back.Data.Repository;
using back.Interfaces;
using back.Models;

namespace back.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext _dc;
        public UnitOfWork(DataContext dc)
        {
            _dc = dc;
        }
        public IUserRepository UserRepository => new UserRepository(_dc);
    }
}