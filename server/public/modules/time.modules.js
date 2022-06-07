// // Set a list of values that should be treated as `Date()`
// const dateValues = [
//     "set_on",
//     "due_date",
//     "hidden_until",
//     "completed_on",
// ]

// // Function that displays the date and time to a consistent formatted string
// //  Returns: May 12, 2022
// function formatDate(obj) {

//     // Set the display format for datetime objects
//     const formattedDate = {
//         month: "short",
//         day: "numeric",
//         year: "numeric"
//     }

//     return obj.toLocaleString('en-US', formattedDate)
// }


// // Function that displays the date and time to a consistent formatted string
// //  Returns: 10:45 PM
// function formatTime(obj) {
    
//     // Set the display format for datetime objects
//     const formattedTime = {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true 
//     }

//     return obj.toLocaleString('en-US', formattedTime)
// }


// // Function that inspects the dates and sets them to formal
// // datetime values that are set to UTC standard times.
// function setTimeFromInput(date, time) {

//     // If the date field was left blank, make sure to set both the date
//     // and time fields to `null`
//     if (date === undefined || date === "") {
//         // Set the server dueDate variable to `null`
//         return null
//     }

//     // If a date exists, check if a time does not.
//     // Set the time to the very end of the day for a completion time.
//     if (time === undefined || time === "") {
//         // Split apart the date string to get the individual year, month,
//         // and day elements
//         const dateArray = date.split("-")
//         // Set the due date to a date object based around the input date
//         // and set the time to the very end of the day.
//         let returnDate = new Date(
//             dateArray[0],
//             dateArray[1],
//             dateArray[2],
//             23, 59, 59, 999)
//         // Finally, get the date and time to a UTC timestamp
//         return returnDate.toUTCString()
//     }

//     // Otherwise, create a datetime string converted to UTC
//     let returnDate = new Date(date + "T" + time)
//     // Return the string converted to a UTC time
//     return returnDate.toUTCString()
// }


// export { dateValues, formatDate, formatTime, setTimeFromInput }