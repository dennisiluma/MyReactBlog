const express = require('express');
const router = express.Router();
const {Posts, Likes} = require('../models');
const { validateToken } = require("../middlewares/AuthMiddleware");

// const db = require('../models');
//const Posts = db.Posts //same as const {Posts} = require('../models');

/* the below helps to pass the token if the user is autheticated*/
// const passToken = (header)=>{
//     if(header.data.headers.accessToken == localStorage.getItem("accessToken")){
//         return validateToken
//     }else{
//         return validateToken
//     }
// }

router.get("/", validateToken, async (req, res)=>{
    const listOfPosts = await Posts.findAll({ include: [Likes] }); //include is used to join table, by doing this,we get the amount of likes associated with the post so we can display return and display it in to the users
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } }); // query the likes table and get all the likes of current authenticated user; this will be used to manipilate the likes for that user in frontend
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });

});
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
  });  

  /* this is used in the profile page to query data of selected user*/
  router.get("/byuserId/:id", async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes], //we included the likes model so well have access to the likes table at our frontend
    });
    res.json(listOfPosts);
  });

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username; //we are getting the username from validateToken and adding it to the username field in the post
    post.UserId = req.user.id; //get the userId from validateToken
    await Posts.create(post);
    res.json(post);
  });

  router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({
      where: {
        id: postId,
      },
    });
  
    res.json("DELETED SUCCESSFULLY");
  });

  router.put("/title", validateToken, async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update({ title: newTitle }, { where: { id: id } });
    res.json(newTitle);
  });
  
  router.put("/postText", validateToken, async (req, res) => {
    const { newText, id } = req.body;
    await Posts.update({ postText: newText }, { where: { id: id } });
    res.json(newText);
  });

module.exports = router