// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


let draggedTaskId = null;

function drag(event) {
    draggedTaskId = event.target.dataset.id;
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, newStatus) {
    event.preventDefault();

    const taskCard = document.getElementById('task-' + draggedTaskId);
    event.currentTarget.appendChild(taskCard);

    taskCard.dataset.status = newStatus;

    $.ajax({
        url: '/Tasks/UpdateStatus',
        type: 'POST',
        data: {
            id: draggedTaskId,
            newStatus: newStatus
        },
        success: function () {
            console.log("Status updated successfully.");
        },
        error: function () {
            alert("Failed to update task status.");
        }
    });
}

function toggleFilterDropdown() {
    const dropdown = document.getElementById('filterDropdown');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
}

function applyFilter(type) {
    document.getElementById('filterDropdown').style.display = 'none';

    const priorityOrder = { "high": 1, "medium": 2, "low": 3 };

    document.querySelectorAll('.task-column').forEach(column => {
        const cards = Array.from(column.querySelectorAll('.task-card'));

        let sortedCards = cards;

        if (type === 'Priority') {
            sortedCards = cards.sort((a, b) => {
                return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
            });
        } else if (type === 'DueDate') {
            sortedCards = cards.sort((a, b) => {
                return new Date(a.dataset.duedate) - new Date(b.dataset.duedate);
            });
        }

        // Clear column & re-append sorted cards
        cards.forEach(card => card.remove());
        sortedCards.forEach(card => column.appendChild(card));
    });
}

// Optional: close dropdown on outside click
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('filterDropdown');
    const button = document.querySelector('.filter-button');
    if (!dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});


//function openModal(button) {
//    const taskCard = button.closest('.task-card');

//    document.getElementById('modalTitle').textContent = taskCard.dataset.title;
//    document.getElementById('modalStartDate').textContent = taskCard.dataset.StartDate;
//    document.getElementById('modalDueDate').textContent = taskCard.dataset.duedate;
//    document.getElementById('modalPriority').textContent = taskCard.dataset.priority;
//    document.getElementById('modalStatus').textContent = taskCard.dataset.status;
//    document.getElementById('modalDescription').textContent = taskCard.dataset.description;
//    // Add similar lines for modalCreatedTime, modalTags, modalAssignees if stored

//    document.getElementById('taskModal').style.display = 'flex';
//}

//function closeModal() {
//    document.getElementById('taskModal').style.display = 'none';
//}


function openModal(element) {
    const taskCard = element.closest(".task-card");

    // Extract data from data attributes
    const title = taskCard.dataset.title;
    const description = taskCard.dataset.description;
    const dueDate = taskCard.dataset.duedate;
    const status = taskCard.dataset.status;
    const priority = taskCard.dataset.priority;

    // Optionally extract other fields if available (startDate, tags, etc.)
    const startDate = taskCard.dataset.startdate || "";
    const createdDate = taskCard.dataset.createddate || "";

    // Set values into modal form fields
    document.getElementById("modalTaskId").value = taskCard.dataset.id;

    document.getElementById("modalTitle").value = title;
    document.getElementById("modalDescription").value = description;
    document.getElementById("modalDueDate").value = formatDateForInput(dueDate);
    document.getElementById("modalStatus").value = status;
    document.getElementById("modalPriority").value = capitalize(priority);
    document.getElementById("modalStartDate").value = formatDateForInput(startDate);
    document.getElementById("modalCreatedDate").value = formatDateForInput(createdDate);

    // Show modal
    document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
}

function formatDateForInput(dateString) {
    if (!dateString) return "";

    // Ensure it's in format suitable for input[type=datetime-local]
    const date = new Date(dateString);
    const iso = date.toISOString();
    return iso.slice(0, 16); // "yyyy-MM-ddTHH:mm"
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function updateTask() {
    const updatedTask = {
        Id: document.getElementById("modalTaskId").value,
        Title: document.getElementById("modalTitle").value,
        StartDate: document.getElementById("modalStartDate").value,
        DueDate: document.getElementById("modalDueDate").value,
        Status: document.getElementById("modalStatus").value,
        Priority: document.getElementById("modalPriority").value,
        CreatedDate: document.getElementById("modalCreatedDate").value,
        Description: document.getElementById("modalDescription").value
    };

    $.ajax({
        url: '/Tasks/UpdateTask',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updatedTask),
        success: function () {
            // ✅ Show temporary success message
            const msg = document.getElementById("updateSuccessMessage");
            msg.style.display = "block";
            msg.style.opacity = "1";

            setTimeout(() => {
                msg.style.display = "none";
            }, 3000);

            // Optionally refresh or delay reload
            setTimeout(() => location.reload(), 3100); // Refresh view to show changes
        },
        error: function () {
            alert("Failed to update task.");
        }
    });
}





function deleteTask() {
    //const confirmed = confirm("Are you sure you want to delete this task?");
    //if (!confirmed) return;

    const taskId = document.getElementById("modalTaskId").value;
    openDeleteModal(taskId);

    //$.ajax({
    //    url: '/Tasks/DeleteTask',  // Make sure your backend route matches this
    //    type: 'POST',              // or 'DELETE' if your backend supports it
    //    data: { id: taskId },
    //    success: function () {
    //        // Remove the task card from the UI
    //        const taskCard = document.getElementById('task-' + taskId);
    //        if (taskCard) {
    //            taskCard.remove();
    //        }

    //        // Close the modal
    //        closeModal();

    //        /*alert("Task deleted successfully.");*/
    //    },
    //    error: function () {
    //        alert("Failed to delete task.");
    //    }
    //});
}

let taskIdToDelete = null;

function openDeleteModal(taskId) {
    taskIdToDelete = taskId;
    document.getElementById("deleteConfirmModal").style.display = "flex";
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteConfirmModal");
    if (modal) {
        modal.style.display = "none";
    }
    taskIdToDelete = null;
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
        if (!taskIdToDelete) return;

        $.ajax({
            url: '/Tasks/DeleteTask',
            type: 'POST',
            data: { id: taskIdToDelete },
            success: function () {
                const taskCard = document.getElementById('task-' + taskIdToDelete);
                if (taskCard) {
                    taskCard.remove();
                }

                closeDeleteModal();
                closeModal(); // Close task detail modal, if open
                taskIdToDelete = null;
            },
            error: function () {
                alert("Failed to delete task.");
                closeDeleteModal();
            }
        });
    });
});

