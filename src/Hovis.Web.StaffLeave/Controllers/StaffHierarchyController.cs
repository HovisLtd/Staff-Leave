using Hovis.Data;
using System.Linq;
using System.Web.Mvc;

namespace Hovis.Web.StaffLeave.Controllers
{
    public class StaffHierarchyController : Controller
    {
        public ActionResult Index()
        {
            //todo: remove this, use api instead
            using (var db = new HovisDbContext())
            {
                var users = db.ADUsers.OrderBy(x => x.FirstName)
                    .ToList();

                return View(users);
            }
        }

        [Route("StaffHierarchy/{id}", Name = "EditStaffHierarchyDetails")]
        public ActionResult Edit(int id)
        {
            using (var db = new HovisDbContext())
            {
                var employee = db.ADUsers.SingleOrDefault(x => x.EmployeeNumber.Equals(id));

                return View(employee);
            }
        }
    }
}