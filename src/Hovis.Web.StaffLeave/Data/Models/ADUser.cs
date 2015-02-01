using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hovis.Web.StaffLeave.Data.Models
{
    //http://www.codeproject.com/Tips/661053/Entity-Framework-Code-First-Map
    [Table("v_ad_users")]
    public class ADUser
    {
        [Key]
        [Column("id")]
        public int EmployeeNumber { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string JobTitle { get; set; }

        public string TelephoneNumber { get; set; }

        public string MobileNumber { get; set; }

        public string Email { get; set; }

        public string PhysicalDeliveryOffice { get; set; }

        public int ManagerId { get; set; }

        public string ManagerFirstName { get; set; }

        public string ManagerLastName { get; set; }

        public string Company { get; set; }

        public string DistinguishedName { get; set; }

        public string LastLogonDate { get; set; }

        public string LastSync { get; set; }

        public string Webpage { get; set; }

        public string SamAccountName { get; set; }

        public virtual ADUserHolidayEntitlement HolidayEntitlement { get; set; }

        //this is all fake at the moment

        public int FinancialAuthLevel { get { return 0; } }

        public string FunctionalDir { get { return "Claire Hunt"; } }

        public string FunctionalDirEmail { get { return "claire.hunt@hovis.co.uk"; } }

        public string HRBusinessPartner { get { return "Glyn Cannon"; } }

        public string HRBusinessPartnerEmail { get { return "glyn.james@hovis.co.uk"; } }

        public string Department { get; set; }

        public int HeadOfDepartmentId { get { return 24553; } }

        public string HeadOfDepartmentFirstName { get { return "Glyn"; } }

        public string HeadOfDepartmentLastName { get { return "Cannon"; } }

        public string HeadOfDepartmentEmailAddress { get { return "glyn.james@hovis.co.uk"; } }
    }
}