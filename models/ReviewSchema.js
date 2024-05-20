import mongoose from "mongoose";
import DoctorSchema from "./DoctorSchema.js";

const ReviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

ReviewSchema.statics.calcAverageRatings = async function (doctorId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId },
    },
    {
      $group: {
        _id: "$doctor",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  await DoctorSchema.findByIdAndUpdate(doctorId, {
    totalRating: stats.length > 0 ? stats[0].nRating : 0,
    averageRating: stats.length > 0 ? stats[0].avgRating : 0,
  });
};

ReviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor);
});

export default mongoose.model("Review", ReviewSchema);
