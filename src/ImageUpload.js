import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { db, storage } from './firebase'
import firebase from "firebase"
import "./ImageUpload.css"





const ImageUpload = ({username, setUploadImage}) => {

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)


    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_change",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                // Error function
                alert(error.message);
            },
            // the complete function
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        
                    })

            }

        )
        setUploadImage(false)

    }



    return (
        <div className="imageUpload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <div className="inputfields">
                <input 
                    type="text"
                    placeholder="Enter a caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <input 
                    type="file" 
                    onChange={handleChange}
                />

            </div>
            <div className="upload__button">
                {
                    image ? (
                    <Button  onClick={handleUpload}>Upload</Button>
                        ):(
                            <Button disabled onClick={handleUpload}>Upload</Button>

                        )
                }

            </div>
           
           



            
        </div>
    )
}

export default ImageUpload
