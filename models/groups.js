import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  groupName:String,
  groupDescription:String,
  groupId:String,
  groupMembers:[Object],
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
