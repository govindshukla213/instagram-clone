import { Button } from '@material-ui/core';
import React,{useState} from 'react';
import {db,storage} from './firebase';
import firebase from 'firebase'
import './ImageUpload.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


function getModalStyle() {
    const top = 50 ;
    const left = 50 ;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
      },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
  

function ImageUpload({username}) {

    const [image,setImage]=useState(null);
    const [caption,setCaption] = useState("");
    const [progress,setProgress] = useState(0);
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const handleCaption = (e)=>{
            
                setCaption(e.target.value);
            
            
    }

    const handleChange=(e)=>{
        
            setImage(e.target.files[0]);
        

    }

    const handleUpload=(e)=>{

        const uploadTask=storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                // progress function
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error)=>{
                console.log(error);
                alert(error.message);
            },
              //  Upload Done now undo the progress bar and caption
            ()  => {

                storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url =>{
                      // post image inside database
                      db.collection("posts").add(
                          {
                             timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                             caption :caption,
                             imageUrl:url,
                             username:username
  
                          }
                      ); 
                      
                 
                  });
  
  
          }

        ) 
        setProgress(0);
        setCaption('');
        setImage(null);
        setOpen(false);      

    }
    
    return (
        <div>
             <Modal
              open={open}
              onClose={()=>setOpen(false)} >
                  <div style={modalStyle} className={classes.paper}>
       
                    <form className="imageupload">
                     <progress value={progress}  max="100"/>
                    <input type="text" placeholder="write caption for your post..." onChange={handleCaption} />
                    <input type="file" onChange={handleChange} />

                    <div className={classes.root}>
                    <Button type="submit" onClick={handleUpload} variant="outlined" color="primary" >Upload</Button>
                    </div>
                    </form>
                    
                    </div>
                
            </Modal>
       <div className={classes.root}>
       
       
       <Button onClick={()=>setOpen(true)} variant="outlined" color="primary" > Upload </Button>
       </div>
       
        </div>


       
    )
}

export default ImageUpload
