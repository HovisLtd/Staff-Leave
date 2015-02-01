using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;

namespace Hovis.Web.StaffLeave.Models
{
    public class StaffEntitlementViewModel
    {
        [DisplayName("Standard Entitlement")]
        [Range(1, 300)]
        [Required]
        public decimal? StandardEntitlement { get; set; }

        [Range(1, 31)]
        public int? PeriodStartDay { get; set; }

        [Range(1, 12)]
        [Required]
        public int? PeriodStartMonth { get; set; }

        public string PeriodStart
        {
            get
            {
                if (!PeriodStartDay.HasValue || !PeriodStartMonth.HasValue)
                    return string.Empty;

                try
                {
                    return new DateTime(DateTime.Now.Year, PeriodStartMonth.Value, PeriodStartDay.Value).ToString("dd MMM");
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    return "???";
                }
            }
        }

        [Range(1, 31)]
        public int? PeriodEndDay { get; set; }

        [Range(1, 12)]
        [Required]
        public int? PeriodEndMonth { get; set; }

        public string PeriodEnd
        {
            get
            {
                if (!PeriodEndMonth.HasValue || !PeriodEndDay.HasValue)
                    return string.Empty;

                try
                {
                    return new DateTime(DateTime.Now.Year, PeriodEndMonth.Value, PeriodEndDay.Value).ToString("dd MMM");
                }
                catch (ArgumentOutOfRangeException ex)
                {
                    return "???";
                }
            }
        }

        public IEnumerable<SelectListItem> AvailableDays
        {
            get
            {
                for (var i = 1; i <= 31; i++)
                    yield return new SelectListItem { Text = i.ToString(), Value = i.ToString() };
            }
        }

        public IEnumerable<SelectListItem> AvailableMonths
        {
            get
            {
                for (var i = 1; i <= 12; i++)
                    yield return new SelectListItem { Text = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i), Value = i.ToString() };
            }
        }
    }
}