import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

// import fs from "fs";
import fs from "fs-extra";
import createHttpError from "http-errors";
import { checkProductSchema, triggerBadRequest } from "./validator.js";

const { NotFound, BadRequest, Anauthorised } = createHttpError;
const { readJSON, writeJSON } = fs;

const reviewsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "reviews.json"
);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviews) => writeJSON(reviewsJSONPath, reviews);

const reviewsRouter = express.Router();

reviewsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const reviews = await getReviews();
      console.log(" THESE ARE THE REVIEWS", reviews);
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      };
      reviews.push(newReview);
      await writeReviews(reviews);
      res.status(201).send({ _id: newReview._id });
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.put(
  "/:reviewId",

  async (req, res, next) => {
    try {
      console.log(req.body);
      const reviews = await getReviews();

      // const outDatedReview= reviews.find(product => product._id === req.params.reviewId)
      const index = reviews.findIndex(
        (product) => product._id === req.params.reviewId
      );
      if (index !== -1) {
        const outDatedReview = reviews[index];
        const updateReview = {
          ...outDatedReview,
          ...req.body,

          updatedAt: new Date(),
        };
        reviews[index] = updateReview;
        await writeReviews(reviews);
        res.status(200).send(updateReview);
      } else {
        next(NotFound(`Review with id ${req.params.reviewId} not found`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.get(
  "/",

  async (req, res, next) => {
    try {
      const reviews = await getReviews();

      res.status(200).send(reviews);
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.get(
  "/:reviewId",

  async (req, res, next) => {
    try {
      const reviews = await getReviews();
      const foundReview = reviews.find(
        (product) => product._id === req.params.reviewId
      );
      foundReview
        ? res.send(foundReview)
        : next(NotFound(`Review with id ${req.params.reviewId} not found`));
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.delete(
  "/:reviewId",

  async (req, res, next) => {
    try {
      const reviews = await getReviews();
      const remainingReviews = reviews.filter(
        (product) => product._id !== req.params.reviewId
      );
      const foundReview = reviews.find(
        (product) => product._id === req.params.reviewId
      );
      reviews.length !== remainingReviews
        ? (await writeReviews(remainingReviews), res.status(204).send())
        : next(NotFound(`Review with id ${req.params.reviewId} not found`));
    } catch (error) {
      next(error);
    }
  }
);
export default reviewsRouter;
