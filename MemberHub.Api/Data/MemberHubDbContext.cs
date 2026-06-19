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
        public DbSet<MemberMonthlyRecord> MemberMonthlyRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MemberMonthlyRecord>()
                .HasIndex(r => new { r.MemberId, r.Year, r.Month })
                .IsUnique();
        }
    }
}

