import User from "../models/user.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import Message from "../models/message.js";
import Group from "../models/groups.js";
import GroupChat from "../models/groupChat.js";
import Notification from "../models/notification.js";

export const handleSignup = async (req, res) => {
  const { name, email, password } = req.body;

  // console.log(req.body)
  const userId = uuidv4();

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  const emailCount = await User.find({ email }).count();
  const nameCount = await User.find({name}).count();

  if (emailCount !== 0) {
    res.status(200).json({ message: "Email already registered!", status: 400 });
  }
  else if(nameCount!==0){
    res.status(200).json({message:"Username already registered!",status:400})
  } 
  else {
    const user = await User.create({
      name,
      userId,
      email,
      password: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "User Registered Successfully!", status: 200 });
  }
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.send({ message: "User not registered !", status: 400 });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          username: user.name,
          email: user.email,
          id: user.userId,
        },
        "ashish123"
      );

      res.send({
        message: "Login Successful",
        token: token,
        status: 200,
        user: user,
      });
    } else {
      res.send({ status: 400, message: "Incorrect Password" });
    }
  }
};

export const handleGetUserInfo = async (req, res) => {};

export const handleSearchUser = async (req, res) => {
  const { searchFriends } = req.body;
  try {
    const users = await User.find({
      email: { $regex: searchFriends, $options: "i" },
    });
    if (users.length == 0) {
      res.status(202).json({ message: "User not found." });
    } else {
      res.status(200).json({ users });
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleSendMessage = async (req, res) => {
  const { from, to, message } = req.body;
  //console.log(req.body);
  // save the message in database
  try {
    const fromUser = await User.findOne({ userId: from?.userId });
    const toUser = await User.findOne({ userId: to?.userId });

    const fromChatList = fromUser.chatsList;
    const toChatList = toUser.chatsList;
    // console.log(toChatList, fromChatList);

    if (!fromChatList.some((chat) => chat.userId === toUser.userId)) {
      fromChatList.push({ name: toUser.name, userId: toUser.userId });
    }
    if (!toChatList.some((chat) => chat.userId === fromUser.userId)) {
      toChatList.push({ name: fromUser.name, userId: fromUser.userId });
    }

    await User.updateOne(
      { userId: fromUser.userId },
      { chatsList: fromChatList }
    );
    await User.updateOne({ userId: toUser.userId }, { chatsList: toChatList });

    await Message.create({
      users: [from.userId, to.userId],
      from: from.userId,
      to: to.userId,
      messageBody: message,
      Date: new Date(),
      timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`,
    });
    res.status(200).json({ message: "Message saved successfully." });
  } catch (error) {
    console.log(error);
  }
};

export const handleGetMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const myMessages = await Message.find({ from, to });
    const receivedMessages = await Message.find({ from: to, to: from });
    // sort messages based on date
    const messageList = myMessages.concat(receivedMessages).sort((p1, p2) => {
      const date1 = new Date(p1.Date);
      const date2 = new Date(p2.Date);
      return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
    });

    res.status(200).json({ messageList });
  } catch (error) {
    console.log(error);
  }
};

export const handleGetRescentChats = async (req, res) => {
  try {
    const userId = req.body.user.userId;
    const user = await User.findOne({ userId });
    // console.log(user);
    res.status(200).json({ rescentChats: user.chatsList,groups:user.groups });
  } catch (error) {
    console.log(error);
  }
};

//! We ll receive from and to user , since we are handling unread chats, so we add from user in to user's unreadUsers
export const handleAddUnreadUser = async (req, res) => {
  try {
    const { from, to } = req.body;

    const toUser = await User.findOne({ userId: to.userId });
    const unreadUsers = toUser.unreadUsers;
    const isFromPresent = toUser.unreadUsers.some(
      (user) => user.userId === from.userId
    );

    if (isFromPresent) {
      res.status(200).json({ message: "Done" });
    } else {
      unreadUsers.push({ userId: from.userId });

      await User.updateOne({ userId: to.userId }, { unreadUsers });

      res
        .status(200)
        .json({ message: `${from.name} added in unreadUsers of ${to.name}.` });
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleGetUnreadUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId: userId });
    // console.log(user);
    res.status(200).json({ unreadUsers: user.unreadUsers });
  } catch (error) {
    console.log(error);
  }
};

export const handleChangeUnreadUsers = async (req, res) => {
  try {
    const { from, to } = req.body;
    const toUser = await User.findOne({ userId: to.userId });
    const toUnreadUsers = toUser.unreadUsers;
    const updatedUnreadUsers = toUnreadUsers.filter(
      (user) => user.userId !== from.userId
    );

    const data = await User.updateOne(
      { userId: to.userId },
      { unreadUsers: updatedUnreadUsers }
    );
    // console.log(data);
    res.status(200).json({
      message: `${from.name} removed from ${to.userId}'s unreadUsers.`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleCreateGroup = async (req, res) => {
  try {
    const { groupName, groupDescription, groupMembers } = req.body;
    // console.log(req.body.groupInfo)
    const isGroupPresent = await Group.findOne({ groupName });
    if (isGroupPresent !== null) {
      res
        .status(202)
        .json({ message: `Group with name ${groupName} already exists.` });
    } else {
      const groupId = uuidv4();
      await Group.create({
        groupName,
        groupDescription,
        groupMembers,
        groupId,
      });
      groupMembers.forEach(async (member) => {
         await User.updateOne({userId:member.userId},{$push:{groups:{groupName,groupId}}})
      });
      await GroupChat.create({ groupId, groupChats: [] });
      res
        .status(200)
        .json({ message: `Group ${groupName} created successfully.` });
    }
  } catch (error) {
    console.log(error);
  }
};
export const handleGetGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const groups = await Group.find({
      groupMembers: { $elemMatch: { userId } },
    });
    res.status(200).json({ groups });
  } catch (error) {
    console.log(error);
  }
};

export const handleGetGroupChats = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await GroupChat.findOne({ groupId });
    // console.log(group?.groupChats)
    res.status(200).json({ groupChats: group?.groupChats });
  } catch (error) {
    console.log(error);
  }
};

export const handleSendGroupMessage = async (req, res) => {
  try {
    const { groupId, from, message } = req.body;

    const group = await GroupChat.findOne({ groupId });
    const newGroupChats = group.groupChats;
    newGroupChats.push({
      message,
      from,
      timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`,
      date: new Date(),
    });
    console.log(newGroupChats);
    const data = await GroupChat.updateOne(
      { groupId },
      { groupChats: newGroupChats }
    );
    console.log(data);
    res.status(200).json({ message: "Group message sent successfully." });
  } catch (error) {
    console.log(error);
  }
};

export const handleGetGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupChats } = await GroupChat.findOne({ groupId });
    res.status(200).json({ groupChats });
  } catch (error) {
    console.log(error);
  }
};

export const handleSaveNotification = async(req,res)=>{
  try {
    const {userId,notification} = req.body;   
   const notific= await Notification.findOne({userId})
   if(notific!==null){
    await Notification.updateOne({userId},{$push:{notifications:notification}});
   }
   else{
    await Notification.create({userId,notifications:[notification]});
   }
    
    console.log(notification)
    res.status(200).json({message:"notifications fetched"})
    
  } catch (error) {
    console.log(error)
  }
  
}

export const handleRemoveNotification = async(req,res)=>{

  try {
    // from is a full user object here
    const {userId,from} = req.body;
    const notification = await Notification.findOne({userId});
    const modifiedNotifications = notification.notifications.filter(notification=>notification.notifySender.userId!==from.userId);

    await Notification.updateOne({userId},{notifications:modifiedNotifications});
    res.status(200).json({message:"Notification removed successfully."})


  } catch (error) {
    console.log(error)
  }
}

export const handleRemoveAllNotifications = async(req,res)=>{
  try {
    // from is a full user object here
    const {userId} = req.body;
    await Notification.updateOne({userId},{notifications:[]});
    res.status(200).json({message:"Notifications cleared successfully."})


  } catch (error) {
    console.log(error)
  }

}

export const handleGetNotifications = async(req,res)=>{

  try {
    const {userId} = req.params;

    const notification = await Notification.findOne({userId});
    console.log(notification)
    res.status(200).json(notification);
    
  } catch (error) {
    
    console.log(error)
  }
}