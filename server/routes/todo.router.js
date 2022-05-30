const express = require("express");
const routes = express.Router();
const pool = require("../modules/pool");


// GET method for returning all To Do DB rows
routes.get("/", (req, res) => {

    // Set the SQL query
    const sqlQuery = `
        SELECT * FROM "todolist"
        WHERE "completed_on" IS null
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
            Server Error on GET method:

            ${err}
        `)
        res.sendStatus(500)
    })
})

// Export all routes to make them accessible to the client
module.exports = routes