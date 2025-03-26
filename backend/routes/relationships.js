import express from "express";
import { getRelationships , addRelationship , deleteRelationship } from "../controllers/relationship.js";

const router = express.Router();

// relationships.js
router.get("/", (req, res, next) => {
    console.log("Received GET request for relationships with followeduserid:", req.query.followeduserid);
    next();
  }, getRelationships);
  router.post("/",addRelationship);
router.delete("/",deleteRelationship);

export default router;