const express= require('express');
const cookieParser = require('cookie-parser');
const userRouter =require('./routes/usersRouter.js');
require('dotenv').config();
const {errorHandler}=require('./middlewares/errorMiddleware.js');
const openAIRouter = require('./routes/openAIRouter.js');
const cron = require('node-cron');
const cors = require('cors');



const connectDB = require('./utils/connectDB.js');
const stripeRouter = require('./routes/stripeRouter.js');
connectDB()


const app= express();
const PORT = 8002 || process.env.PORT;

cron.schedule("0 0 * * * *", async () => {
    console.log("This task runs every second");
    try {
      //get the current date
      const today = new Date();
      const updatedUser = await User.updateMany(
        {
          trialActive: true,
          trialExpires: { $lt: today },
        },
        {
          trialActive: false,
          subscriptionPlan: "Free",
          monthlyRequestCount: 5,
        }
      );
      console.log(updatedUser);
    } catch (error) {
      console.log(error);
    }
  });


//Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Free",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  
  //Cron for the Basic plan: run at the end of every month
  cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Basic",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  
  //Cron for the Premium plan: run at the end of every month
  cron.schedule("0 0 1 * * *", async () => {
    try {
      //get the current date
      const today = new Date();
      await User.updateMany(
        {
          subscriptionPlan: "Premium",
          nextBillingDate: { $lt: today },
        },
        {
          monthlyRequestCount: 0,
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
  //Cron paid plan  

app.use(express.json());

app.use(cookieParser());

const corsOption={
  origin:'http://localhost:5173',
  credentials:true,
}
app.use(cors(corsOption));
app.use("/api/v1/users",userRouter);
app.use("/api/v1/openai",openAIRouter);
app.use("/api/v1/stripe",stripeRouter);

app.use(errorHandler);

//start the server
app.listen(PORT , console.log(`Server is running on port ${PORT}`));


//stat project by creating folder
//npm init --yes to create package.json
//download express for server
//jsonwebtoken(jwt) for authentication security
//dotenv load env variables into process.env directly
//mongoose for database
//bcryptjs for hashing 
//download nodemon -D for dev dependencies
//dependencies: package required by our application in production
//dev-dependencies : package used for local testing and usage.


//username: nandandpatel
//password : Nandanpatel94

//async functions:. In contrast to synchronous functions, which execute code sequentially, asynchronous functions allow other code to continue running while waiting for certain operations to complete

//express-async-handler: It takes the asynchronous function (fn) as an argument and returns a new function. This new function ensures that any errors thrown by the asynchronous operation are passed to Express's error handling middleware (next), effectively delegating error handling to the global error handler (errorHandler in this case).


//Axios is a promise-based HTTP library that lets developers make requests to either their own or a third-party server to fetch data

//Extracts the cookie data from the HTTP request and converts it into a usable format that can be accessed by the server-side code

//virtual propery od mongo:a property that is not stored in MongoDB