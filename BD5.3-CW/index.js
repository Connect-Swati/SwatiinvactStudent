let express = require("express");
/*
   - This line imports the Express framework, which is used to create and handle web servers and APIs in Node.js.
   - Express simplifies server creation by providing various built-in middleware and methods for routing, making it easier to handle HTTP requests and responses.
*/

let cors = require("cors");
/*
   - This imports the `cors` package, which stands for Cross-Origin Resource Sharing.
   - `cors` allows you to control which domains can access your API. By default, browsers block requests made to a different domain unless CORS is enabled.
   - In this case, you are using it to allow access to your API from any domain, which is especially useful if you're hosting your backend separately from the frontend.
*/

const app = express();
/*
   - Here, the `app` constant is initialized as an instance of Express.
   - This creates your server object, which will be used to define routes (endpoints), middleware, and listen for incoming requests.
*/

app.use(cors());
/*
   - The `app.use(cors())` middleware function allows CORS for all routes and requests.
   - This is particularly important when your API is accessed from other domains or different ports (like making an API request from a frontend running on a different port).
   - By enabling it globally, you're allowing any origin to make requests to your server, which is useful during development or for open APIs.
*/

app.use(express.json());
/*
   - This middleware is used to automatically parse incoming requests with a JSON payload.
   - Without this line, your application would not be able to handle requests containing JSON data in the request body.
   - It allows you to easily access the data sent in the request body via `req.body` in your route handlers.
   - This is especially necessary for POST and PUT requests, where data is typically sent in JSON format.
*/

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

// function to add a new track
async function addNewTrack(newTrack) {
  try {
    // Create a new track in the database using Sequelize's create method.
    // The 'newTrack' object contains all the details (name, artist, album, etc.) passed in the request body.
    let result = await track.create(newTrack);

    // If the result is falsy (i.e., null or undefined), throw an error.
    // Normally, if the creation was successful, result will contain the new track data.
    if (!result) {
      throw new Error("No tracks found"); // Custom error message to indicate that the creation failed.
    }

    // Return the newly created track in the response.
    return { newTrack: result };
  } catch (error) {
    // Log the error message if an error occurs during the creation process.
    console.log("Error in adding new track", error.message);

    // Return the error object so that it can be handled later in the request flow.
    return error;
  }
}

// Endpoint to add a new track
app.post("/tracks/new", async (req, res) => {
  try {
    /*
    Request Body:
    This is the expected structure for the request body. The client sends this data as a POST request.
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
    */
    console.log("Request body:", req.body); // Log the request body to ensure it is being received correctly.

    // Extract the 'newTrack' property from the request body. This contains the details of the new track to be added.
    let newTrack = req.body.newTrack;

    // Call the 'addNewTrack' function to add the track to the database and wait for the result.
    let result = await addNewTrack(newTrack);

    // Send a successful response with a 200 HTTP status code and the newly created track data.
    return res.status(200).json(result);
  } catch (error) {
    // Handle the case where no tracks were found or created (custom error message defined in the addNewTrack function).
    if (error.message === "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found", // Response message indicating that the track creation failed.
        error: error.message, // Send the error message back to the client for further information.
      });
    } else {
      // Handle general errors, such as database connection issues or validation errors.
      return res.status(500).json({
        code: 500,
        message: "Error in adding new track", // Response message indicating an internal server error occurred.
        error: error.message, // Provide the error message to help with debugging.
      });
    }
  }
});

/*
Exercise 3: Update track information

Create a POST endpoint /tracks/update/:id that’ll return the updated track details.

Declare a variable named id to store the path parameter passed by the user

Declare a variable named newTrackData to store the request body data

Create a function named updateTrackById that’ll insert the new track into the database and return the new track record from the database

API Call

http://localhost:3000/tracks/update/11

Request Body:

{
  'name': 'Heer',
}

Expected Output:

{
    'message': 'Track updated successfully',
    'updatedTrack': {
        'id': 11,
        'name': 'Heer',
	'artist': 'B Praak',
	'album': 'Fighter',
	'genre': 'Pop',
	'duration': 4,
	'release_year': 2024
    }
}

*/

// function to update track
async function updateTrackById(id, newTrackData) {
  try {
    // Perform the update operation on the track table based on the id
    let result = await track.update(newTrackData, { where: { id: id } });

    // Sequelize's update() returns an array where:
    // result[0] is the number of rows that were updated.
    if (result[0] === 0) {
      // If no rows were updated (result[0] is 0), it means no track was found with the given id
      throw new Error("No tracks found");
    }

    // To return the updated track details, we query the updated track using the id
    let updatedTrack = await track.findByPk(id); // This retrieves the updated track by its id

    // Return the updated track details along with a success message
    return {
      message: "Track updated successfully",
      updatedTrack: updatedTrack, // Send the updated track details
    };
  } catch (error) {
    console.log("error in updating track", error.message);
    throw error;
  }
}

// Endpoint to update track
app.post("/tracks/update/:id", async (req, res) => {
  try {
    // Extract the id from the request parameters and convert it to an integer
    let id = parseInt(req.params.id);

    // Extract the updated track data from the request body
    let newTrackData = req.body;

    // Call the updateTrackById function and pass the id and new track data
    let result = await updateTrackById(id, newTrackData);

    // Send a 200 status code with the updated track details as JSON
    return res.status(200).json(result);
  } catch (error) {
    // If no tracks were found, send a 404 response
    if (error.message === "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      // For other errors, send a 500 internal server error response
      return res.status(500).json({
        code: 500,
        message: "Error in updating track",
        error: error.message,
      });
    }
  }
});
// function to delete track from db
async function deleteTrackById(id) {
  try {
    // Attempt to destroy the track based on the given id
    let result = await track.destroy({ where: { id: id } });

    // If result equals 0, that means no track was found with the given id
    if (result === 0) {
      throw new Error("No tracks found"); // Custom error message for no records found
    }

    // Return a success message if the track was deleted
    return { message: "Track record deleted successfully" };
  } catch (error) {
    // Log the error and rethrow it for further handling in the calling function
    console.log("Error in deleting track", error.message);
    throw error;
  }
}

// Endpoint to delete track
app.post("/tracks/delete", async (req, res) => {
  try {
    // Log the request body for debugging purposes
    console.log("Request body:", req.body);

    // Parse the id from the request body
    let id = parseInt(req.body.id);

    // Call the function to delete the track by id and wait for the result
    let result = await deleteTrackById(id);

    // Return a 200 status code with the result if successful
    return res.status(200).json(result);
  } catch (error) {
    // Handle the case where no tracks were found for the given id
    if (error.message === "No tracks found") {
      return res.status(404).json({
        code: 404,
        message: "No tracks found",
        error: error.message,
      });
    } else {
      // Handle other server-side errors
      return res.status(500).json({
        code: 500,
        message: "Error in deleting track",
        error: error.message,
      });
    }
  }
});
