import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import {AuthContext} from '../helpers/AuthContext';

function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const {authState} = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/${id}`).then((response) => {
      setPostObject(response.data);
    });

    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post("http://localhost:3001/comments", {
        commentBody: newComment,
        PostId: id,
      }, 
      /* the config for the request e.g header is passed like this */
      {
        headers:{
          accessToken: localStorage.getItem("accessToken"),
        },
      }
      )
      .then((response) => {
        if (response.data.error) {
          alert(`You aren't authorized to comment ${response.data.arror}`);
        }else{
          
          const commentToAdd = { commentBody: newComment, username:response.data.username };//displaye comments that were added immediately starts here
          setComments([...comments, commentToAdd]);
          setNewComment("");
        }
      });
  };
  const deleteComment = (id)=>{
     axios.delete(`http://localhost:3001/comments/${id}`, {
       headers:{accessToken:localStorage.getItem("accessToken")
     }}).then(()=>{
       /**To remove the comment from user view which has already been removed from the back end
        * and to avoid manually refreshing, */
       setComments(
         comments.filter((val)=>{
           return val.id !=id; /*val represent each comment in the list. what the filter is doing is that
            it goes through all items in comments and save each as val and check if the id of any item 
            is eaual to the id passed then filter it out(i.e remove it) else, leave the item. 
            terefore the javascript filter is used to take items*/
         })
       )
     });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
      });
  };
  const editPost = (option)=>{
    if(option === "title"){
      let newTitle = prompt('Enter new title'); //like a semi popup dialog box
      axios.put("http://localhost:3001/posts/title", {
        newTitle: newTitle,
        id:id//this id is coming form the useParams().id above,there are batter ways of doings this sha
      },{headers: { accessToken: localStorage.getItem("accessToken") },});
      //how to directly update your ui without having to refresh
      setPostObject({...postObject, title: newTitle}) //this is a destruction it meams we keep everythin inside the postObject the same except the title. in this case we set the title to newTitle
  
    }else{
      let newPostText = prompt('Enter new body');

      axios.put("http://localhost:3001/posts/postText", {
        newText: newPostText,
        id:id
      },{headers: { accessToken: localStorage.getItem("accessToken") },});
      //how to directly update your ui without having to refresh
      setPostObject({...postObject, postText: newPostText})//we are simply saying only update the postText field of the postObject. that's all
    }
  }

  

  
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div className="title" onClick={() => {
              if(authState.username === postObject.username)
              {
                editPost("title");
              }}}>
                {postObject.title}
          </div>
          <div className="body" onClick={() => {
              if (authState.username === postObject.username)
               {
                editPost("body");
                }
              }}>{postObject.postText}
            </div>
          <div className="footer">
            {postObject.userName}
            {/* delete post */}
            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}>
                Delete Post
              </button>
            )}
            </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              //display comments
              <div key={key} className="comment">
              <div><label>Username: {comment.username}</label></div>
                {comment.commentBody}
                {authState.username == comment.username && <button onClick={()=>{deleteComment(comment.id)}}>x</button>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;