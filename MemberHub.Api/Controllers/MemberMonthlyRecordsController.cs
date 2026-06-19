using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MemberHub.Api.Data;
using MemberHub.Api.Models;

namespace MemberHub.Api.Controllers
{
    [Route("api/members/{memberId:int}/monthly-records")]
    [ApiController]
    public class MemberMonthlyRecordsController : ControllerBase
    {
        private readonly MemberHubDbContext _context;

        public MemberMonthlyRecordsController(MemberHubDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<MemberYearlyRecordsDto>> GetYearlyRecords(int memberId, [FromQuery] int year)
        {
            if (!await MemberExists(memberId))
            {
                return NotFound("Member not found.");
            }

            if (year < 1900 || year > 2100)
            {
                return BadRequest("Year must be between 1900 and 2100.");
            }

            var existing = await _context.MemberMonthlyRecords
                .Where(r => r.MemberId == memberId && r.Year == year)
                .ToListAsync();

            var months = Enumerable.Range(1, 12).Select(month =>
            {
                var record = existing.FirstOrDefault(r => r.Month == month);
                return new MemberMonthlyRecordDto
                {
                    Month = month,
                    Fee = record?.Fee,
                    Signature = record?.Signature,
                    PaymentDate = record?.PaymentDate
                };
            });

            return new MemberYearlyRecordsDto
            {
                MemberId = memberId,
                Year = year,
                Months = months
            };
        }

        [HttpPut]
        public async Task<ActionResult<MemberYearlyRecordsDto>> SaveYearlyRecords(int memberId, SaveMemberYearlyRecordsDto dto)
        {
            if (!await MemberExists(memberId))
            {
                return NotFound("Member not found.");
            }

            if (dto.Year < 1900 || dto.Year > 2100)
            {
                return BadRequest("Year must be between 1900 and 2100.");
            }

            var existing = await _context.MemberMonthlyRecords
                .Where(r => r.MemberId == memberId && r.Year == dto.Year)
                .ToListAsync();

            foreach (var monthDto in dto.Months)
            {
                if (monthDto.Month < 1 || monthDto.Month > 12)
                {
                    return BadRequest($"Invalid month: {monthDto.Month}");
                }

                var record = existing.FirstOrDefault(r => r.Month == monthDto.Month);
                var hasData = monthDto.Fee.HasValue ||
                              !string.IsNullOrWhiteSpace(monthDto.Signature) ||
                              monthDto.PaymentDate.HasValue;

                if (record == null && hasData)
                {
                    _context.MemberMonthlyRecords.Add(new MemberMonthlyRecord
                    {
                        MemberId = memberId,
                        Year = dto.Year,
                        Month = monthDto.Month,
                        Fee = monthDto.Fee,
                        Signature = monthDto.Signature?.Trim(),
                        PaymentDate = monthDto.PaymentDate
                    });
                }
                else if (record != null)
                {
                    if (hasData)
                    {
                        record.Fee = monthDto.Fee;
                        record.Signature = monthDto.Signature?.Trim();
                        record.PaymentDate = monthDto.PaymentDate;
                    }
                    else
                    {
                        _context.MemberMonthlyRecords.Remove(record);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return await GetYearlyRecords(memberId, dto.Year);
        }

        private async Task<bool> MemberExists(int memberId)
        {
            return await _context.Members.AnyAsync(m => m.Id == memberId);
        }
    }
}
