// Import needed modules
import { rebuildToDoList } from "../modules/domElements.modules.js"
import { setTimeFromInput } from "../modules/time.modules.js"

// Set global variables
// --------------------------------
// Boolean that toggles if upcoming, but hidden, items are
// shown to the DOM or not.
let showHiddenItems = false


// Await the HTML document and associated elements to load
$(onDocumentLoad)


// Function that runs when the HTML is fully loaded.
function onDocumentLoad() {

    // Pull in the To Do list on page load
    getToDoList()

    // Click handler for submitting a new to-do item
    $("#form--to-do-entry").submit("#submit-new-item", handleToDoSubmission)
}


// Function that handles a new To Do submission upon clicking `Submit`
function handleToDoSubmission(event) {

    // Prevent the reload of the page upon submission
    event.preventDefault()

    // Assemble an object based on the To Do input fields
    let newToDo = {
        taskName: $("#to-do-name").val(),
        dueDate: setTimeFromInput(
            $("#due-date-date-selector").val(),
            $("#due-date-time-selector").val()
        ),
        hiddenUntil: setTimeFromInput(
            $("#delay-display-item-until-date").val(),
            $("#delay-display-item-until-time").val()
        ),
        notes: $("#to-do-notes").val(),
    }

    // Post the information to the server
    postNewToDo(newToDo)
}


// Function that POSTs a new To Do to the DB.
function postNewToDo(toDoObj) {

    // Get the values from the form's input
    console.log(">>>>>", toDoObj)

    // Send a new To Do item to the server
    $.ajax({
        url: "/to-do",
        method: "POST",
        data: toDoObj,
    })
    // Get a successful response
    .then((res) => {
        console.log("Successful POST made.")
        // Load in the updated list to the DOM
        getToDoList()
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

    // Get the latest to-do list from the server
    $.ajax({
        url: "/to-do",
        method: "GET",
    })
    // Get the results from the server
    .then((res) => {
        console.log("Getting result /to-do")
        // Send the DB results to be re-rendered to the DOM
        rebuildToDoList(res)
    })
    // Or display the error that occurred
    .catch((err) => {
        console.log(`
            Error on script.js getToDoList()

            ${err}
        `)
    })
}