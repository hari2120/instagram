
import React, { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './firebase';
import Post from './Post';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([])
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [opensignIN, setOpenSignIn] = useState(false);


  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  // uploading Image
  const [uploadImage, setUploadImage] = useState(false)

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser)
        if (authUser.displayName) {
          // dont update username

        } else {
          // if we just created some one
          return authUser.updateProfile({
            displayName: username
          })
        }
        
      } else{
        setUser(null)
        

      }
    })
    return () => {
      // perform some clean up actions
      unsubscribe();
    }
    
  }, [user, username])
  

  
  const signUp= (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) =>alert(error.message));
    setEmail('')
    setPassword('')

    setOpen(false)


  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));
    setEmail('')
    setPassword('')
    setUsername('')
    setOpenSignIn(false)
  }


  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    db
    .collection('posts').orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc)=> ({
        id:doc.id, 
        post:doc.data()})))})
    }, [])


  return (
    <div className="">
      <div className="app__header">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app__headerImage" alt="logo" />


        {
          user ? (
            <Button onClick={() => auth.signOut()}>Log out</Button>

          ): (
            <div className="app__LoginContainer">
              <Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
              <Button onClick={() => setOpen(true)}>SignUp</Button>
            </div>
          )
        }
        
      </div>
      <div className="bottom__navbar">
        <div className="item1 item__container">
          <HomeIcon className="item" />
        </div>
        <div className="item2 item__container">
          <SearchIcon className="item" />

        </div>
        <div className="item3 item__container">
        <AddCircleOutlineIcon onClick={() => setUploadImage(!uploadImage)} className="item"/>



        </div>
        <div className="item4 item__container">
          <FavoriteBorderIcon className="item"/>
        </div>
        <div className="item5 item__container">
        <AccountCircleIcon className="item" />

        </div>
      </div>

      <div className={uploadImage ? "upload__image upload__image__show": "upload__image upload__image__hide" } >
        {
          user?.displayName ? (
            <ImageUpload setUploadImage={setUploadImage} username={user.displayName} />

            
          ) : (
            <h3>sorry You need to login In</h3>
          )
        }
      </div>
      <div className="app" onClick={() => setUploadImage(false)}>

      




      
      
     



      <div>
        
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <form action="" >
            <center className="app__signup">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app__headerImage" alt="logo" />
                <Input 
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input 
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={signUp}>sign Up</Button>
            </center>

          </form>
          
          
          </div>
        </Modal>
      <Modal
        open={opensignIN}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form action="" >
            <center className="app__signup">
              <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app__headerImage" alt="logo" />
                
                <Input 
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={signIn}>sign Up</Button>
            </center>

          </form>
          
          
          </div>
        </Modal>
      </div>

      {/* Header */}

      <div className="app__posts">
        {
          posts.map(({post, id}) => (<Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageUrl} />))
        }
      </div>
      




      

      </div>
    </div>
  );
}

export default App;
