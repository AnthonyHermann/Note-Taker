const fs = require("fs");

// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

//  This is the synchronous way to do it, need it to be asynchronous so it isn't static
//var tableData = require("./db/db.json");
//var waitListData = require("../data/waitinglistData");
//console.log(tableData);

fs.readFile('./db/db.json', 'utf-8', (err, jsonString) => {
    if (err) {
        console.log(err);
        return;
    } 
        try {
            const data = JSON.parse(jsonString);
            console.log(data.address);
        } catch (err) {
            console.log('Error parsing JSON', err);
        }
        console.log(jsonString);
});

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

  jsonReader('./db/db.json', (err, db) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(db); 
  });


// write a new file (file will alread exist, needed as part of update function)

//let newNote = '';

//fs.writeFile('./db/db.json', JSON.stringify(newNote, null, 2), err => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('Successfully wrote file')
//    }
//})

// Update the file

//jsonReader('./db/db.json', (err, newNote) => {
//    if (err) {
//      console.log("Error reading file:", err);
//      return;
//    }
//    // increase customer order count by 1
//    db.id += 1;
//    fs.writeFile('./db/db.json', JSON.stringify(newNote, null, 2), err => {
//      if (err) console.log("Error writing file:", err);
//    });
//  });



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function(req, res) {
    res.json(tableData);
  });

  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function(req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    if (tableData.length < 5) {
      tableData.push(req.body);
      res.json(true);
    }
    else {
      waitListData.push(req.body);
      res.json(false);
    }
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.post("/api/clear", function(req, res) {
    // Empty out the arrays of data
    tableData.length = 0;
    waitListData.length = 0;

    res.json({ ok: true });
  });
};
