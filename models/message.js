import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  users:[String],
  from:String,
  to:String,
  timestamp:String,
  messageBody:String,
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;