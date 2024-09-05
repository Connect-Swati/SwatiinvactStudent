let express = require("express");
let cors = require("cors");
const app = express();
app.use(cors());

// Import the Track model and Sequelize instance from the previously defined paths
let track = require("./models/track.model");

let { sequelize } = require("./lib/index");

const port = 3000;
app.listen(port, () => {
  console.log("Server is running on port" + port);
});

let trackData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arijit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2018,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Ghoshal",
    album: "Padmaavat",
    duration: 3,
  },
  {
    name: "Bekhayali",
    genre: "Rock",
    release_year: 2019,
    artist: "Sachet Tandon",
    album: "Kabir Singh",
    duration: 6,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke (Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanishk Bagchi",
    album: "Drive",
    duration: 3,
  },
  {
    name: "Tera Ban Jaunga",
    genre: "Romantic",
    release_year: 2019,
    artist: "Tulsi Kumar",
    album: "Kabir Singh",
    duration: 3,
  },
  {
    name: "First Class",
    genre: "Dance",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 4,
  },
  {
    name: "Kalank Title Track",
    genre: "Romantic",
    release_year: 2019,
    artist: "Arijit Singh",
    album: "Kalank",
    duration: 5,
  },
];

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.3 - CW" });
});

// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist

    await sequelize.sync({ force: true });
    // Bulk create entries in the Track table using predefined data
    await track.bulkCreate(trackData);

    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    res.status(200).json({ message: "Database Seeding successful" });
  } catch (error) {
    // Send a 500 HTTP status code and an error message if there's an error during seeding

    console.log("Error in seeding db", error.message);
    return res.status(500).json({
      code: 500,
      message: "Error in seeding db",
      error: error.message,
    });
  }
});

/*
Exercise 1: Fetch all tracks

Create an endpoint /tracks that’ll return all the tracks in the database.

Create a function named fetchAllTracks to query the database using the sequelize instance

API Call

http://localhost:3000/tracks

Expected Output:

{
  tracks: [
    // All track entries in the database
  ],
}
*/
//function to fetch all tracks
async function fetchAllTracks() {
  try {
    let result = await track.findAll();
    if (!result || result.length == 0) {
      throw new Error("No tracks found");
    }
    return { tracks: result };
  } catch (error) {
    console.log("Error in fetching all tracks", error.message);
    return error;
  }
}

//endpoint to get all tracks
app.get("/tracks", async (req, res) => {
  try {
    let tracks = await fetchAllTracks();
    return res.status(200).json(tracks);
  } catch (error) {
    if (error.message == "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all tracks",
        error: error.message,
      });
    }
  }
});

/*
Exercise 2: Add a new track in the database

Create a POST endpoint /tracks/new that’ll return the newly inserted track details

Declare a variable named newTrack to store the request body data AKA req.body.newTrack

Create a function named addNewTrack that’ll insert the new track into the database and return the new track record from the database

API Call

http://localhost:3000/tracks/new

Request Body:

{
    'newTrack': {
        'name': 'Heer Aasmani',
        'artist': 'B Praak',
        'album': 'Fighter',
        'genre': 'Pop',
        'duration': 4,
        'release_year': 2024
    }
}

Expected Output:

{
    'newTrack': {
	'id': 11,
        'name': 'Heer Aasmani',
        'artist': 'B Praak',
        'album': 'Fighter',
        'genre': 'Pop',
        'duration': 4,
        'release_year': 2024
    }
}

*/
//function to add a new track
async function addNewTrack(newTrack) {
  try {
    let result = await track.create(newTrack);
    if (!result) {
      throw new Error("No tracks found");
    }
    return { newTrack: result };
  } catch (error) {
    console.log("Error in adding new track", error.message);
    return error;
  }
}
//endpoint to add a new track
app.post("/tracks/new", async (req, res) => {
  try {
    let newTrack = req.body.newTrack;
    let result = await addNewTrack(newTrack);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message == "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in adding new track",
        error: error.message,
      });
    }
  }
});
