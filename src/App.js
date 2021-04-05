import React ,{useState ,useEffect} from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import ImageUpload  from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

// getModalStyle
function getModalStyle() {
  const top = 50 ;
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

  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);
  const [openSignIn,setOpenSignIn] = useState(false);

  
 useEffect(()=>{
     const Unsubscribe=auth.onAuthStateChanged((authUser)=>{
          if(authUser){
            // user lgogged in
            console.log(authUser);
            setUser(authUser);

          }else{
            // user logged out
            setUser(null);
          }

   });

   return () =>{
    // perform some cleanup actions
      Unsubscribe();
   }

 },[user,username]);
  //  UseEffect--> runs a piece of code under specific condition
   useEffect(()=>{
     //  this is where code runs
     db.collection('posts').orderBy("timestamp","desc").onSnapshot(snapshot =>{
          //  everytime new post added this snapshot event fires
          setPosts(snapshot.docs.map( doc =>{        
                return(
                  { 
                  id :doc.id,
                  post:doc.data()
                })
               
          }));
        
     })

   },[]);

   const signup =(event)=>{

      // /done
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{

        return authUser.user.updateProfile({    
          displayName:username

        })

      })
      .catch((err)=>alert(err.message))
      setOpen(false);

   }

   const signin=(event)=>{

    // /done
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email,password)
    .catch((err)=>alert(err.message));
    setOpenSignIn(false)
     
 }


  return (
    <div className="App">

        {/* Modal Sign Up  */}
        
          <Modal
            open={openSignIn}
            onClose={()=>setOpenSignIn(false)}>

              <div style={modalStyle} className={classes.paper}>
                <form className="app__signup">
                              
                    <img 
                      className="app__signupImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" 
                      alt=""/>
                          
                    <Input
                      placeholder="email"
                      type="text"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}     
                    />
                    <Input
                      placeholder="password"
                      type="password"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}     
                    />
                    
                    <Button type="submit" onClick={signin}>Sign In </Button>

                  
                </form>
              
            </div>
          </Modal>

          {/* Modal Sign In */}

          <Modal
            open={open}
            onClose={()=>setOpen(false)}>

              <div style={modalStyle} className={classes.paper}>
                <form className="app__signup">
                    
                    
                    <img 
                      className="app__signupImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" 
                      alt=""/>
                  

                    <Input
                      placeholder="username"
                      type="text"
                      value={username}
                      onChange={(e)=> setUsername(e.target.value)}     
                    />
                    <Input
                      placeholder="email"
                      type="text"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}     
                    />
                    <Input
                      placeholder="password"
                      type="password"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}     
                    />
                    
                    <Button type="submit" onClick={signup}>Signup </Button>

                  
                </form>
              
              

            </div>
          </Modal>

          <div className="app__header">

            <img 
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" 
            alt=""/>
              {user?.displayName ?(
            <ImageUpload username={user.displayName} />
          ):(
            <h3></h3>
          )}

              {user ?(
              <Button onClick={()=> auth.signOut() }> LogOut</Button>
            ):(
            <div className="ap__logincontainer">
              
              <Button onClick={()=>{setOpenSignIn(true)}}> Sign In </Button>|
              <Button onClick={()=>{setOpen(true)}}> Register</Button>
            </div>
      
            )}
          </div>
        
          <div className="app__post">
          <div className= "app__postleft">
          {
            posts.map(({ id,post}) => {
                  return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
              })

          }
        </div>                
          <div className= "app__postright">
            <InstagramEmbed
                      url='https://www.instagram.com/p/CM-GBiNs1PW/'
                      maxWidth={375}
                      hideCaption={false}
                      containerTagName='div'
                      injectScript
                      protocol=''
                      onLoading={() => {}}
                      onSuccess={() => {}}
                      onAfterRender={() => {}}
                      onFailure={() => {}}
                    />
                   
            </div>


          </div>
          
           
    
    </div>
  );
}

export default App;
