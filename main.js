'use strict';
/** La varibales y Funciones para la interacion del darg an drop **/
let task;
let mood = document.querySelector('.mood');
const pendingAreaTask = document.querySelector('.pendingTasks');
const pendingArea = document.querySelector('.pending');
const inProgressAreaTask = document.querySelector('.in-progressTasks');
const inProgressArea = document.querySelector('.in-progress');
const completedAreaTask = document.querySelector('.completedTasks');
const completedArea = document.querySelector('.completed');

pendingAreaTask.addEventListener('dragstart', (event)=>{
  task = event.target
})
inProgressAreaTask.addEventListener('dragstart', (event)=>{
  task = event.target
})
completedAreaTask.addEventListener('dragstart', (event)=>{
  task = event.target
})

pendingArea.addEventListener('dragover', (event)=>{
  event.preventDefault();
})

pendingArea.addEventListener('drop', (event)=>dropTask('pending', event));

inProgressArea.addEventListener('dragover', (event)=>{
  event.preventDefault();
})

inProgressArea.addEventListener('drop', (event)=>dropTask('in-progress', event));

completedArea.addEventListener('dragover', (event)=>{
  event.preventDefault();
})

completedArea.addEventListener('drop', (event)=>dropTask('completed', event));

/** codigo del modal para crear tarea **/
const btnAddTaskPending = document.querySelector('.pending').querySelector('.addTask');

const modalToCreateTask = document.querySelector('#createTask');
const modalToEditTask = document.querySelector('#editTask');

const btnCloseModalToEditTask = document.querySelector('#editTask div > .close');
const btnCloseModalToCreateTask = document.querySelector('#createTask  div > .close')

btnAddTaskPending.addEventListener('click', ()=>{
  modalToCreateTask.showModal();
})

btnCloseModalToCreateTask.addEventListener('click', ()=>{
  modalToCreateTask.close()
})
btnCloseModalToEditTask.addEventListener('click', ()=>{
  modalToEditTask.close()
})

/** Codigo para guardar y agregar le informacion a la columna respectiva  **/

/** Codigo del modal de nueva tarea y edicion de tareas **/
const form = document.querySelector('.dialog');
const form2 = document.querySelector('.dialog2');

form.addEventListener('submit', (event)=>{
  event.preventDefault();
  const titleActivity = form.elements['title'].value;
  const descriptionActivity = form.elements['description'].value;
  const priorityActivity = form.elements['priority'].value;
  appendActivity({titleActivity: titleActivity, descriptionActivity: descriptionActivity, priorityActivity: priorityActivity});
  form.elements['title'].value = '';
  form.elements['description'].value = '';
  form.elements['priority'].value = 'low';
  modalToCreateTask.close();
})

form2.addEventListener('submit', (event)=>{
  event.preventDefault();
  const titleActivity = form2.elements['title'].value;
  const descriptionActivity = form2.elements['description'].value;
  const priorityActivity = form2.elements['priority'].value;
  const date = form2.elements['title'].getAttribute('date');
  const area = form2.elements['title'].getAttribute('colum');
  const idTask = form2.elements['title'].getAttribute('idTask');
  task.closest('.task').remove();
  appendActivity({titleActivity: titleActivity, descriptionActivity: descriptionActivity, priorityActivity: priorityActivity, date: date, status:area, isIdExisting:idTask});
  form2.elements['title'].value = '';
  form2.elements['description'].value = '';
  modalToEditTask.close();  
})

/** edicion y eliminacion de tareas **/
pendingAreaTask.addEventListener('click', (event)=> modifyTasks(event, 'pending'))
inProgressAreaTask.addEventListener('click', (event)=> modifyTasks(event, 'in-progress'))
completedAreaTask.addEventListener('click', (event)=> modifyTasks(event, 'completed'))

function modifyTasks(event, state) {
  if (event.target.classList.contains('delete')) {
    event.target.closest('.task').remove();
    const idOfTasks = event.target.closest('.task').getAttribute('idtaks')
    let tasks = getTasks()
    for (const status of [state]) {
      if (tasks[status][idOfTasks]) {
        delete tasks[status][idOfTasks];
      }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }else if (event.target.classList.contains('edit')) {
    task = event.target;
    const father = event.target.closest('.task')
    let title = father.querySelector('h3').textContent.slice(0, -1);
    const description = father.querySelector('.description').textContent
    let parts = title.split(/(?<=.)/u);
    if (parts.length > 1) {
      parts.pop()
    }
    title = parts.join('');
    const relevance = father.querySelector('h3 > span').getAttribute('relevance')
    const idTask = father.getAttribute('idtaks')
    const date = father.querySelector('p:last-child').textContent
    form2.elements['title'].value = title;
    form2.elements['title'].setAttribute('date', date)
    form2.elements['title'].setAttribute('colum', state)
    form2.elements['title'].setAttribute('idTask', idTask)
    form2.elements['description'].value = description;
    form2.elements['priority'].value = relevance === 'high' ? 'high' : relevance === 'mid' ? 'mid' : 'low';
    modalToEditTask.showModal()
  }
}

/** Funcion creadora de las tareas **/
function appendActivity({titleActivity, descriptionActivity = 'Sin descripcion de la actividad', priorityActivity = 'low', date = new Date(), status = 'pending', isIdExisting = false}) {
  const divContainer = document.createElement('div');
  divContainer.classList.add('task');
  if (mood.classList.contains('dark')) {
    divContainer.classList.add('darkMode');
  }
  divContainer.setAttribute('draggable', 'true');
  divContainer.setAttribute('idTaks', isIdExisting ? isIdExisting : idOfTasks())
  const spanEdit = document.createElement('span');
  spanEdit.classList.add('edit');
  spanEdit.innerText = '🔨';
  const spanDelete = document.createElement('span');
  spanDelete.classList.add('delete');
  spanDelete.innerText = '❌';
  const h3 = document.createElement('h3');
  h3.textContent = titleActivity;
  const span = document.createElement('span');
  span.textContent = priorityActivity === 'low' ? '🟡' : priorityActivity === 'mid' ? '🟠' : priorityActivity ==='high' ? '🔴' : '🟣' ;
  span.setAttribute('relevance', priorityActivity === 'low' ? 'low' : priorityActivity === 'mid' ? 'mid' : priorityActivity ==='high' ? 'high' : 'low')
  h3.appendChild(span);
  const pDescription = document.createElement('p');
  pDescription.classList.add('description');
  pDescription.textContent = descriptionActivity;
  const pDate = document.createElement('p');
  const idTask = divContainer.getAttribute('idTaks')
  console.log(idTask);  
  switch (status) {
    case 'pending':
      const formattedDateTime = date.toLocaleString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });      
      pDate.textContent = formattedDateTime;    
      divContainer.append(spanEdit, spanDelete, h3, pDescription, pDate);
      pendingAreaTask.insertAdjacentElement('afterbegin', divContainer);
      updateLocalStorage({titleActivity, descriptionActivity, priorityActivity, date, status, idTask, newPosition: status})
      break;
    case 'in-progress':
      pDate.textContent = date
      divContainer.append(spanEdit, spanDelete, h3, pDescription, pDate);
      inProgressAreaTask.insertAdjacentElement('afterbegin', divContainer);
      updateLocalStorage({titleActivity, descriptionActivity, priorityActivity, date, status, idTask, newPosition: status})
      break;
    case 'completed':
      pDate.textContent = date
      divContainer.append(spanEdit, spanDelete, h3, pDescription, pDate);
      completedAreaTask.insertAdjacentElement('afterbegin', divContainer);
      updateLocalStorage({titleActivity, descriptionActivity, priorityActivity, date, status, idTask, newPosition: status})
      break;
    default:
      alert('Error, no se reconoce el estado de la actividad, debe agregarlo a una casilla existente');
      break;
  }
}

function idOfTasks(){
  let counter = 1;
  let id = JSON.parse(localStorage.getItem('id'));
  console.log(id);
  if(id) {
    counter = ++id;
    console.log(counter);
    localStorage.setItem('id', JSON.stringify(counter));
    return counter
  }else{
    console.log(counter);
    localStorage.setItem('id', JSON.stringify(counter));
    return counter
  }
}

function updateLocalStorage({titleActivity, descriptionActivity , priorityActivity, date, status, idTask, newPosition = 'pending'}) {
  let tasks = getTasks();
  if (Object.keys(tasks).length === 0) {
    tasks['pending'] ={}
    tasks['in-progress'] = {}
    tasks['completed'] = {}
    const obj ={
      idTask,
      titleActivity,
      descriptionActivity,
      priorityActivity,
      date,
      status
    }
    console.log(status);
    console.log(newPosition);  
    tasks[newPosition][idTask] = obj
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }else{
    const obj ={
      idTask,
      titleActivity,
      descriptionActivity,
      priorityActivity,
      date,
      status
    }
    for (const statusType of ['pending', 'in-progress', 'completed']) {
      if (tasks[statusType][idTask]) {
        console.log('entro en el ciclo del if del for of' + tasks[statusType][idTask]);        
        delete tasks[statusType][idTask]; 
      }
    }
    console.log(status);
    console.log(newPosition);        
    tasks[newPosition][idTask] = obj
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
  }
}

function getTasks(){
  if (localStorage.getItem('tasks')) {
    return JSON.parse(localStorage.getItem('tasks'));
  }else{
    return {}
  }
}

function dropTask(area, event) {
  let appendArea = area === 'pending' ? pendingAreaTask : area === 'in-progress' ? inProgressAreaTask : completedAreaTask;
  console.log(appendArea);  
  console.log(task);  
  appendArea.append(task);
  let container = event.currentTarget;
  console.log(container);  
  const child = container.querySelector('.task:last-child')
  const idTask = child.getAttribute('idtaks')
  console.log(idTask);  
  let titleActivity = child.querySelector('h3').textContent.slice(0, -1);
  let parts = titleActivity.split(/(?<=.)/u)
  if (parts.length > 1) {
    parts.pop()
  }
  titleActivity = parts.join('');
  const descriptionActivity = child.querySelector('.description').textContent
  let priorityActivity = child.querySelector('h3 > span').textContent
  priorityActivity = priorityActivity === '🟡' ? 'low' : priorityActivity === '🟠' ? 'mid' : priorityActivity ==='🔴' ? 'high' : 'low'
  const date = child.querySelector('.description ~ p').textContent
  console.log(area);  
  const status = area;
  console.log(status);  
  updateLocalStorage({idTask, titleActivity, descriptionActivity, priorityActivity, date, status, newPosition: area}); 
}

function readyTask() {
  const tasks = getTasks();
  if (Object.keys(tasks).length > 0) {
    for (const statusType of ['pending', 'in-progress', 'completed']) {     
      if(Object.keys(statusType).length > 0){           
        for (const onlyTask in tasks[statusType]) {         
          const id = tasks[statusType][onlyTask].idTask;
          const title = tasks[statusType][onlyTask].titleActivity;
          const description = tasks[statusType][onlyTask].descriptionActivity;
          const priority = tasks[statusType][onlyTask].priorityActivity;
          const date = tasks[statusType][onlyTask].date;
          const statusTask = tasks[statusType][onlyTask].status;
          console.log({id, title, description, priority, date, statusTask});
          appendActivity({isIdExisting: id, titleActivity: title, descriptionActivity: description, priorityActivity: priority, date, status: statusTask});
        }
      }
    }
  }
}
readyTask()

document.addEventListener('DOMContentLoaded', ()=>{
  const typeMood = localStorage.getItem('mood');
  console.log(typeMood);  
  if (typeMood === '⭐') {
    moodChange()
  }
})

/** codigo del mood **/
mood.addEventListener('click', ()=>{
  moodChange()
})

function moodChange() {
  mood.classList.toggle('dark');
  const body = document.querySelector('body');
  body.classList.toggle('darkMode');
  const h1 = document.querySelector('h1');
  h1.classList.toggle('darkMode');
  pendingArea.classList.toggle('darkMode');
  inProgressArea.classList.toggle('darkMode');
  completedArea.classList.toggle('darkMode');
  pendingAreaTask.classList.toggle('darkMode');
  inProgressAreaTask.classList.toggle('darkMode');
  completedAreaTask.classList.toggle('darkMode');
  const allTasks = document.querySelectorAll('.task');
  for (const task of allTasks) {
    task.classList.toggle('darkMode');
  }
  if (mood.classList.contains('dark')) {
    localStorage.setItem('mood', '⭐');
  }else{
    localStorage.setItem('mood', '🌙');
  }
}