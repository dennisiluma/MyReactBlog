import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";
import { Link, useHistory } from "react-router-dom";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPost] = useState([]); // this will store response list of liked post as an array by logged in user comming from the backend
  let history = useHistory(); //the useHistory() hook is used to redirect
  const { authState } = useContext(AuthContext);

  /**UseEffect method is called when component is mounted and cleared when component is destroyed */
  useEffect(() => { // use effect is called when component is mouth or when the page is refreshed

    if (!localStorage.getItem("accessToken")) { // check if we auth, if not, redirect if yrs, proceed
      history.push("/login"); //this redirects to login page
    }else{
    axios.get("http://localhost:3001/posts",{headers:{accessToken:localStorage.getItem("accessToken")}}).then((response) => {
      setListOfPosts(response.data.listOfPosts); //store the list of posts coming from api in the listOfPost array using useState
      setLikedPost(response.data.likedPosts.map((like)=>{
        return like.PostId;
      }))

      
    })};
  }, []);
  const likeAPost = (postId)=>{
    axios.post("http://localhost:3001/likes", 
    {PostId:postId}, // this is passed in as the req into the Like.js route
    {headers:{accessToken:localStorage.getItem("accessToken")}}) // this is the passed header the will be received by the auth token validateToken in the Like.js route
      .then((response)=>{
        // alert(response.data.liked);
        /**this function is used to increment the like display so it'll display rather than witing for it to refresh */
        setListOfPosts(listOfPosts.map((post)=>{
          if(post.id === postId){
            if (response.data.liked) {//if we are suppose to like it add
            return { ...post, Likes: [...post.Likes, 0] };//set the post to the way it was but modify the no of likes
          }else{//if are about to unlike, remove the last
            const likesArray = post.Likes;
            likesArray.pop();
            return { ...post, Likes: likesArray };
          }}else{
            return post;
          }
        }));
          //Authimistic rendering. this helps to change color of post when it is liked and unlikes withong havong to refreesh
          if(likedPosts.includes(postId)){
            setLikedPost(likedPosts.filter((id)=>{
              return id != postId; //we are only keeping those we have lik ed before
            })); //filter out the element that contain an id equallsto postId
          }else{
            setLikedPost([...likedPosts, postId]); // this will change the like icon when liked
          }

      });
  }

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <div className="title"> {value.title} </div>
            <div
              className="body"
              onClick={() => {
                history.push(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;