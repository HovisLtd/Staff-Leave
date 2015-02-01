using ADUser = Hovis.Web.StaffLeave.Data.Models.ADUser;

namespace Hovis.Web.StaffLeave.Models
{
    public class EditStaffEntitlementViewModel
    {
        public EditStaffEntitlementViewModel()
        {
            StaffEntitlement = new StaffEntitlementViewModel();
        }

        public EditStaffEntitlementViewModel(ADUser employee)
        {
            StaffEntitlement = new StaffEntitlementViewModel();

            EmployeeEmailAddress = employee.Email;
            EmployeeFirstName = employee.FirstName;
            EmployeeLastName = employee.LastName;
            EmployeeNumber = employee.EmployeeNumber;

            if (employee.HolidayEntitlement != null)
            {
                StaffEntitlement.StandardEntitlement = employee.HolidayEntitlement.StandardEntitlement;
                StaffEntitlement.PeriodStartDay = employee.HolidayEntitlement.PeriodStartDay;
                StaffEntitlement.PeriodEndDay = employee.HolidayEntitlement.PeriodEndDay;

                StaffEntitlement.PeriodStartMonth = employee.HolidayEntitlement.PeriodStartMonth;
                StaffEntitlement.PeriodEndMonth = employee.HolidayEntitlement.PeriodEndMonth;
            }
        }

        public int EmployeeNumber { get; set; }

        public string EmployeeFirstName { get; set; }

        public string EmployeeLastName { get; set; }

        public string EmployeeFullName { get { return string.Join(" ", EmployeeFirstName, EmployeeLastName); } }

        public string EmployeeEmailAddress { get; set; }

        public StaffEntitlementViewModel StaffEntitlement { get; set; }
    }
}