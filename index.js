const modal = document.querySelector('.backdrop')
const taskList = document.querySelector('#taskListBlock')
const addBtn = document.querySelector('.add-btn')
const closeBtn = document.querySelector('.close-btn')
const confirmBtn = document.querySelector('.confirm-btn')
const errorMessage = document.querySelector('.error-message')
const completedTaskList = document.querySelector('#completedTaskBlock')
const deleteAllBtn = document.querySelector('.delete-all')


// Массив с задачами

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach(renderTaskHTML)

checkEmptyTasksBlock()
checkEmptyCompletedTasksBlock()

addBtn.addEventListener('click', openModal)
closeBtn.addEventListener('click', closeModal)

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(e)
    }
})

document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (document.querySelector('#taskFormTextarea').value.trim() === '') {
            errorMessage.textContent = 'Введите текст'
            errorMessage.classList.remove('display-none')
            document.querySelector('#taskFormTextarea').focus()
            e.preventDefault()
            return
        }
        confirmBtn.click()
    }
})


deleteAllBtn.addEventListener('click', deleteAllCompletedTasks)

confirmBtn.addEventListener('click', addTask)

taskList.addEventListener('click', deleteTask)

taskList.addEventListener('click', completeTask)

taskList.addEventListener('click', editTask)

completedTaskList.addEventListener('click', returnTask)


function openModal() {
    modal.classList.remove('display-none')
    document.querySelector('#taskFormTextarea').focus()
}

function closeModal(e) {
    modal.classList.add('display-none')
    document.querySelector('#taskFormTextarea').value = ''
    errorMessage.classList.add('display-none')
    // Сброс перезагрузки страницы
    e.preventDefault()
}

function renderTaskHTML(task) {


    if (task.isDone == true) {
        let taskHTML =
            `
            <li id="${task.id}" class="taskItem doneTaskItem">
                <p class="task-text">
                    ${task.text}
                </p>
                <button class="delete-btn" type="button">
                    <img data-action="return" src="./icons8-close.svg">
                </button>
            </li>`

        completedTaskList.insertAdjacentHTML('beforeend', taskHTML)
    }

    if (task.isDone == false) {
        let taskHTML =
            `<li id="${task.id}" class="taskItem">
                <p class="task-text">
                    ${task.text}
                </p>
                <div class="controls">
                    <button class="done-btn" type="button">
                        <img data-action="complete" src="./icons8-done.svg">
                    </button>
                    <button class="delete-btn" type="button">
                        <img data-action="delete" src="./icons8-close.svg">
                    </button>
                    <button class="edit-btn" type="button">
                        <img data-action="edit" src="./icons8-edit.svg">
                    </button>
                </div>
            </li>`
        taskList.insertAdjacentHTML('beforeend', taskHTML)
    }


}

function addTask(e) {

    if (document.querySelector('#taskFormTextarea').value.trim() === '') {
        errorMessage.textContent = 'Введите текст'
        errorMessage.classList.remove('display-none')
        document.querySelector('#taskFormTextarea').focus()
        e.preventDefault()
        return
    }

    let taskTextByUser = document.querySelector('#taskFormTextarea').value

    // -----------------

    const newTask = {
        id: Date.now(),
        text: taskTextByUser,
        isDone: false
    }

    tasks.push(newTask)

    // -----------------

    let taskHTML =
        `<li id="${newTask.id}" class="taskItem">
                <p class="task-text">
                    ${newTask.text}
                </p>
                <div class="controls">
                    <button class="done-btn" type="button">
                        <img data-action="complete" src="./icons8-done.svg">
                    </button>
                    <button class="delete-btn" type="button">
                        <img data-action="delete" src="./icons8-close.svg">
                    </button>
                    <button class="edit-btn" type="button" >
                        <img data-action="edit" src="./icons8-edit.svg">
                    </button>
                </div>
        </li>`



    initialValue = taskTextByUser
    taskList.insertAdjacentHTML('beforeend', taskHTML)
    errorMessage.classList.add('display-none')
    document.querySelector('#taskFormTextarea').value = ''

    saveToLocalStorage()
    closeModal(e)
    checkEmptyTasksBlock()

}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') return

    const task = e.target.closest('li')
    const taskId = Number(task.id)

    tasks = tasks.filter(task => task.id !== taskId)
    saveToLocalStorage()
    task.remove()
    checkEmptyTasksBlock()
}

function completeTask(e) {
    if (e.target.dataset.action !== 'complete') return
    const task = e.target.closest('li')
    const taskId = Number(task.id)
    let taskText = task.querySelector('.task-text').innerText
    task.innerHTML = `
                            <p class="task-text">
                                ${taskText}
                            </p>
                            <button class="delete-btn" type="button">
                                <img data-action="return" src="./icons8-close.svg">
                            </button>
                        `


    const taskObject = tasks.find(task => task.id === taskId)

    taskObject.isDone = !taskObject.isDone
    saveToLocalStorage()

    completedTaskList.appendChild(task)

    checkEmptyTasksBlock()
    checkEmptyCompletedTasksBlock()
}

// Доделать кнопку редактировать и ещё всякого по мелочи

function returnTask(e) {
    if (e.target.dataset.action !== 'return') return

    const task = e.target.closest('li')
    let taskText = task.querySelector('.task-text').innerText
    task.innerHTML = `<p class="task-text">
                        ${taskText}
            </p>
            <div class="controls">
                <button class="done-btn" type="button">
                    <img data-action="complete" src="./icons8-done.svg">
                </button>
                <button class="delete-btn" type="button">
                    <img data-action="delete" src="./icons8-close.svg">
                </button>
                <button class="edit-btn" type="button" >
                    <img data-action="edit" src="./icons8-edit.svg">
                </button>
            </div>`


    const taskId = Number(task.id)
    const taskObject = tasks.find(task => task.id === taskId)

    taskObject.isDone = !taskObject.isDone
    saveToLocalStorage()

    taskList.appendChild(task)
    checkEmptyTasksBlock()
    checkEmptyCompletedTasksBlock()
}

function editTask(e) {

    if (e.target.dataset.action !== 'edit') return
    const task = e.target.closest('li')
    const taskText = task.firstElementChild.innerText


    task.innerHTML = `
                        <input type="text" value="${taskText}">
                        <div class="controls">
                            <button class="done-btn" type="button">
                                <img src="./icons8-done.svg">
                            </button>
                            <button class="delete-btn" type="button">
                                <img src="./icons8-close.svg">
                            </button>
                        </div>
                    `

    const input = task.firstElementChild
    input.focus()

    const applyBtn = task.querySelectorAll('.done-btn')
    const cancelBtn = task.querySelectorAll('.delete-btn')

    applyBtn.forEach(el => {
        el.addEventListener('click', applyChanges)
    });

    cancelBtn.forEach(el => {
        el.addEventListener('click', cancelChanges)
    })
}

function applyChanges(e) {
    const task = e.target.closest('li')
    const inputText = task.firstElementChild.value

    if (inputText == '') {
        task.firstElementChild.focus()
        return
    }

    task.innerHTML = `<p class="task-text">
                          ${inputText}
                      </p>
                      <div class="controls">
                      <button class="done-btn" type="button">
                        <img data-action="complete" src="./icons8-done.svg">
                      </button>
                      <button class="delete-btn" type="button">
                        <img data-action="delete" src="./icons8-close.svg">
                      </button>
                      <button class="edit-btn" type="button" >
                        <img data-action="edit" src="./icons8-edit.svg">
                      </button>
                      </div>`

    const taskId = Number(task.id)
    const taskObject = tasks.find(task => task.id === taskId)
    taskObject.text = inputText
    saveToLocalStorage()
}

function cancelChanges(e) {

    const task = e.target.closest('li')
    const oldInputText = task.querySelector('input').defaultValue
    task.innerHTML = `<p class="task-text">
                        ${oldInputText}
                      </p>
                      <div class="controls">
                      <button class="done-btn" type="button">
                        <img data-action="complete" src="./icons8-done.svg">
                      </button>
                      <button class="delete-btn" type="button">
                        <img data-action="delete" src="./icons8-close.svg">
                      </button>
                      <button class="edit-btn" type="button" >
                        <img data-action="edit" src="./icons8-edit.svg">
                      </button>
                      </div>`
}

function checkEmptyTasksBlock() {
    if (tasks.length === 0 || taskList.children.length == 0) {
        const emptyTasksBlockHTML = `
                                    <div id="emptyTaskBlock">
                                        <p>
                                        На данный момент задач нет <br>
                                        ヽ(・∀・)ﾉ
                                        </p>
                                    </div>
                                   `

        taskList.insertAdjacentHTML('beforebegin', emptyTasksBlockHTML)
    }

    if (tasks.length > 0) {

        if (taskList.children.length == 0) {
            return
        }
        const emptyTasksBlock = document.querySelector('#emptyTaskBlock')
        emptyTasksBlock ? emptyTasksBlock.remove() : null
    }
}

function checkEmptyCompletedTasksBlock() {
    if (completedTaskList.children.length == 0) {
        const emptyCompletedTaskBlock = `
                                        <div id="emptyCompletedTaskBlock">
                                            <p>Нету завершённых задач</p>
                                        </div>
                                        `
        completedTaskList.insertAdjacentHTML('beforebegin', emptyCompletedTaskBlock)
    }

    if (completedTaskList.children.length > 0) {
        const emptyCompletedTaskBlock = document.querySelector('#emptyCompletedTaskBlock')
        emptyCompletedTaskBlock ? emptyCompletedTaskBlock.remove() : null
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function deleteAllCompletedTasks() {
    while (completedTaskList.firstChild) {
        completedTaskList.removeChild(completedTaskList.firstChild);
    }

    // Оставляем только те, которые не выполнены
    tasks = tasks.filter(task => task.isDone == false)

    saveToLocalStorage()
    window.location.reload()
}