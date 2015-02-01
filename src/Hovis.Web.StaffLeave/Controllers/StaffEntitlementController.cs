using Hovis.Data;
using Hovis.Web.StaffLeave.Models;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using ADUserHolidayEntitlement = Hovis.Web.StaffLeave.Data.Models.ADUserHolidayEntitlement;

namespace Hovis.Web.StaffLeave.Controllers
{
    [Authorize]
    public class StaffEntitlementController : Controller
    {
        [Route("StaffEntitlement/{id}", Name = "ViewStaffEntitlementDetails")]
        public ActionResult Edit(int id)
        {
            //todo: remove this, use api instead
            using (var db = new HovisDbContext())
            {
                var user = db.ADUsers
                    .Include(e => e.HolidayEntitlement)
                    .SingleOrDefault(x => x.EmployeeNumber.Equals(id));

                //todo if user is null error

                var viewModel = new EditStaffEntitlementViewModel
                {
                    EmployeeFirstName = user.FirstName,
                    EmployeeLastName = user.LastName,
                    EmployeeNumber = user.EmployeeNumber
                };

                if (user.HolidayEntitlement != null)
                {
                    viewModel.StaffEntitlement.StandardEntitlement = user.HolidayEntitlement.StandardEntitlement;
                    viewModel.StaffEntitlement.PeriodStartDay = user.HolidayEntitlement.PeriodStartDay;
                    viewModel.StaffEntitlement.PeriodStartMonth = user.HolidayEntitlement.PeriodStartMonth;
                    viewModel.StaffEntitlement.PeriodEndDay = user.HolidayEntitlement.PeriodEndDay;
                    viewModel.StaffEntitlement.PeriodEndMonth = user.HolidayEntitlement.PeriodEndMonth;
                }

                return View("Edit", viewModel);
            }
        }

        [Route("StaffEntitlement", Name = "ViewAllStaffEntitlement")]
        public ActionResult Index()
        {
            //todo: remove this, use api instead
            using (var db = new HovisDbContext())
            {
                var editStaffEntitlementViewModels = db.ADUsers.Include(e => e.HolidayEntitlement)
                    .OrderBy(x => x.FirstName)
                    .ToList()
                    .Select(x => new EditStaffEntitlementViewModel(x));

                return View(editStaffEntitlementViewModels);
            }
        }

        [HttpPost]
        [Route("StaffEntitlement/{id}", Name = "SaveAllStaffEntitlement")]
        public ActionResult Post(int id, EditStaffEntitlementViewModel model)
        {
            if (ModelState.IsValid)
            {
                //todo: remove this, use api instead
                using (var db = new HovisDbContext())
                {
                    var user = db.ADUsers.SingleOrDefault(x => x.EmployeeNumber.Equals(id));

                    if (user.HolidayEntitlement == null)
                        user.HolidayEntitlement = new ADUserHolidayEntitlement();

                    if (model.StaffEntitlement.StandardEntitlement.HasValue)
                    {
                        user.HolidayEntitlement.StandardEntitlement = model.StaffEntitlement.StandardEntitlement.Value;
                        user.HolidayEntitlement.PeriodStartDay = model.StaffEntitlement.PeriodStartDay.Value;
                        user.HolidayEntitlement.PeriodStartMonth = model.StaffEntitlement.PeriodStartMonth.Value;

                        user.HolidayEntitlement.PeriodEndDay = model.StaffEntitlement.PeriodEndDay.Value;
                        user.HolidayEntitlement.PeriodEndMonth = model.StaffEntitlement.PeriodEndMonth.Value;
                    }

                    db.ADUsers.Attach(user);
                    db.SaveChanges();

                    TempData.Add("alert", new Alert("success", "Saved", "Holiday entitlement updated for " + user.FirstName + " " + user.LastName));

                    return RedirectToAction("Index");
                }
            }

            //there were validation errors, so return them
            return View("Edit", model);
        }
    }
}