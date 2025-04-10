using Microsoft.AspNetCore.Mvc;
using Personal_Task_Manager.Models;

namespace Personal_Task_Manager.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            var tasks = new List<TaskModel>
        {
            new TaskModel { Title = "IOS App design", DueDate = DateTime.Parse("2025-05-02"), Priority = "High", IsCompleted = true },
            new TaskModel { Title = "Final Document", DueDate = DateTime.Parse("2025-05-03"), Priority = "High", IsCompleted = false },
            new TaskModel { Title = "IPC CW report", DueDate = DateTime.Parse("2025-05-03"), Priority = "Medium", IsCompleted = false },
            new TaskModel { Title = "Agile CW report", DueDate = DateTime.Parse("2025-05-03"), Priority = "Medium", IsCompleted = false },
        };


            return View(tasks);
        }
    }
}
