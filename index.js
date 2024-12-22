import express from "express";

const server = express();
server.use(express.static("static"));
server.listen(3000, () => console.log("Listening on port 3000..."));
