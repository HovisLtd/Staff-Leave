using System.Data.Entity;
using ADUser = Hovis.Web.StaffLeave.Data.Models.ADUser;
using ADUserHolidayEntitlement = Hovis.Web.StaffLeave.Data.Models.ADUserHolidayEntitlement;

namespace Hovis.Data
{
    public class HovisDbContext : DbContext
    {
        public HovisDbContext()
            : base("name=Hovis")
        { }

        public DbSet<ADUser> ADUsers { get; set; }

        public DbSet<ADUserHolidayEntitlement> ADUserHolidayEntitlement { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //can specify table name here, or in model
            //modelBuilder.Entity<ADUser>().ToTable("adusers");

            //  modelBuilder.Entity<ADUser>()
            //      .HasOptional(x => x.HolidayEntitlement)
            //      .WithRequired(x => x.ADUser);
            //
            modelBuilder.Entity<ADUserHolidayEntitlement>()
                .HasRequired(t => t.ADUser)
                .WithOptional(x => x.HolidayEntitlement);

            //   modelBuilder.Entity<ADUserHolidayEntitlement>()
            //     .HasRequired(w => w.ADUser);
        }
    }
}