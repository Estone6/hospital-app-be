import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import doctorRoute from "./routes/doctor.js";
import reviewRoute from "./routes/review.js";
import bookingRoute from "./routes/booking.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = { origin: true };

app.use(
  cors({
    origin: "https://hospital-app-template.vercel.app/", // your frontend Vercel URL
  })
);

app.get("/", (req, res) => {
  res.send("Api is running...");
});

mongoose.set("strictQuery", false);
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

app.listen(PORT, () => {
  connectionDB();
  console.log(`Server is running on port ${PORT}`);
});
