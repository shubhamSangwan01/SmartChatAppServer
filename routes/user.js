import express from 'express'
import {  handleGetMessages, handleGetRescentChats, handleGetUserInfo, handleLogin, handleSearchUser, handleSendMessage, handleSignup } from '../controllers/user.js';

const routes = express.Router();

routes.get('/',(req,res)=>{
    res.send("Welcome to home route")
})

routes.post('/signup',handleSignup);
routes.post('/login',handleLogin);
routes.post('/getuserinfo',handleGetUserInfo);
routes.post('/searchuser',handleSearchUser)
routes.post('/savemessage',handleSendMessage);
routes.post('/messages',handleGetMessages);
routes.post('/getrescentchats',handleGetRescentChats);



export default routes