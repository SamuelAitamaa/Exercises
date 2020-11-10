// tasks.js
// This script manages a to-do list.

// Need a global variable:
var tasks = [];
'use strict';
var message = '';

// Function called when the form is submitted.
// Function adds a task to the global array.
function addTask() {

    // Get the task:
    var task = document.getElementById('task');

    // Reference to where the output goes:
    var output = document.getElementById('output');

    // For the output:


    if (task.value) {
    
        // Add the item to the array:
        tasks.push(task.value);
        
        // Update the page:
        message = '<h2>To-Do</h2><ol>';
        for (var i = 0, count = tasks.length; i < count; i++) {
            message += '<li>' + tasks[i] + '</li>';
        }
        message += '</ol>';
        output.innerHTML = message;
        
    } // End of task.value IF.

    // Return false to prevent submission:
    return false;
    
} // End of addTask() function.

function removeDuplicates() {
    var output = document.getElementById('output');

    for(var i=0; i < tasks.length; i++) {
        while (tasks.length >= 2 && tasks[i] === tasks[i + 1]) {
            tasks.splice(i, 1);
        }
    }
            message = '<h2>To-Do</h2><ol>';
            for (var i = 0, count = tasks.length; i < count; i++) {
                message += '<li>' + tasks[i] + '</li>';
            }

    message += '</ol>';
    output.innerHTML = message;
    return false;

}
// Initial setup:
function init() {
    'use strict';
    document.getElementById('theForm').onsubmit = addTask;
    document.getElementById('remove').onclick = removeDuplicates;
} // End of init() function.
window.onload = init;