import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  users:[String],
  from:String,
  to:String,
  timestamp:String,
  messageBody:String,
  Date:Date,
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;