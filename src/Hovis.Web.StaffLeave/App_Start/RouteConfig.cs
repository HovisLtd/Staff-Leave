using System.Web.Mvc;
using System.Web.Routing;

namespace Hovis.Web.StaffLeave
{
    public static class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.LowercaseUrls = true;

            routes.MapMvcAttributeRoutes();

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                new[] { "Hovis.Compliance.Web.Areas.MasterData.Controllers" }
                );
        }
    }
}