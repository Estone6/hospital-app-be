import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    req.userId = decoded._id;
    req.role = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;
  let user;

  const patient = await User.findById(userId);
  const doctor = await Doctor.findById(userId);

  console.log("userId", userId);
  console.log("patient", patient);
  console.log("doctor", doctor);
  console.log("roles", roles);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    console.log("Forbidden access coming from restrict middleware");
    return res.status(403).json({
      success: false,
      message: "Forbidden access",
    });
  }

  next();
};
