//* Variáveis

const authToken = localStorage.getItem('authToken');
const nameRef = document.querySelector('#name');
const buttonCloseAppRef = document.querySelector('#closeApp');
const user = JSON.parse(localStorage.getItem('userData'));
const openedTasksRef = document.querySelector('#pendentes');
const closedTasksRef = document.querySelector('#terminadas');
const buttonAddRef = document.querySelector('#buttonAdd');
const newTaskRef = document.querySelector('#novaTarefa');

const requestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': authToken
}

var openedTasks = []
var closedTasks = []
var tasks = []

var texto = {
    novaTarefa: true

}

//* Funções

function checkValidity() {

    const errorsArray = Object.values(texto)

    const validity = errorsArray.every(item => item === false)

    buttonAddRef.disabled = !validity

}

function validateInput(inputRef) {

    const inputValid = inputRef.checkValidity()

    texto[inputRef.id] = !inputValid

    checkValidity()

    console.log()

}

function getUserData() {

    var requestConfig = {
        method: 'GET',
        headers: requestHeaders
    }

    fetch(`https://todo-api.ctd.academy/v1/users/getMe`, requestConfig).then(
        response => {
            if (response.ok) {

                console.log(response)
                findTasks()

                return response.json();

            } else {

                if (response.status === 401) {

                    logout()

                }
            }
        }
    ).then(response => {
        nameRef.innerHTML = response.firstName // retornei o json na linha 36 e inseri esse then com o innerhtml chamando o firstName conforme api informa.
    })

}

function logout() {

    window.location.href = './index.html'
    localStorage.clear()

}

function checkIfAuthTokenExist() {

    if (authToken === null) {

        logout()

    } else {

        getUserData()

    }

}


function findTasks() {

    

    resetSplitedTasks()

    fetch(`https://todo-api.ctd.academy/v1/tasks`, { headers: requestHeaders }).then(
        response => {
            if (response.ok) {
                response.json().then(
                    data => {
                        console.log(data)
                        tasks = data
                        splitTasks()
                    }
                )
            }
        }
    )

    loading()
}


function resetSplitedTasks() {

    openedTasks = []
    closedTasks = []

}

function updateTasks(task) {

    

    const taskData = {
        description: task.description,
        completed: true
    }

    console.log(taskData)

    var requestConfig = {
        method: 'PUT',
        headers: requestHeaders,
        body: JSON.stringify(taskData)

    }

    splitTasks()

    fetch(`https://todo-api.ctd.academy/v1/tasks/${task.id}`, requestConfig).then(
        response => {
            if (response.ok) {

                findTasks()

            }
        }
    )

}


function deleteTasks(task) {

    loading()

    var requestConfig = {
        method: 'DELETE',
        headers: requestHeaders,
    }

    fetch(`https://todo-api.ctd.academy/v1/tasks/${task.id}`, requestConfig).then(
        response => {
            if (response.ok) {

                findTasks()

            }
        }
    )


}


function addEventListenersToButtons() {

    const openedItems = Array.from(openedTasksRef.children)

    console.log(openedItems)

    openedItems.map(
        (item, index) => {

            const buttonRef = item.children[0]

            const currentTasksInArray = openedTasks[index]

            buttonRef.addEventListener('click', () => updateTasks(currentTasksInArray))

        }
    )

    const closedItems = Array.from(closedTasksRef.children)

    closedItems.map(
        (item, index) => {

            const buttonRef = item.children[0]

            const currentTasksInArray = closedTasks[index]

            buttonRef.addEventListener('click', () => deleteTasks(currentTasksInArray))

        }
    )

}

function insertTasksHTML() {

    openedTasksRef.innerHTML = ''
    closedTasksRef.innerHTML = ''


    openedTasks.map(
        tasks => {

            const createdAtDate = new Date(tasks.createdAt)
            const createAtFormatted = new Intl.DateTimeFormat('pt-BR').format(createdAtDate)


            openedTasksRef.innerHTML += `
        
            <li class="tarefa">
              <div class="not-done"></div>
              <div class="descricao">
                <p class="nome">${tasks.description}</p>
                <p class="timestamp">Criada em: ${createAtFormatted}</p>
              </div>
            </li>
        
            `

        }
    )

    closedTasks.map(
        tasks => {

            const createdAtDate = new Date(tasks.createdAt)
            const createAtFormatted = new Intl.DateTimeFormat('pt-BR').format(createdAtDate)

            console.log(tasks)

            closedTasksRef.innerHTML += `
         
            <li class="tarefa">
              <div class="not-done"> </div>
              <div class="descricao">
                <p class="nome">${tasks.description}</p>
                <p class="timestamp">Criada em: ${createAtFormatted}</p>
              </div>
            </li>
        
            `

        }
    )

    addEventListenersToButtons()

}

function splitTasks() {

    tasks.map(
        tasks => {

            if (!tasks.completed) {

                openedTasks.push(tasks)

            } else {

                closedTasks.push(tasks)

            }

        }
    )

    insertTasksHTML()

}


function createTask(event) {

    event.preventDefault()

    const taskData = {
        description: newTaskRef.value,
        completed: false
    }

    console.log(taskData)

    var requestConfig = {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(taskData)
    }


    fetch(`https://todo-api.ctd.academy/v1/tasks`, requestConfig).then(
        response => {
            if (response.ok) {

                findTasks()


            }
        }
    )

    newTaskRef.value = ''

}

function loading(){
    openedTasksRef.innerHTML = `    
    <div id="skeleton">
        <li class="tarefa">
            <div class="not-done"> </div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
        <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
    </div>`;

    closedTasksRef.innerHTML = `    
    <div id="skeleton">
        <li class="tarefa">
            <div class="not-done"> </div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
        <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
            <p class="nome">Nova tarefa</p>
            <p class="timestamp">Criada em: 15/07/21</p>
        </div>
        </li>
    </div>`;

}


//* Eventos

newTaskRef.addEventListener('keyup', () => validateInput(newTaskRef));
buttonAddRef.addEventListener('click', (event) => createTask(event));
buttonCloseAppRef.addEventListener('click', () => logout());
nameRef.addEventListener('keyup', () => validateInput(nameRef));


//* Chamada da função

checkIfAuthTokenExist();