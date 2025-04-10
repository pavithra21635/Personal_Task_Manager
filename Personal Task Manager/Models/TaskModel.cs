namespace Personal_Task_Manager.Models
{
    public class TaskModel
    {
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public string Priority { get; set; } // High / Medium
        public bool IsCompleted { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
