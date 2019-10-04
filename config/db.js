const sqlite3 = require('sqlite3').verbose();

const env = process.env.NODE_ENV || 'development';

// open the database
let db = new sqlite3.Database(`./db/${ env }.sqlite`, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(`Error connecting to ${ env } DB:`, err.message);
  } else {
    console.log(`Connected to the icebreaker-simple ${ env } database.`);
  }
});

module.exports = db;
