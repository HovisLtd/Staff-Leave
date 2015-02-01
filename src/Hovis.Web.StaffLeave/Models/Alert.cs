namespace Hovis.Web.StaffLeave.Models
{
    public class Alert
    {
        public Alert(string type, string title, string message)
        {
            Type = type;
            Title = title;
            Message = message;
        }

        public string Type { get; set; }

        public string Title { get; set; }

        public string Message { get; set; }
    }
}