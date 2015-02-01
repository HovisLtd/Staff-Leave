using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hovis.Web.StaffLeave.Data.Models
{
    [Table("t_ADUser_Holiday_Entitlement")]
    public class ADUserHolidayEntitlement
    {
        [Key]
        public int EmployeeNumber { get; set; }

        public virtual Web.StaffLeave.Data.Models.ADUser ADUser { get; set; }

        public int PeriodStartDay { get; set; }

        public int PeriodStartMonth { get; set; }

        public int PeriodEndDay { get; set; }

        public int PeriodEndMonth { get; set; }

        public decimal StandardEntitlement { get; set; }
    }
}