const asyncHandler = require("express-async-handler");
// const axios = require("axios");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");
// const openAIApi  =require("openai");


const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable 
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const openAIController = asyncHandler(async (req, res) =>{
   const { prompt } = req.body;
   try{
   const model = genAI.getGenerativeModel({ model: "gemini-pro",
   
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const content=text;
  const newContent = await ContentHistory.create({
    user: req?.user?._id,
    content,
  });
  //Push the content into the user
  const userFound = await User.findById(req?.user?.id);
  userFound.contentHistory.push(newContent?._id);
  //Update the api Request count
  userFound.apiRequestCount += 1;

  await userFound.save();
  res.status(200).json(content);
}
  catch (error) {
    throw new Error(error);
  }
});




module.exports = {
  openAIController,
};


