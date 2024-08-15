const task1 = document.querySelector('.task');
const pendingArea = document.querySelector('.pendingTasks');
const inProgressArea = document.querySelector('.in-progressTasks');
const completedArea = document.querySelector('.completedTasks');

inProgressArea.addEventListener('dragover', (event)=>{
  event.preventDefault();
})

inProgressArea.addEventListener('drop', (event)=>{
  inProgressArea.append(task1);
  console.log('drop');            
})

/** codigo del modal para crear tarea **/
const btnAddTaskPending = document.querySelector('.pending').querySelector('.addTask');

const modalToCreateTask = document.querySelector('#createTask');

const btnCloseModalToCreateTask = document.querySelector('.close')

console.log(btnCloseModalToCreateTask);

btnAddTaskPending.addEventListener('click', ()=>{
  modalToCreateTask.showModal();
})

btnCloseModalToCreateTask.addEventListener('click', ()=>{
  modalToCreateTask.close()
})