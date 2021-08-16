const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then((match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

      const accessToken = sign({username:user.username, id:user.id}, "importantSecreet"); //generate token
    res.json({token:accessToken, username:username, id:user.id});

  });
});
/* helps to prevent manual token injection. This is used inside the App.js at the frontend */
router.get('/auth', validateToken, (req, res)=>{
  res.json(req.user) // the 'req.user' is comming from the middleware imported as validateToken which was passed into the router
});
/* route to profile*/
router.get("/basicinfo/:id", async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, { 
    attributes: { exclude: ["password"] },// this query selects and exclude arrays of fields to ignore. e.g the password field
  });

  res.json(basicInfo);
});

  /*Change Password*/

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match){
       res.json({ error: "Wrong Password Entered!" });
      }else{    
        bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },//here we are updating the column with value hash
          { where: { username: req.user.username } } // the target column to update is found in the roll that has a username of req.user.username
        );
        res.json("SUCCESS");
      });};
  });
});

module.exports = router;