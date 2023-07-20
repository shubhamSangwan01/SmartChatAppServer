import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema({
  groupId:String,
  groupChats:[Object],
});

const GroupChat = mongoose.model("GroupChat", GroupChatSchema);

export default GroupChat;
