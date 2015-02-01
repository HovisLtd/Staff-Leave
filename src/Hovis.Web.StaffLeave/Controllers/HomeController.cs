using System.Web.Mvc;

namespace Hovis.Web.StaffLeave.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}