const express = require("express");
const cors = require("cors");
const dotenv=require("dotenv");
const passwordrouter = require("./router/passwordrouter");
const mongo_connection = require("./connect");

dotenv.config();
mongo_connection.connect();

const app=express();
app.use(cors());

app.use(express.json());

app.use('/forgotpassword',passwordrouter); 
app.get("/", (req, res) =>
  res.send(`Server Running`)
);

app.listen(process.env.PORT, () => console.log(`Server started in the port ${process.env.PORT}`));
