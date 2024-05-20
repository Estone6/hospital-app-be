import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getMyAppointments,
} from "../controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// GET /users
router.get("/", authenticate, restrict(["admin"]), getAllUsers);

// GET /users/:id
router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);

// PUT /users/:id
router.put("/:id", authenticate, restrict(["patient"]), updateUser);

// DELETE /users/:id
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);

router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

export default router;
