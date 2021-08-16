const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const {validateToken} = require('../middlewares/AuthMiddleware')

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;

  const username = req.user.username; // this is comming form the validateToken from middleware
  comment.username = username; //add username to the field object that will be pass and stored in the database
  await Comments.create(comment);

  res.json(comment);
});
/**delete route */
router.delete("/:commentId", validateToken, async (req,res)=>{
  const commentId = req.params.commentId;
  await Comments.destroy({where:{
    id:commentId,
  }});
  /**Note if you didn't sent a response as shown below, the request will continue to run forever
   * so don't make that fucking mistake young lad
   */
  res.json("Deleted Succesfully")
});

module.exports = router;