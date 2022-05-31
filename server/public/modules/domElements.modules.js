// Import needed modules
import { dateValues, formatDate, formatTime } from "../modules/time.modules.js"

// Function that handles clearing the To Do list from
// the DOM and rebuilding it based on the array that
// was passed to it.
function rebuildToDoList(objects) {

    // Run the current `objects` array through a filter
    // and reset that array back to `objects`
    objects = updateListAgainstFilters(objects)

    // Empty the DOM of the current list
    $("#to-do-list").empty()

    // Loop over the array and display the items to
    // the DOM
    for (const obj of objects) {

        // Use jQuery to append each To Do list to
        // the DOM
        $("#to-do-list").append(
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
    console.log(outputObjects)
    return outputObjects
}


// Function that handles creating the individual DOM To Do item
function toDoComponent(obj) {
    // Return the HTML with values related to the specific object
    return `
        <div class="to-do-item" data-id=${obj.id}>
            <div class="complete-button-container">
                <button class="complete-button">Done?</button>
            </div>
            <div class="due-date-container">
                ${dueDateDisplay(obj.due_date)}
            </div>
            <div class="task-container">
                <p class="task">${obj.task_name}</p>
            </div>
            <div class="note-container">
            </div>
            <div class="delete-button-container">
                <button class="delete-button">X</button>
            </div>
        </div>
    `
}


// Function that purely handles the `due_date` and whether
// something needs to be displayed or not.
function dueDateDisplay(date) {

    // Check that a `due_date` was listed
    if (date) {

        // Get the date string, formatted
        const dateString = formatDate(date)

        // Set the time for the due date.
        let timeString = formatTime(date)
        // Otherwise, if it is all day then set it to a blank value
        if (timeString === "11:59 PM") {
            timeString = ""
        }

        if (timeString) {
            // Return the HTML to add into the current To Do element
            // with both date and time
            return `
                <p class="due-date">
                    <span class="due-date-date">${dateString}</span>
                    <br />
                    <span class="due-date-time">by ${timeString}</span>
                </p>
            `
        }

        // Otherwise, return only the date
        return `
            <p class="due-date-date">${dateString}</p>
        `
    }

    // If `due_date` was null, just return a blank value
    return ""
}

export { rebuildToDoList }