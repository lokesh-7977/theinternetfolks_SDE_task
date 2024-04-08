import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

//Routes Imports
import roleRoute from "./routes/role.route.js";
import userRoute from './routes/auth.route.js';
import communityRoute from "./routes/community.route.js";
import memberRoute from "./routes/member.route.js";

//using middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the INTERNET FOLKS API",
  });

});

// server health route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Running Succesfully And Server Health is Good",
  });
});


// actual routes
app.use("/v1/auth",userRoute);
app.use("/v1/role",roleRoute);
app.use("/v1/community",communityRoute);
app.use("/v1/member",memberRoute);


// // if Route is not available
// app.all("*", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found on the server.",
//   });
// });

export default app;
