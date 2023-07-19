import User from "../models/user.js";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import Message from "../models/message.js";


export const handleSignup= async (req,res)=>{
    const { name, email, password } = req.body;
    
    console.log(req.body)
    const userId = uuidv4();

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  const emailCount = await User.find({ email }).count();

 if (emailCount !== 0) {
    res.status(200).json({ message: "Email already registered!", status: 400 });
  } else {
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
}

export const handleLogin = async (req,res)=>{
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
            id:user.userId
          },
          'ashish123'
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
}

export const handleGetUserInfo = async (req,res)=>{

}

export const handleSearchUser= async (req,res)=>{
  
  const {searchFriends}=req.body;
  try {

    const users = await User.find({ email: { $regex: searchFriends, $options: 'i' } });
    if(users.length==0){
      res.status(202).json({message:"User not found."})
    }
    else{
      res.status(200).json({users})
    }
    
  } catch (error) {
    console.log(error)
  }

}

export const handleSendMessage =async(req,res)=>{
  const {from,to,message} = req.body;
  console.log(req.body)
  // save the message in database
  try {
      
    const fromUser = await User.findOne({userId:from?.userId})
     const toUser= await User.findOne({userId:to?.userId})
    
     const fromChatList = fromUser.chatsList;
     const toChatList = toUser.chatsList;
     console.log(toChatList,fromChatList)

     if(!fromChatList.some(chat=>chat.userId===toUser.userId)){
       fromChatList.push({name:toUser.name,userId:toUser.userId});
     }
     if(!toChatList.some(chat=>chat.userId===fromUser.userId)){
      toChatList.push({name:fromUser.name,userId:fromUser.userId});
     }

     await User.updateOne({userId:fromUser.userId},{chatsList:fromChatList})
     await User.updateOne({userId:toUser.userId},{chatsList:toChatList})
     
     
    
    await Message.create({
      users:[from.userId,to.userId],
      from:from.userId,
      to:to.userId,
      messageBody:message,
      Date: (new Date()),
      timestamp:`${(new Date()).getHours()}:${(new Date()).getMinutes()}`
    })
    res.status(200).json({message:"Message saved successfully."});

  } catch (error) {
    console.log(error)
  }
 
}

export const handleGetMessages = async(req,res)=>{
  
  try {
    const {from,to} = req.body;
    const myMessages= await Message.find({from,to});
    const receivedMessages = await Message.find({from:to,to:from});
    // sort messages based on date
    const messageList = (myMessages.concat(receivedMessages))
    .sort((p1, p2) => {
      const date1 = new Date(p1.Date)
      const date2 = new Date(p2.Date)
      return (date1 > date2) ? 1 : (date1 < date2) ? -1 : 0
    });
    
    res.status(200).json({messageList})

  } catch (error) {
    console.log(error)
  }
}

export const handleGetRescentChats =async (req,res)=>{
  try {
    const userId = req.body.user.userId
     const user = await User.findOne({userId});
     console.log(user)
     res.status(200).json({rescentChats:user.chatsList})
  } catch (error) {
    console.log(error)
  }
  
}