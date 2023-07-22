import express from "express";
import {
  handleAddUnreadUser,
  handleChangeUnreadUsers,
  handleCreateGroup,
  handleGetGroupChats,
  handleGetGroupMessages,
  handleGetGroups,
  handleGetMessages,
  handleGetNotifications,
  handleGetRescentChats,
  handleGetUnreadUsers,
  handleGetUserInfo,
  handleLogin,
  handleRemoveAllNotifications,
  handleRemoveNotification,
  handleSaveNotification,
  handleSearchUser,
  handleSendGroupMessage,
  handleSendMessage,
  handleSignup,
} from "../controllers/user.js";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Welcome to home route");
});

routes.post("/signup", handleSignup);
routes.post("/login", handleLogin);
routes.post("/getuserinfo", handleGetUserInfo);
routes.post("/searchuser", handleSearchUser);
routes.post("/savemessage", handleSendMessage);
routes.post("/messages", handleGetMessages);
routes.post("/getrescentchats", handleGetRescentChats);
routes.post("/unreaduser", handleAddUnreadUser);
routes.get("/unreadusers/:userId", handleGetUnreadUsers);
routes.post("/updateunreadusers", handleChangeUnreadUsers);
routes.post("/creategroup", handleCreateGroup);
routes.get("/getgroups/:userId", handleGetGroups);
routes.get("/getgroupchats/:groupId", handleGetGroupChats);
routes.post("/savegroupmessage", handleSendGroupMessage);
routes.get("/getgroupmessages/:groupId", handleGetGroupMessages);
routes.post('/savenotification',handleSaveNotification)
routes.get('/getnotification/:userId',handleGetNotifications)
routes.post('/removesinglenotification',handleRemoveNotification)
routes.post('/clearnotification',handleRemoveAllNotifications)

export default routes;
