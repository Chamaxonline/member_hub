using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberHub.Api.Data;
using MemberHub.Api.Models;

namespace MemberHub.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly MemberHubDbContext _context;

        public MembersController(MemberHubDbContext context)
        {
            _context = context;
        }

        // GET: api/Members
        [HttpGet]
        public async Task<ActionResult<PagedResult<Member>>> GetMembers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var query = _context.Members.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();
                var parsedDate = DateTime.TryParse(term, out var searchDate);

                query = query.Where(m =>
                    m.FirstName.Contains(term) ||
                    m.LastName.Contains(term) ||
                    (m.FirstName + " " + m.LastName).Contains(term) ||
                    m.Address.Contains(term) ||
                    (m.MobileNumber != null && m.MobileNumber.Contains(term)) ||
                    m.RegistrationNumber.ToString().Contains(term) ||
                    (parsedDate && m.RegistrationDate.Date == searchDate.Date) ||
                    m.RegistrationDate.Year.ToString().Contains(term) ||
                    m.RegistrationDate.Month.ToString().Contains(term) ||
                    m.RegistrationDate.Day.ToString().Contains(term));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(m => m.RegistrationDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Member>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        // GET: api/Members/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            var member = await _context.Members.FindAsync(id);

            if (member == null)
            {
                return NotFound();
            }

            return member;
        }

        // PUT: api/Members/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMember(int id, Member member)
        {
            if (id != member.Id)
            {
                return BadRequest();
            }

            _context.Entry(member).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Members
        [HttpPost]
        public async Task<ActionResult<Member>> PostMember(Member member)
        {
            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMember", new { id = member.Id }, member);
        }

        private bool MemberExists(int id)
        {
            return _context.Members.Any(e => e.Id == id);
        }
    }
}
