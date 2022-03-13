import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

const pusher = new Pusher({
  appId: "1361094",
  key: "9ecc8cd4fd90c3a35c0b",
  secret: "d3f5298fa1ce085a0676",
  cluster: "us2",
  useTLS: true,
});

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world",
// });

const app = express();

const mongourl =
  "mongodb+srv://minhua:cUKHY.8.BrQ43Bf@cluster0.5jzo0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongourl, {});

const db = mongoose.connection;
db.once("open", () => {
  console.log("connected to mongodb");

  const msgCollections = db.collection("messagecontents");
  const changeStream = msgCollections.watch();

  changeStream.on("change", (change) => {
    console.log(change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/messages/sync", (req, res) => {
  Messages.find({}, (err, messages) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(messages);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.listen(3030);
