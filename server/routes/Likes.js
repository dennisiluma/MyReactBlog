const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => { // the header passed is collected by the token and worked on
  const { PostId } = req.body; // get the post ID for the req object
  const UserId = req.user.id; //get user ID from validtoken middlewere. req.user holds the validToken object(which containes username and id)
                                //the userId can also be gotten from req.body. use the one you feel like

  const found = await Likes.findOne({
    where: { PostId: PostId, UserId: UserId }, //Query the likes table and save the value
  });
  if (!found) { //if the value isn't i the like table run the below function by adding it(liking it)
    await Likes.create({ PostId: PostId, UserId: UserId }); //creeate the instance into your database
    res.json({ liked: true });
  } else {
    await Likes.destroy({ //remove the value i.e unlike it
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;