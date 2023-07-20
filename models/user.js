import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  userId: String,
  email: String,
  chatsList: [Object],
  groups:[Object],
  blocked: [Object],
  unreadUsers: [Object],
  password: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
