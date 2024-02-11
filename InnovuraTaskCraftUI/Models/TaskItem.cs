using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InnovuraTaskCraftUI.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string TaskName { get; set; }
        public string State { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? StartedDate { get; set; }
        public DateTime? EndDate { get; set; }

        public int LabelId { get; set; }
        public Label Label { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }

}
