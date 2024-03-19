import Kanban from "./kanban.js";


const todo = document.querySelector(".cards.todo")
const pending = document.querySelector(".cards.pending")
const completed = document.querySelector(".cards.completed")

const taskbox = [todo, pending, completed]

function addTaskCard(task, index) {
    const element = document.createElement("form")
    element.classList = "card"
    element.draggable = true
    element.dataset.id = task.taskId
    element.innerHTML += `
    <input value="${task.content}" type="text" name="task" autocomplete="off" disabled="disabled">
    <div>
    <span class="task-id">#${task.taskId}</span>
    <span>
    <button class="bi bi-pencil edit" data-id="${task.taskId}"></button>
    <button class="bi bi-check-lg update hide" data-id="${task.taskId}" data-column=${index}></button>
    <button class="bi bi-trash3 delete" data-id="${task.taskId}"></button>
    </span>
    </div>`

    taskbox[index].appendChild(element)
}
function checkEmptyCard() {
    taskbox.forEach(column => {
        if (column.previousElementSibling.lastChild.previousSibling.textContent == 0) {
            column.nextElementSibling.classList.remove('hide')
        } else {
            if (!column.nextElementSibling.classList.contains('hide')) {
                column.nextElementSibling.classList.add('hide')
            }
        }
    })
}


Kanban.getAllTask().forEach((tasks, index) => {
    tasks.forEach(task => {
        addTaskCard(task, index)
    });
})

const addForm = document.querySelectorAll(".add")
addForm.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault()
        if (form.task.value) {
            const task = Kanban.insertTask(form.submit.dataset.id, form.task.value.trim())
            addTaskCard(task, form.submit.dataset.id)
            checkEmptyCard()
        }
        form.reset()
    })
})

taskbox.forEach(column => {
    column.addEventListener('click', event => {
        event.preventDefault()

        const formInput = event.target.parentElement.parentElement.previousElementSibling

        if (event.target.classList.contains('edit')) {
            formInput.removeAttribute('disabled')
            event.target.classList.add('hide')
            event.target.nextElementSibling.classList.remove('hide')
        }

        if (event.target.classList.contains('update')) {
            const content = formInput.value.trim()

            formInput.setAttribute('disabled', 'disabled')
            event.target.classList.add('hide')
            event.target.previousElementSibling.classList.remove('hide')

            const taskId = event.target.dataset.id
            const columnId = event.target.dataset.column

            if (content) {
                Kanban.updateTask(
                    taskId, {
                    columnId: columnId,
                    content: content
                }
                )
            }
            location.reload()
        }

        if (event.target.classList.contains('delete')) {
            formInput.parentElement.remove()
            Kanban.deleteTask(event.target.dataset.id)
            checkEmptyCard()
        }

    })

    column.addEventListener('dragstart', event => {
        if (event.target.classList.contains('card')) {
            event.target.classList.add('dragging')
        }
    })

    column.addEventListener('dragover', event => {
        const card = document.querySelector('.dragging')
        column.appendChild(card)


    })

    column.addEventListener('dragend', event => {

        if (event.target.classList.contains('card')) {
            event.target.classList.remove('dragging')

            const taskId = event.target.dataset.id
            const columnId = event.target.parentElement.dataset.id
            const content = event.target.task.value

            Kanban.updateTask(
                taskId, {
                columnId: columnId,
                content: content
            }
            )
            checkEmptyCard()
        }
    })
})

checkEmptyCard()
