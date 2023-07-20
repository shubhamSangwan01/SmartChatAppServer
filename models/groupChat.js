import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  groupId:String,
  groupChats:[Object],
});

const Group = mongoose.model("User", GroupSchema);

export default Group;
