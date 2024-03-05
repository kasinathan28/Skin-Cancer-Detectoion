const express = require("express");
const cors = require("cors"); // Import the cors package
const { MongoClient } = require("mongodb");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Use the cors middleware
app.use(cors());

// MongoDB Connection URL
const mongoURL = "mongodb+srv://skin:skin@cluster0.tslsoro.mongodb.net";

// Connect to MongoDB
MongoClient.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to MongoDB");

    // Select database
    const db = client.db("Skin_Cancer");

    // Define API endpoint to receive prediction data
    app.post("/savePrediction", (req, res) => {
      const predictionData = req.body;
      console.log("Req body", req.body);

      // Save prediction data to MongoDB
      db.collection("predictions")
        .insertOne(predictionData)
        .then((result) => {
          console.log("Prediction saved to MongoDB");
          res.json({ success: true });
        })
        .catch((error) => {
          console.error("Error saving prediction to MongoDB:", error);
          res.status(500).json({ error: "An error occurred" });
        });
    });

    // Define a route to get all predictions
    app.get("/predictions", async (req, res) => {
      console.log("getting predictions");
      try {
        // Retrieve all predictions from MongoDB
        const predictions = await db.collection("predictions").find().toArray();

        // Send the predictions as a response
        res.json(predictions);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching predictions" });
      }
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Endpoint to verify server status
app.get("/", (req, res) => {
  res.send("Server started");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
