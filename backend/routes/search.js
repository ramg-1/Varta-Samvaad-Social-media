import express, { application } from 'express';
import { getUser } from '../controllers/filter.js';

const router = express.Router();

router.get("/:name",getUser);

export default router;