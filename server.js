const express = require("express");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config(); 
const app = express();

app.use(express.json());
const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let bookingsCollection;


async function startServer() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB!");

    const db = client.db("synergia"); 
    bookingsCollection = db.collection("bookings"); 

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

startServer();

app.get("/", (req, res) => {
  res.send("Synergia Booking API is running successfully!");
});

app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await bookingsCollection.find().toArray();
    res.status(200).json(bookings);
  } catch {
    res.status(500).send("Error fetching bookings");
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

   
    if (!name || !email || !event) {
      return res.status(400).send("Missing required fields: name, email, or event");
    }

    const newBooking = {
      name,
      email,
      event,
      ticketType,
      createdAt: new Date(),
    };

    const result = await bookingsCollection.insertOne(newBooking);
    res.status(201).json({
      message: "Booking created successfully!",
      insertedId: result.insertedId,
    });
  } catch {
    res.status(500).send("Error creating booking");
  }
});

app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).send("Email query is required");

    const bookings = await bookingsCollection
      .find({ email: { $regex: new RegExp(email, "i") } })
      .toArray();

    if (bookings.length === 0)
      return res.status(404).send("No bookings found for that email");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).send("Error searching by email");
  }
});

app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).send("Event query is required");

    const bookings = await bookingsCollection
      .find({ event: { $regex: new RegExp(event, "i") } })
      .toArray();

    if (bookings.length === 0)
      return res.status(404).send("No bookings found for that event");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).send("Error filtering by event");
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    if (!booking) return res.status(404).send("Booking not found");
    res.status(200).json(booking);
  } catch {
    res.status(400).send("Invalid ID format");
  }
});

app.put("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, event, ticketType } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (event) updateFields.event = event;
    if (ticketType) updateFields.ticketType = ticketType;

    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) return res.status(404).send("Booking not found");
    res.status(200).send("Booking updated successfully!");
  } catch {
    res.status(400).send("Invalid ID format");
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return res.status(404).send("Booking not found");
    res.status(200).send("Booking deleted successfully!");
  } catch {
    res.status(400).send("Invalid ID format");
  }
});
