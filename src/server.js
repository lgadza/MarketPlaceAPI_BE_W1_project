import express from "express";
import listEndpoints from "express-list-endpoints";

const port = 3001;

const server = express(express.json);
server.use(port, () => {
  console.table(listEndpoints);
});
