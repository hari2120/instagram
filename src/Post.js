import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import './post.css';
import firebase from "firebase"




const Post = ({caption, username, imageURL, postId, user}) => {

    const [comments, setcomments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {

        let unsubscribe;

        if(postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setcomments(snapshot.docs.map((doc) => doc.data()))
                });
        }
        




        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }


    return (
        <div className="post" >
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt="Remy Sharp" 
                    src="/static/images/avatar/1.jpg" />

                <h3>{username}</h3>
            </div>

           

            <img className="post__image" src={imageURL} alt=""/>
            
            <p className="post__text"><strong> {username}: </strong>{caption}</p>

            <div className="post__comments">
            {
                comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))
            }

            </div>

            


            {user && (
                 <form action="" className="post__commentBox">
                    <input 
                        type="text"
                        className="post__input"
                        value={comment}
                        onChange= {(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>

            )}
           
        </div>
    )
};

export default Post
