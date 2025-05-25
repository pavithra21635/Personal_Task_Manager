using System.ComponentModel.DataAnnotations;

namespace Personal_Task_Manager.Models
{
    public class TaskModel
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }           // ✅ Needed for form
        public DateTime DueDate { get; set; }
        public string Description { get; set; }           // ✅ Needed for form
        public string Priority { get; set; }              // "High", "Medium", "Low"
        public bool IsCompleted { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
