import bodyParser from "body-parser";
import express from "express";
import { BASE_USER_PORT } from "../config";

// Variables to store messages states
let lastReceivedMessage = null;
let lastSentMessage = null;

export async function user(userId: number) {
  const _user = express();
  _user.use(express.json());
  _user.use(bodyParser.json());

  _user.get("/status", (req, res) => {
    res.send('live');
  });

  // Route for the last received message
  _user.get("/getLastReceivedMessage", (req, res) => {
    res.json({ result: lastReceivedMessage });
  });

  // Route for the last sent message
  _user.get("/getLastSentMessage", (req, res) => {
    res.json({ result: lastSentMessage });
  });

  // POST route to receive a message
  _user.post("/message", (req, res) => {
    const { message }: { message: string } = req.body; // Extract message from request body
    lastReceivedMessage = message; // Update last received message
    console.log(`User ${userId} received message: ${message}`);
    res.status(200).json({ message: "Message received successfully" });
  });

  const server = _user.listen(BASE_USER_PORT + userId, () => {
    console.log(`User ${userId} is listening on port ${BASE_USER_PORT + userId}`);
  });

  return server;
}
