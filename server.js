const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// GET Route for index.hthml homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET Route for notes html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for db.json
app.get('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/db.json'))
);
// Post Route for db.json
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a new note`);

    // If all the required properties are present
    if (req.body) {
        // Variable for the object we will save
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            note_id: uuid(),
        };

        // Convert the data to a string so we can save it
        const noteString = JSON.stringify(newNote);

        // Write the string to a file
        fs.writeFile(`/db.json`, noteString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `${newNote} has been written to JSON file`
                )
        );

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting new note');
    }
});

app.delete('/api/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/db.json'))
);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
