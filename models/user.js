import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  userId:String,
  email: String,
  chatsList:[Object],
  blocked:[Object],
  unreadChats:Number,
  password: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;