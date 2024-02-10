﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InnovuraTaskCraftUI.Models
{
    public class Label
    {
        public int Id { get; set; }
        public string LabelName { get; set; }
        public string Color { get; set; }
        public TimeSpan TimeSpan { get; set; }

        public ICollection<TaskItem> Tasks { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }

}
