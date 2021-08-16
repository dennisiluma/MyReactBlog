const express = require('express');
const app = express();
const cors = require('cors'); //same as import cors from 'cors;

/** cors helps you to make api calls to a server in your local machine
 * for remote api calls, you don't need it.
 */
app.use(express.json());

app.use(cors()); //white list your api and enables you to connect to your local api

const db = require('./models');

const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

/**Likes router */
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(()=>{
    app.listen(3001, ()=>{
        console.log("Server running on port 3001");
    })
})