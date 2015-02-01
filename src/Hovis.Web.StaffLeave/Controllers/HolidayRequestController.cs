using System.Web.Mvc;

namespace Hovis.Web.StaffLeave.Controllers
{
    [Authorize]
    public class HolidayRequestController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult New()
        {
            return View();
        }
    }
}