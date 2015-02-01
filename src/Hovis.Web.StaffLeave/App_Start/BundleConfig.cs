using System.Web.Optimization;

namespace Hovis.Web.StaffLeave
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                "~/Scripts/app.js",
                "~/Scripts/bootstrap.min.js"));

            bundles.Add(new StyleBundle("~/Content/css/all").Include(
                      "~/Content/css/bootstrap.css",
                      "~/Content/css/validation.css",
                      "~/Content/css/main.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}