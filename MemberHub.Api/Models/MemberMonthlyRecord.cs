using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MemberHub.Api.Models
{
    public class MemberMonthlyRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MemberId { get; set; }

        [ForeignKey(nameof(MemberId))]
        public Member? Member { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Fee { get; set; }

        [MaxLength(100)]
        public string? Signature { get; set; }

        public DateTime? PaymentDate { get; set; }
    }
}
