import express from "express";
import {
  getAllDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile,
} from "../controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRoute from "./review.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRoute);

// GET /users
router.get("/", getAllDoctors);

// GET /users/:id
router.get("/:id", getSingleDoctor);

// PUT /users/:id
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);

// DELETE /users/:id
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;
