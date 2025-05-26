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


function openModal(button) {
    const taskCard = button.closest('.task-card');

    document.getElementById('modalTitle').textContent = taskCard.dataset.title;
    document.getElementById('modalDueDate').textContent = taskCard.dataset.duedate;
    document.getElementById('modalPriority').textContent = taskCard.dataset.priority;
    document.getElementById('modalStatus').textContent = taskCard.dataset.status;
    document.getElementById('modalDescription').textContent = taskCard.dataset.description;
    // Add similar lines for modalCreatedTime, modalTags, modalAssignees if stored

    document.getElementById('taskModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

