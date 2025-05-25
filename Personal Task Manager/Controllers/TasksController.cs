using Microsoft.AspNetCore.Mvc;
using Personal_Task_Manager.Models;
using Personal_Task_Manager.Data;

namespace Personal_Task_Manager.Controllers
{
    public class TasksController : Controller
    {
        private readonly ApplicationDbContext _context;

        public TasksController(ApplicationDbContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var tasks = _context.Tasks.ToList();
            return View(tasks);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(TaskModel task)
        {
            if (ModelState.IsValid)
            {
                _context.Tasks.Add(task);
                _context.SaveChanges();

                TempData["SuccessMessage"] = "Task created successfully!";

                return RedirectToAction("Create", "Tasks");
            }
            return View(task);
        }
    }
}
