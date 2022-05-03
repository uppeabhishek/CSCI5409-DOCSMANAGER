import express from "express";
import testGet from "../controllers/test.js";
import {shortner} from "../controllers/shortner.js";
import {shortenLookUp} from "../controllers/shortenLookUp.js";

const router = express.Router();

router.post("/shorten", shortner);
router.get("/:shortendId", shortenLookUp);

export default router;
