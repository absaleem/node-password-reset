const express=require("express");
const router=express.Router();
const passwordmodule= require("../modules/passwordmodule");

router.post("/signup",passwordmodule.signup);
router.post("/checkUser",passwordmodule.checkUser);
router.post("/resetPassword",passwordmodule.resetPassword);
router.get("/checKTokenexists/:password_token",passwordmodule.checKTokenexists);

module.exports=  router; 