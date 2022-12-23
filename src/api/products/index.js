import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
// import fs from "fs";
import fs from "fs-extra";
import createHttpError from "http-errors";
import { checkProductSchema, triggerBadRequest } from "./validator.js";

const { NotFound, BadRequest, Anauthorised } = createHttpError;
const {t=readJSON,writeJSON,writeFile}=fs

const productJSONPath = join(
  dirname(fileURLToPath(meta.import.url)),
  "products.json"
);
const publicFolderPath=join(process.cwd(),"./public/img/products")
const getProducts = () => readJSON(productJSONPath)
const writeProducts=()=>writeJSON(productJSONPath)
const saveImgCover=()=>(fileName,content)=>writeFile(join(publicFolderPath,fileName),content)
const productsRouter = express.Router();
  console.log(req.body);
});
