// Import needed modules
import { dateValues, formatDate, formatTime } from "../modules/time.modules.js"

// Function that handles clearing the To Do list from
// the DOM and rebuilding it based on the array that
// was passed to it.
//
// `target` is the HTML list element to rebuild, allows for
// re-usability.
function rebuildToDoList(objects, target) {

    // Run the current `objects` array through a filter
    // and reset that array back to `objects`
    objects = updateListAgainstFilters(objects)

    // Empty the DOM of the current list
    $(target).empty()

    // Loop over the array and display the items to
    // the DOM
    for (const obj of objects) {

        // Use jQuery to append each To Do list to
        // the DOM
        $(target).append(
            toDoComponent(obj)
        )
    }
}


// Function that updates the To Do object list against applied
// filters
function updateListAgainstFilters(objects) {

    // Set an output array
    const outputObjects = []
    // Get the current `datetime`
    const currentDateTime = new Date()

    // Loop through the object and push valid results to
    // the `outputObject` array
    for (const obj of objects) {

        // --------------------------------
        // Set date strings to date objects. This will assist with using
        // `toLocaleString()` to display those values.
        for (const key in obj) {
            // Check if the current key should be a `Date()` value and
            // it exists in the current `obj`
            if (
                (obj[key] !== null) &&
                dateValues.includes(key) &&
                Object.hasOwnProperty.call(obj, key)
            ) {
                // Convert the date string to a date object
                obj[key] = new Date(obj[key])
            }
        }

        // --------------------------------
        // Check if the object should remain hidden as the
        // `hidden_until` date is AFTER the current datetime.
        if (
            // `null` values should be shown to the DOM, non-null
            // values need to be checked further.
            obj.hidden_until !== null &&
            // Check if the `hidden_until` date is value AFTER
            // the current datetime
            obj.hidden_until > currentDateTime
        ) {
            // If the value is to remain hidden, skip pushing
            // this object to the `outputObjects` and continue
            // with the next object.
            continue
        }

        // If all filters have been passed, add the current `obj`
        // to the `outputObject` array.
        outputObjects.push(obj)
    }

    return outputObjects
}


// Function that handles creating the individual DOM To Do item
function toDoComponent(obj) {

    // Return the HTML with values related to the specific object
    return `
        <div class="to-do-item" data-id=${obj.id}>
            
            ${setCompletedButtonDisplay(obj.completed_on)}
            
            ${dateDisplay(obj)}

            ${taskDisplay(obj)}
            
            ${noteDisplay(obj.note)}
            
            ${deleteButton()}

        </div>
    `
}


// Function that handles the button display for To Do items
function setCompletedButtonDisplay(completed_on) {

    return `
        <div class="complete-button-container form-check form-switch">
            <input 
                class="complete-button form-check-input" 
                type="checkbox"
                ${completed_on ? 'checked' : ''}
            />
        </div>
    `
}


// Function that purely handles the `due_date` and whether
// something needs to be displayed or not.
function dateDisplay(obj) {

    // Initialize the `date` as the `completed_on` date
    let date = obj.completed_on
    // If the task is not completed, instead set the date
    // as the `due_date`
    if (!date) {
        date = obj.due_date
    }

    // Check that a `due_date` was listed
    if (date) {

        // Get the date string, formatted
        const dateString = formatDate(date)

        // Set the time for the due date.
        let timeString = formatTime(date)
        // Otherwise, if it is all day then set it to a blank value
        if (timeString === "11:59 PM") {
            timeString = null
        }

        if (timeString) {
            // Return the HTML to add into the current To Do element
            // with both date and time
            return `
                <div class="date-container">
                    <p class="display-date">
                        <span class="display-date-date">${dateString}</span>
                        <br />
                        <span class="display-date-time">${timeString}</span>
                    </p>
                </div>
            `
        }

        // Otherwise, return only the date
        return `
            <p class="display-date-date">${dateString}</p>
        `
    }

    // If `date` was null, just return a blank value
    return ""
}


// Function that handles the display of the task
function taskDisplay(obj) {

    return `
        <div class="task-container">
            <p class="task">${obj.task_name}</p>
        </div>
    `
}


// Function that handles the note display
function noteDisplay(note) {

    return `
        <div class="note-container">
        
        </div>
    `
}


// Function for handling the deletion button
function deleteButton() {

    return `
        <div class="delete-button-container">
            <button class="delete-button btn btn-danger">X</button>
        </div>
    `
}


export { rebuildToDoList }