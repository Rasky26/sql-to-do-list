const express = require("express");
const routes = express.Router();
const pool = require("../modules/pool");


// GET method for returning all To Do DB rows
routes.get("/", (req, res) => {

    console.log("In the GET method")

    // Set the SQL query
    const sqlQuery = `
        SELECT * FROM "to-dos"
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

    // Pull out the req.body to its own variable name
    const newToDo = req.body

    // Establish the parameters to pass to the DB
    let sqlParams = [
        newToDo.taskName,
    ]

    // Set the SQL query
    const sqlQuery = `
        INSERT INTO "to-dos"
            ("task-name")
        VALUES
            ($1)
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
        res.status(400).send({error: `Invalid id of ${toDoId}`})
    }

    // Initialize the updateInfo value to `null`
    let updateInfo = null

    // If a time exists, then set `updateInfo` to the datetime
    if (req.body.completed_on) {
        updateInfo = new Date(req.body.completed_on)
    }

    // Set the SQL query
    const sqlQuery = `
        UPDATE "to-dos"
        SET "completed-on" = $2
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


// DELETE method for removing the current task
routes.delete("/:id", (req, res) => {

    // Explicity get the ID from the URL param
    const toDoId = parseInt(req.params.id)

     // Check if bad data (a non-number) was sent
     if (isNaN(Number(toDoId))) {
        // If so, return a response indicating that much
        res.status(400).send({error: `Invalid id of ${toDoId}`})
    }

    // Set the SQL query
    const sqlQuery = `
        DELETE FROM "to-dos"
        WHERE id = $1
    `

    // Set the SQL params
    const sqlParams = [
        toDoId,
    ]

    // Submit the query to Postgres
    pool.query(sqlQuery, sqlParams)

    // Return and send the response rows
    .then(() => {
        console.log("Successful To Do DELETE made")
        res.sendStatus(204)
    })

    // Otherwise, log the error
    .catch((err) => {
        console.log(`
            Server Error on DELETE method:

            ${err}
        `)
        res.sendStatus(500)
    })
})


// Export all routes to make them accessible to the client
module.exports = routes