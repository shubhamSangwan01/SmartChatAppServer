import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: String,
  notifications: [Object],
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
