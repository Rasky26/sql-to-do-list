const express = require("express");
const routes = express.Router();
const pool = require("../modules/pool");


// GET method for returning all To Do DB rows
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
        res.status(200).send(response.rows)
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

    // Set the SQL query
    const sqlQuery = `
        INSERT INTO "todolist"
            ("task_name", "due_date", "hidden_until", "note")
        VALUES
            ($1, $2, $3, $4)
    `

    // Establish the parameters to pass to the DB
    const sqlParams = [
        req.body.taskName,
        req.body.dueDate,
        req.body.hiddenUntil,
        req.body.notes
    ]

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

    // Get the `completed_on` date and set it to a UTC string
    let updateInfo = new Date(req.body.completed_on)
    updateInfo = updateInfo.toUTCString()

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