import express from "express";

import {
  AddLeadsRecord,
  GetLeadsRecord,
  RemoveLeadsRecord,
} from "../controllers/leads";

import { authenticateAuthToken } from "../middlewares/auth";

import catchResponse from "../utils/catch-response";

const router = express.Router();

router.post("/add-record", authenticateAuthToken, async (req, res) => {
  try {
    const {
      user: { _id: userId },
      body: data,
    } = req;

    const response = await AddLeadsRecord({
      userId,
      data,
    });

    return res.status(200).json(response);
  } catch (err) {
    await catchResponse({
      res,
      err,
    });
  }
});

router.get("/leads-record", authenticateAuthToken, async (req, res) => {
  try {
    const {
      query: { filter, sort, skip, limit },
      user: { _id: userId },
    } = req;

    const response = await GetLeadsRecord({
      filter: JSON.parse(filter),
      sort: JSON.parse(sort),
      skip: JSON.parse(skip),
      limit: JSON.parse(limit),
      userId,
    });

    return res.status(200).json(response);
  } catch (err) {
    await catchResponse({
      res,
      err,
    });
  }
});

router.delete("/leads-record", authenticateAuthToken, async (req, res) => {
  try {
    const {
      query: { leadIds },
      user: { _id: userId },
    } = req;
    const response = await RemoveLeadsRecord({
      leadIds: JSON.parse(leadIds),
      userId,
    });

    return res.status(200).json(response);
  } catch (err) {
    await catchResponse({
      res,
      err,
    });
  }
});

export default router;
