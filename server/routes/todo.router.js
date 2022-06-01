const express = require("express");
const routes = express.Router();
const pool = require("../modules/pool");


// GET method for returning all completed To Do DB rows
routes.get("/completed-tasks", (req, res) => {

    // Set the SQL query
    const sqlQuery = `
        SELECT * FROM "todolist"
        WHERE "completed_on" IS NOT null
        ORDER BY "completed_on" DESC
    `

    // Submit the query to Postgres
    pool.query(sqlQuery)

    // Return and send the response rows
    .then((response) => {
        res.send(response.rows)
    })

    // Otherwise, log the error
    .catch((err) => {
        console.log(`
            Server Error on GET method:

            ${err}
        `)
        res.sendStatus(500)
    })
})


// GET method for returning all non-completed To Do DB rows
routes.get("/", (req, res) => {

    // Set the SQL query
    const sqlQuery = `
        SELECT * FROM "todolist"
        WHERE "completed_on" IS null
        ORDER BY "due_date" ASC
    `

    // Submit the query to Postgres
    pool.query(sqlQuery)

    // Return and send the response rows
    .then((response) => {
        res.send(response.rows)
    })

    // Otherwise, log the error
    .catch((err) => {
        console.log(`
            Server Error on GET method:

            ${err}
        `)
        res.sendStatus(500)
    })
})


// POST method for adding a new item to the
// To Do list
routes.post("/", (req, res) => {

    // Simple look-up field from JS to DB naming conventions
    const nameLookUp = {
        "dueDate": "due_date",
        "hiddenUntil": "hidden_until",
    }

    // Pull out the req.body to its own variable name
    const newToDo = req.body

    // Set the base SQL values that will be added onto
    let varName = `("task_name", "note"`
    let valuesList = `($1, $2`
    // Use this counter to dynamically add values to SQL query
    let startCount = 3
    // Establish the parameters to pass to the DB
    let sqlParams = [
        req.body.taskName,
        req.body.notes
    ]

    // Loop over the incoming data. This loop will add in additional
    // fields of data if they exist, otherwise it will leave them out
    // of the SQL query (and params) if they are blank or missing.
    for (const key in newToDo) {
        if (Object.hasOwnProperty.call(newToDo, key)) {
            const toDo = newToDo[key];
            // Skip over these fields that are required
            if (['taskName', 'notes'].includes(key)) {
                continue
            }
            // Otherwise, check if a datetime value exists
            // and add that field to the SQL for processing.
            if (toDo) {
                varName += `, "${nameLookUp[key]}"`
                valuesList += `, $${startCount}`
                startCount++
                sqlParams.push(toDo)
            }
        }
    }

    // Close out the different SQL query strings
    varName += `)`
    valuesList += `)`

    // Set the SQL query
    const sqlQuery = `
        INSERT INTO "todolist"
            ${varName}
        VALUES
            ${valuesList}
    `

    // Submit the query to Postgres
    pool.query(sqlQuery, sqlParams)

    // Return and send the response rows
    .then(() => {
        console.log("Successful To Do POST made")
        res.sendStatus(201)
    })

    // Otherwise, log the error
    .catch((err) => {
        console.log(`
            Server Error on POST method:

            ${err}
        `)
        res.sendStatus(500)
    })
})


// PUT method for completing the current task
routes.put("/:id", (req, res) => {

    // Explicity get the ID from the URL param
    const toDoId = parseInt(req.params.id)

     // Check if bad data (a non-number) was sent
     if (isNaN(Number(toDoId))) {
        // If so, return a response indicating that much
        res.status(400).send({error: `Invalid song id of ${koalaId}`})
    }

    // Set a default value to `null`
    let updateInfo = null

    // Check if it should be assigning it to a date value
    if (req.body.completed_on) {
        // Get the `completed_on` date and set it to a UTC string
        updateInfo = new Date(req.body.completed_on)
        updateInfo = updateInfo.toUTCString()
    }

    // Set the SQL query
    const sqlQuery = `
        UPDATE "todolist"
        SET "completed_on" = $2
        WHERE id = $1
    `

    // Set the SQL params
    const sqlParams = [
        toDoId,
        updateInfo,
    ]

    // Submit the query to Postgres
    pool.query(sqlQuery, sqlParams)

    // Return and send the response rows
    .then(() => {
        console.log("Successful To Do PUT made")
        res.sendStatus(201)
    })

    // Otherwise, log the error
    .catch((err) => {
        console.log(`
            Server Error on PUT method:

            ${err}
        `)
        res.sendStatus(500)
    })
})


// Export all routes to make them accessible to the client
module.exports = routes