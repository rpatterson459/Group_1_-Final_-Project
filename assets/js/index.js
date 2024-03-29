// allows this javascript page to use TaskManager Class from taskManager.js page.
import TaskManager from "./taskManager.js";


// Uncomment line 6 when wanting to test and comment out line 2 ES6 import------------------->
// var TaskManager = require("./taskManager");

// selectors -------------------------------------------------->
const inputName =  document.getElementById('taskName');
const inputDesc = document.getElementById('taskDescription');
const inputWho = document.getElementById('assignedTo');
const inputCal = document.getElementById('calendar');
const taskContainer = document.getElementById('taskContainer');
const btn = document.getElementById('submitBtn');
const doneBtn = document.getElementById('markedDone');

// creates new Object called newTask using TaskManager Class
// has to be declared above the call back function on btn 
// to prevent resetting array in newTask. This allows us
// to add multiple objects into array.
const newTask = new TaskManager();



// events ------------------------------------------------------->

window.addEventListener('DOMContentLoaded', () => {

    // on DOM load newTask.load function is called to grab any saved info 
    // from localstorage and setting it to the objects currentID and tasks array.
    newTask.load();

    // calls render function which returns a bunch of tasks with html/css filled out
    const content = newTask.render();

    // setting the html of taskcontainer to the saved tasks referenced by content.
    taskContainer.innerHTML = content;

    

})



// adds event + function to the submit button
btn.addEventListener('click', () => {

    // prevents page from resetting
    event.preventDefault();



    // function to create popup warning depending on field.
    const warningPop = (field) => {

         // creates div containing warning html
        const warning = document.createElement('div');
        warning.classList.add('warning', 'absolute', 'top-3/4', 'left-1/3', 'w-1/3');
        warning.setAttribute('id', 'warning');
        warning.innerHTML = `
            <div class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                <p class="font-bold">Warning!</p>
                <p>${field} has not been filled out.</p>
            </div>
        `;

        // if input fields are empty then add warning to form
        taskContainer.appendChild(warning);
    };
   


    // checks if any input field is empty
    if(!inputName.value){
        warningPop("Task_Name");
       
    } else if(!inputDesc.value){
        warningPop("Description");

    } else if(!inputWho.value){
        warningPop("Assigned_To");

    } else if(!inputCal.value){
        warningPop("Date");
        
    } else {

        // removes warning
        if(document.getElementById('warning') !== null){
            document.getElementById('warning').remove();
        };
        
        
        
        // stores all input fields values
        const taskName = inputName.value;
        const taskDesc = inputDesc.value;
        const who = inputWho.value;
        const cal = inputCal.value;
        

        // calls the addTask method in the newTask Object, passing in stored input field values.
        newTask.addTask(taskName, taskDesc, who, cal);
        

        // calls render function and saves reference in content var
        newTask.save();
        const content = newTask.render();

        // set taskContainers html  equal to content
        taskContainer.innerHTML = content;

        // clears inputfields
        inputName.value = " ";
        inputDesc.value = " ";
        inputWho.value = " ";
        inputCal.value = "";

    };
    

});



taskContainer.addEventListener('click', e => {

    
    const target = e.target;

    if(target.classList[0] === "done-button"){
        let parentTask = target.parentElement.parentElement;
        let taskId = +parentTask.dataset.id;
        let task = newTask.getTaskById(taskId);
        newTask.status = 'Done';


        if (newTask.status === 'Done') {
            e.target.classList.remove('visible');
            e.target.classList.add('invisible');
        };
    };


    // checks if button clicked has deleteIt class
    if(target.classList.contains('deleteIt')){

        // save clicked elements parent element
        let parentTask = target.parentElement;
        // get the id of element and + sign changes it to a number.
        let taskId = +parentTask.dataset.id;
       
        // deletes task by passing it the selected tasks id
        newTask.deleteTask(taskId);

        // save changed array to local
        newTask.save();

        // reloads data from local to change this.tasks array
        newTask.load();

        // renders content
        const content = newTask.render();
        taskContainer.innerHTML = content;
    };


    // checks to make sure what is clicked is details
    if(target.classList[0] === "details"){
        
        // stored data from inputs that are hidden inside the tasks
        // I assign variables to these data to allow it to be easier to add to new div.
        const taskDescription = target.parentElement.parentElement.children[3].innerHTML;
        const taskWho = target.parentElement.parentElement.children[4].innerHTML;
        const taskCal = target.parentElement.parentElement.children[5].innerHTML;

        // creates new div and adds content onto it based on above varibles.
        const newDiv = document.createElement('div')
        newDiv.classList.add('flex', 'flex-col', 'bg-white', 'absolute', 'h-fill', 'w-3/6', 'border-2', 'border-black', 'top-3/5', 'p-10', 'left-1/4')
        newDiv.setAttribute('id', 'popUp')
        newDiv.innerHTML += `
            <div class="flex flex-col">
                <h1 class="mb-3">Description</h1>
                <p class="border-2 border-black	h-20">${taskDescription}</p>
            </div>
            <br>
            <p>Assigned To: ${taskWho}</p>
            <br>
            <div class="flex justify-between">
                <p>Due By: ${taskCal}</p>
                <button class="closeIt">Close</button>
            </div>
            
        `;

        // adds newDiv to task container.
        taskContainer.appendChild(newDiv);
        
    };


    // checks if button has class called closeIt
    if(target.classList[0] === "closeIt"){

        // removes close buttons grandparent element.
        target.parentElement.parentElement.remove();
    };
});
 
  
