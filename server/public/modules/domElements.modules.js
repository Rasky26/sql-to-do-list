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
            <div class="task">${obj.task_name}</div>

            <div class="due-date-container">
                <p class="due-date-date">
                    ${
                        obj.due_date ?
                        formatDate(obj.due_date) :
                        ""
                    }
                </p>
                <p class="due-date-time">
                    ${
                        obj.due_date ?
                        formatTime(obj.due_date) :
                        ""
                    }
                </p>
            </div>

            <button class="complete-button">Done?</button>
            <button class="delete-button">X</button>
        </div>
    `
}

export { rebuildToDoList }