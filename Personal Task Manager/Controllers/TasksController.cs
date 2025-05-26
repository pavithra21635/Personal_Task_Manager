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
        [ValidateAntiForgeryToken]
        public IActionResult Create(TaskModel task)
        {
            task.Status = "To Do"; // Automatically set status

            if (ModelState.IsValid)
            {
                _context.Tasks.Add(task);
                _context.SaveChanges();

                 TempData["SuccessMessage"] = "Task created successfully!";
                

                return RedirectToAction("Create", "Tasks");
            }

            //// Debugging model errors
            //var errors = ModelState.Values.SelectMany(v => v.Errors)
            //                              .Select(e => e.ErrorMessage).ToList();
            //TempData["SuccessMessage"] = "Model invalid: " + string.Join(", ", errors);

            return View(task);
        }

        [HttpPost]
        public IActionResult UpdateStatus(int id, string newStatus)
        {
            var task = _context.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
                return NotFound();

            task.Status = newStatus;
            _context.SaveChanges();

            return Ok();
        }

        public IActionResult All()
        {
            var tasks = _context.Tasks.ToList(); // Adjust based on your data source
            return View(tasks);
        }

        public IActionResult ViewTasks()
        {
            var tasks = _context.Tasks.ToList(); // Fetch tasks from DB or service
            return View("ViewTasks", tasks);     // Explicitly specify view name
        }


    }
}
