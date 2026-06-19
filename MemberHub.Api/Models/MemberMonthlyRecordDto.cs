namespace MemberHub.Api.Models
{
    public class MemberMonthlyRecordDto
    {
        public int Month { get; set; }
        public decimal? Fee { get; set; }
        public string? Signature { get; set; }
        public DateTime? PaymentDate { get; set; }
    }

    public class MemberYearlyRecordsDto
    {
        public int MemberId { get; set; }
        public int Year { get; set; }
        public IEnumerable<MemberMonthlyRecordDto> Months { get; set; } = Enumerable.Empty<MemberMonthlyRecordDto>();
    }

    public class SaveMemberYearlyRecordsDto
    {
        public int Year { get; set; }
        public IEnumerable<MemberMonthlyRecordDto> Months { get; set; } = Enumerable.Empty<MemberMonthlyRecordDto>();
    }
}
