import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import { join } from "path";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./lib/errorHandler.js";
import filesRouter from "./api/files/index.js";

const publicFolderPath = join(process.cwd());

const port = 3001;
const server = express();

server.use(express.json());
server.use(express.static(publicFolderPath));
server.use("/products", productsRouter);
server.use("/products", filesRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
