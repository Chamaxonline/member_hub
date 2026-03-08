using Microsoft.EntityFrameworkCore;
using MemberHub.Api.Models;

namespace MemberHub.Api.Data
{
    public class MemberHubDbContext : DbContext
    {
        public MemberHubDbContext(DbContextOptions<MemberHubDbContext> options) : base(options)
        {
        }

        public DbSet<Member> Members { get; set; }
    }
}
