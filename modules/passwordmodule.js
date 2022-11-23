const { ObjectID } = require("bson");
const  mongo  = require("../connect.js")
const  bcrypt  = require("bcrypt")
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const { base64encode, base64decode } = require('nodejs-base64');

const checkPassword =(password,confirm_password)=>{
    return password!==confirm_password? false:true;
}

module.exports.signup=async (req,res,next)=>{
    try{

        checkEmailExists = await mongo.selectedDB.collection("users").findOne({ email:req.body.email });
        if(checkEmailExists){
          return  res.status(400).send({"msg":"You are already a registered user"});
        }     

         const isSamePassword= checkPassword(req.body.password,req.body.confirm_password); 
         if(!isSamePassword){
            return  res.status(400).send({"msg":"passwords doesnt match"});
         }else{
             delete req.body.confirm_password;
         }
         //password encryption
          //const randomString = await bcrypt.genSalt(10);  
          //req.body.password = await bcrypt.hash(req.body.password,randomString);
         
          //save in DB  
          responseInserted = await mongo.selectedDB.collection("users").insertOne({...req.body});
          res.send({"msg":"You are registered successfully!"});
      }catch(error){
          console.error(error);
          res.status(500).send(error);
      }
  
}

module.exports.checkUser=async (req,res,next)=>{
    
    function toISOStringLocal(d) {
        function z(n){return (n<10?'0':'') + n}
        return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
               z(d.getDate()) + 'T' + z(d.getHours()+2) + ':' +
               z(d.getMinutes()) + ':' + z(d.getSeconds());
                
      }
     function addHours(numOfHours, date = new Date()) {
        date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
        return date;
      }
         
   
    //console.log(req);
    try{
        
        const alreadyexists=(await mongo.selectedDB.collection("users").findOne(
            {
                $and: [
                    {'email': req.body.email},
                ]
            }
        ));
        if(!alreadyexists){
            return  res.status(400).send({"msg":"Invalid email.Check with Support Team or Signup as new user"});
        }  
        
        
            //Generate and send token as response
            //const token = jwt.sign(alreadyexists,process.env.SECRET_KEY, { expiresIn:'1hr' });

            //password encryption
            const randomString = await bcrypt.genSalt(10);  
            const randomString_email = await bcrypt.hash(req.body.email,randomString);
            let encoded_token = base64encode(randomString_email);
            //console.log(randomString_email);

             var datetime= toISOStringLocal(new Date())+'Z'; var expiry_datetime='';
            //console.log(datetime);
            
            const updatedData= await mongo.selectedDB.collection("users").updateOne(
            { _id: ObjectId(alreadyexists._id) },
            { $set:{ password_token : encoded_token, token_expiry:(datetime)  } },
            { returnDocument: "after" },   
            );
          
 
                var transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: 'saleem.mcstn@gmail.com',
                        clientId: '802969667608-jrvc1tso1bfcik3tmr9sddo8blavpf2n.apps.googleusercontent.com',
                        clientSecret: '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',
                        refreshToken: '1//043eA_7ZtJk3jCgYIARAAGAQSNgF-L9IrMmsSv9_j_Ap0MAVM_8S5U2hj4fNvDHYmxKTq0JoScuFK30VbmQ5Gd018RGfI1TbCtw',
                        accessToken: 'ya29.a0AeTM1iddrdOOhZZ9tjfVkgECu_HNdtHB5ZZSa1awh-ytWXZF5b46kdhFBF_YW8kJc8_GVDuKIPG7ft5bJZWhY-UWL6jkW-q3J8clFe6eCtGchJUDW5Vc9dTg2nZ_ReDk23O1AvI-9widNJJBdqoprICCpsYxaCgYKAZ8SARISFQHWtWOmeuQyz5KgKuZTMt3Q58yxUg0163',
                        }
                });
                
                
                var mail = {
                    from: "test@gmail.com",
                    to: "saleem.mcstn@gmail.com",
                    subject: "Guvi Forgot Password",
                    text: "Following is the link to reset your password,\n http://localhost:3000/Resetpassword/"+encoded_token,
                    html: "<p>Following is the link to reset your password,</p><p>http://localhost:3000/Resetpassword/"+encoded_token+"</p> <p>Best Regards,</p><p>Support Team,</p><p>Guvi</p>",
                }

              const mail_sent =  transporter.sendMail(mail, function(err, info) {
                    if (err) {
                       // console.log(err);
                    } else {
                        // see https://nodemailer.com/usage
                       // console.log("info.messageId: " + info.messageId);
                       // console.log("info.envelope: " + info.envelope);
                       // console.log("info.accepted: " + info.accepted);
                       // console.log("info.rejected: " + info.rejected);
                      //  console.log("info.pending: " + info.pending);
                      //  console.log("info.response: " + info.response);
                    }
                    transporter.close();
                });
                

            res.send({"msg":"Email has been sent with the reset password link. Thank you"});
    
      }catch(error){
         // console.error(error);
          res.status(500).send(error);
      }
    
}

module.exports.checKTokenexists=async (req,res,next)=>{
   
    function toISOStringLocal(d) {
        function z(n){return (n<10?'0':'') + n}
        return d.getFullYear() + '-' + z(d.getMonth()+1) + '-' +
               z(d.getDate()) + 'T' + z(d.getHours()) + ':' +
               z(d.getMinutes()) + ':' + z(d.getSeconds());
                
      }

    const password_token=req.params.password_token; const currentDatetime = toISOStringLocal(new Date())+'Z';
    //console.log(password_token);
    try{

        // Verifing the JWT token
        /*jwt.verify(password_token, process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                console.log(err);
                return  res.status(500).send({"msg":err});
            }
        });*/

        //check user email already exists
        const checkUserexists = await mongo.selectedDB.collection("users").findOne({  $and: [
                                                {'password_token': password_token},
                                ]});
       
        if(!checkUserexists){
            return res.status(400).send({"msg":"Not a valid token"});
        }  
        //console.log(currentDatetime+"===="+checkUserexists.token_expiry);
        if(currentDatetime>checkUserexists.token_expiry){
            return res.status(400).send({"msg":"Token Expired"});
        }

        //update password
        res.send({"msg":"Token exists"});

      }catch(error){
          console.error(error);
          res.send(error);
      }
    
}

module.exports.resetPassword=async (req,res,next)=>{
    console.log(req.body);
    try{
        //check token already exists
        
        const checktokenexists=(await mongo.selectedDB.collection("users").findOne(
            {
                $and: [
                    {'password_token': req.body.password_token},
                ]
            }
        ));
        if(!checktokenexists){
            return  res.status(400).send({"msg":"Not a valid token"});
        }  
        //update password
         await mongo.selectedDB.collection("users").updateOne(
            { _id: ObjectId(checktokenexists._id) },
            { $set:{ password_token : "", password:req.body.password, token_expiry:"" } },
            { returnDocument: "after" },   
            );
            res.send({"msg":"Updated Successfully"});

      }catch(error){
         // console.error(error);
          res.status(500).send(error);
      }
    
}
