namespace Hovis.Web.StaffLeave.Data.Models
{
    public class Department
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int HeadOfDepartmentId { get; set; }

        public string HeadOfDepartmentFirstName { get; set; }

        public string HeadOfDepartmentLastName { get; set; }

        public string HeadOfDepartmentEmail { get; set; }
    }
}