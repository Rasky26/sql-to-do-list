// Import needed modules
import { rebuildToDoList } from "../modules/domElements.modules.js"

// Await the HTML document and associated elements to load
$(onDocumentLoad)


// Function that runs when the HTML is fully loaded.
function onDocumentLoad() {

    // Pull in the To Do list on page load
    getToDoList()

    // Click listener for submitting a new to-do item
    $("#form--to-do-entry").submit("#submit-new-item", handleToDoSubmission)

    // Click listener for completing a to-do item
    $(".to-do-list").on("change", ".complete-button", toggleToDoComplete)

    // Click listener for deleting a specific to-do item
    $(".to-do-list").on("click", ".delete-button", handleDeleteToDo)
}


// Function that handles a new To Do submission upon clicking `Submit`
function handleToDoSubmission(event) {

    // Prevent the reload of the page upon submission
    event.preventDefault()

    // Assemble an object based on the To Do input fields
    let newToDo = {
        taskName: $("#to-do-name").val()
    }

    // Post the information to the server
    postNewToDo(newToDo)
    console.log("BEFORE")
    // Load in the updated list to the DOM
    getToDoList()
    console.log("AFTER")
}


// Function that POSTs a new To Do to the DB.
function postNewToDo(toDoObj) {

    // Send a new To Do item to the server
    $.ajax({
        url: "/to-do",
        method: "POST",
        data: toDoObj,
    })
    // Get a successful response
    .then((res) => {
        console.log("Successful POST made.")
    })
    // Display if a POST error occurred
    .catch((err) => {
        console.log(`
            Error on script.js postNewToDo()

            ${err}
        `)
    })
}


// Function that GETs list of all To Do's from the server and
// displays them to the DOM
function getToDoList() {

    console.log("In the GET method")

    // Get the latest to-do list from the server
    $.ajax({
        url: "/to-do",
        method: "GET",
    })
    // Get the results from the server
    .then((res) => {
        console.log("Getting result /to-do")
        console.log(res)
        // Send the DB results to be re-rendered to the DOM
        rebuildToDoList(res, "#to-do-list")
    })
    // Or display the error that occurred
    .catch((err) => {
        console.log(`
            Error on script.js getOpenToDoList()

            ${err}
        `)
    })
}


// Function that updates the server with the current
// time for the selected object when the the `Complete`
// button event occurs.
function toggleToDoComplete() {

    console.log("toggle")

    // Get the current toggle button and get the containing
    // `<div>` ID value
    const objId = $(this).parents(".to-do-item").data('id')

    // Get the current time
    const taskData = {
        completed_on: new Date()
    }

    // Get the (now) updated status of the toggle button
    // for its boolean value
    let completedStatus = $(this).is(":checked")

    // If the status was turned back to `false`, then
    // set the `completed_on` status back to `null`.
    if (!completedStatus) {
        taskData.completed_on = null
    }

    // Get the latest to-do list from the server
    $.ajax({
        url: `/to-do/${objId}`,
        method: "PUT",
        data: taskData,
    })
    // Get the results from the server
    .then(() => {
        console.log(`PUT successful to /to-do/${objId}`)
        // Send the DB results to be re-rendered to the DOM
        getToDoList()
    })
    // Or display the error that occurred
    .catch((err) => {
        console.log(`
            Error on script.js markToDoCompleted()

            ${err}
        `)
    })
}


// Function that handles the deletion of a specific To Do
// element from the DB
function handleDeleteToDo() {

    console.log("here!")

    // Get the current delete button and get the containing
    // `<div>` ID value
    const objId = $(this).parents(".to-do-item").data('id')

    // Delete the specific To Do element
    $.ajax({
        url: `/to-do/${objId}`,
        method: "DELETE",
    })
    // Get the results from the server
    .then(() => {
        console.log(`DELETE successful to /to-do/${objId}`)
        // Send the DB results to be re-rendered to the DOM
        getToDoList()
    })
    // Or display the error that occurred
    .catch((err) => {
        console.log(`
            Error on script.js handleDeleteToDo()

            ${err}
        `)
    })
}