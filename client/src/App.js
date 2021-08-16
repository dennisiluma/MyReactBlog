import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import PageNotFound from "./pages/PageNotFound";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import {AuthContext} from "./helpers/AuthContext";
import {useState, useEffect} from 'react';
import axios from 'axios';
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const [authState, setAuthState]=useState({
    username:"",
    id:0,
    status:false
  });
  /*the use effect runs immediately when you open your web page
    it runs once when you add [] after the commma, otherwise it will keep refreshing your  page 
  */
  useEffect(()=>{
    // this is used to make calls to the endpoint(i.e the below stuffs in Users.js in serverAPI folder) to check if auth is true to avoid manual auth inpute
    axios.get("http://localhost:3001/auth/auth", {
      headers:{
        accessToken:localStorage.getItem("accessToken"),
      }
    }).then((response)=>{// the response parameter value is what is coming from server Users.js line 34
      if(response.data.error){
        setAuthState({...authState, status:false}); //this is how to destruction an object inorder to get one item

      }else{
        setAuthState({
          username:response.data.username,
          id:response.data.id,
          status:true
        });

      }
    })
      setAuthState(true);

  }, []);

  /**Method that's called when we click logout button */
  const logout = ()=>{
    localStorage.removeItem("accessToken");
    setAuthState({username:"",id:0, status:false});
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page</Link>
                  <Link to="/createpost"> Create A Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username} </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/changepassword" exact component={ChangePassword} />
            { /*route for page not found*/}
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;