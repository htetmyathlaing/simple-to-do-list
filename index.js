let inputElement = document.getElementById('todo_input');
let toDoListContainer = document.getElementById('to_do_list');
let btnClearAll = document.getElementById('btn-clear-all')
let toDoFilters = document.getElementsByClassName('filter')
let toDoFilterAll = document.getElementById('to-do-filter-all')
let toDoFilterFinished = document.getElementById('to-do-filter-finished')
let toDoFilterUnfinished = document.getElementById('to-do-filter-unfinished')

const LOCAL_STORAGE_KEY = 'to-do-items';
const TO_DO_FILTER = 'to-do-list-filter';
const TO_DO_FILTER_ALL = 'all';
const TO_DO_FILTER_FINISHED = 'finished';
const TO_DO_FILTER_UNFINISHED = 'unfinished';

let toDoList = [];
let toDoFilter = TO_DO_FILTER_ALL;

getFilterStatusFromLocalStorage();
setCurrentActiveFilter();

getToDoItemsFromLocalStorage();
renderUIWithFilter();

inputElement.addEventListener('keypress', (e) => {
    if (e.key == 'Enter' && e.target.value) {
        let toDoItem = addToToDoList(e.target.value)
        storeToDoItemsToLocalStorage()
        if (toDoFilter != TO_DO_FILTER_FINISHED) {
            insertToDoItemToDom(toDoItem)
        }
        e.target.value = ''
    }
})

btnClearAll.addEventListener('click', () => {
    /**
     * 1. make empty toDoList array
     * 2. remove stored item from LocalStorage
     * 3. Update UI
     */
    let removeAll = confirm('Are you sure to remove all items?')
    if (removeAll) {
        toDoList = [];
        // storeToDoItemsToLocalStorage()
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        removeAllToDoElementsFromDOM()
    }
})

function getToDoItemsFromLocalStorage() {
    let data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data != null) {
        toDoList = JSON.parse(data)
    }
}

function addToToDoList(toDoName) {
    let toDoItem = {
        id: new Date().getTime(),
        name: toDoName,
        done: false
    }
    toDoList.push(toDoItem)
    return toDoItem;
}

function storeToDoItemsToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDoList))
}

function initUI(todoItems) {
    removeAllToDoElementsFromDOM()
    todoItems.forEach(todo => {
        insertToDoItemToDom(todo)
    })
}

function insertToDoItemToDom(todo) {
    let todoItem = document.createElement('div')
    let formCheck = document.createElement('div')
    let checkBox = document.createElement('input')
    let label = document.createElement('label')
    let removeBtn = document.createElement('button')
    let id = todo.id

    checkBox.type = 'checkbox'
    checkBox.className = 'form-check-input'
    checkBox.id = 'to_do_' + id
    checkBox.checked = todo.done
    checkBox.setAttribute('data-id', id)
    checkBox.addEventListener('change', toDoItemStatusChangeHandler)

    label.className = `form-check-label ${todo.done ? 'done text-danger' : ''}`
    label.htmlFor = 'to_do_' + id
    label.textContent = todo.name

    formCheck.className = 'form-check'
    formCheck.appendChild(checkBox)
    formCheck.appendChild(label)

    removeBtn.type = 'button'
    removeBtn.className = 'btn-close'
    removeBtn.setAttribute('data-id', id)
    removeBtn.addEventListener('click', removeButtonHandler)

    todoItem.className = 'todo_item w-100 my-2 d-flex justify-content-between'
    todoItem.id = id
    todoItem.appendChild(formCheck)
    todoItem.appendChild(removeBtn)

    // toDoListContainer.appendChild(todoItem)
    toDoListContainer.prepend(todoItem)
}

function toDoItemStatusChangeHandler(e) {
    // e.target.nextElementSibling.classList.add('done')
    // e.target.nextElementSibling.classList.remove('done')
    /**
     * 1. update toDoList array
     * 2. store updated array into Local Storage
     * 3. update element in DOM
    */
    let id = e.target.getAttribute('data-id');

    // let index = toDoList.findIndex((item) => item.id == id)
    // toDoList[index].done = true

    toDoList = toDoList.map(item => {
        if (item.id == id) {
            item.done = !item.done
        }
        return item;
    })

    storeToDoItemsToLocalStorage()

    if (toDoFilter == TO_DO_FILTER_ALL) {
        e.target.nextElementSibling.classList.toggle('done')
        e.target.nextElementSibling.classList.toggle('text-danger')
    } else {
        removeToDoElementFromDOM(id)
    }
}

function removeButtonHandler(e) {
    //    e.target.parentElement.remove()
    let toDelete = confirm('Are you sure to remove?')
    if (toDelete) {
        let id = e.target.getAttribute('data-id');
        /**
        * 1. remove from toDoList array
        * 2. store updated array into Local Storage
        * 3. remove element from DOM
        */
        // let index = toDoList.findIndex((item) => item.id == id)
        // toDoList.splice(index, 1)
        toDoList = toDoList.filter(item => item.id != id)

        storeToDoItemsToLocalStorage()
        removeToDoElementFromDOM(id)
    }
}

function removeToDoElementFromDOM(id) {
    document.getElementById(id).remove()
}

function removeAllToDoElementsFromDOM() {
    toDoListContainer.innerHTML = ""
}

Array.from(toDoFilters).forEach(filter => {
    filter.addEventListener('change', toDoFilterHandler)
})

function toDoFilterHandler(e) {
    toDoFilter = e.target.getAttribute('data-status')
    storeFilterStatusToLocalStorage(toDoFilter)
    renderUIWithFilter()
}

function renderUIWithFilter() {
    let filteredToDoList = []
    switch (toDoFilter) {
        case TO_DO_FILTER_ALL:
            filteredToDoList = toDoList
            break;
        case TO_DO_FILTER_FINISHED:
            filteredToDoList = toDoList.filter(item => item.done)
            break;
        case TO_DO_FILTER_UNFINISHED:
            filteredToDoList = toDoList.filter(item => !item.done)
            break;
        default:
            filteredToDoList = toDoList
    }
    initUI(filteredToDoList)
}

function storeFilterStatusToLocalStorage(filter) {
    localStorage.setItem(TO_DO_FILTER, filter)
}

function getFilterStatusFromLocalStorage() {
    let data = localStorage.getItem(TO_DO_FILTER)
    if (data != null) {
        toDoFilter = data
    }
}

function setCurrentActiveFilter() {
    switch (toDoFilter) {
        case TO_DO_FILTER_ALL:
            toDoFilterAll.checked = true
            break;
        case TO_DO_FILTER_FINISHED:
            toDoFilterFinished.checked = true
            break;
        case TO_DO_FILTER_UNFINISHED:
            toDoFilterUnfinished.checked = true
            break;
    }
}

