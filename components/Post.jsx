import React, { useState } from 'react';
import { Box, Grid, Card, CardMedia, CardActions, Avatar, Typography, IconButton, Paper, Popover, Menu, MenuItem } from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { doc, deleteDoc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, deleteObject } from 'firebase/storage'

import { useRecoilValue } from 'recoil'
import { userdata, username, useruploads, userid } from "../atoms/userAtom";
import Router, { useRouter } from 'next/router';

export function Post ({ post }) {
    const [currentPost, setCurrentPost] = useState(post);
    const currentUserID = useRecoilValue(userid);
    const currentUsername = useRecoilValue(username)
    const currentUserData = useRecoilValue(userdata);

    const likedBy = currentPost.likedBy;
    const [isPostLiked, setIsPostLiked] = useState(likedBy.includes(currentUserID));

    const postTime = post.time;
    const postTimeInDateFormat = new Date(postTime.seconds * 1000 + postTime.nanoseconds / 1000000);
    const postTimeToDisplay = postTimeInDateFormat.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", });

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverAnchor, setPopoverAnchor] = useState(null);

    // const updatePostStatsInterval = setInterval(() => {
    //     /* If Else Not Working
    //     if(likedBy === post.likedBy) {
    //         console.log("EMPTY");
    //         return;
    //     } else {
    //         console.log(likedBy);
    //         const postDocRef = doc(db, `posts/${post.postDocID}`);
    //         getDoc(postDocRef).then(snapshot => console.table(snapshot.data()));
    //     } */

    //     const postDocRef = doc(db, `posts/${post.postDocID}`);
    //     setDoc(postDocRef, { numberOfLikes: numberOfLikes, likedBy: likedBy }, { merge: true }).then(() => {
    //         getDoc(postDocRef).then(snapshot => console.table(snapshot.data()));
    //     });
    // }, 10000);

    const router = useRouter();
    const handleDelete = () => {
        setPopoverOpen(false);
        const postDocumentID = post.postID;
        const postReference = doc(db, `posts/${postDocumentID}`);
        const postImageURL = currentPost.url;
        const postImageReference = ref(storage, postImageURL);

        const userDocumentReference = doc(db, `users/${currentUserID}`);
        const userUploadsArray = currentUserData.uploads;
        const newUserUploadsArray = userUploadsArray.filter(uploadID => uploadID !== postDocumentID);

        deleteObject(postImageReference).then(() => {
            deleteDoc(postReference).then(() => {
                updateDoc(userDocumentReference, "uploads", newUserUploadsArray).then(() => {
                    router.push(`/${currentUsername}/profile`);
                }).catch(error => console.log(error));
            }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    }

    const handleLikePost = () => {
        const numberOfLikes = currentPost.numberOfLikes;
        const likedBy = currentPost.likedBy;
        if(isPostLiked) {
            setIsPostLiked(false);
            const newNumberOfLikes = numberOfLikes-1;
            const newLikedBy = likedBy.filter( userID => userID !== currentUserID);
            setCurrentPost({ ...currentPost, numberOfLikes: newNumberOfLikes, likedBy: newLikedBy });
        }
        else {
            setIsPostLiked(true);
            const newNumberOfLikes = numberOfLikes+1;
            const newLikedBy = [...likedBy, currentUserID];
            setCurrentPost({ ...currentPost, numberOfLikes: newNumberOfLikes, likedBy: newLikedBy });
        }
    }

    return (
        <Card sx={{padding: "0.25rem"}}>
            <Paper elevation={5} sx={{ padding: "0.75rem" }}>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Avatar sx={{ marginRight: "1rem" }} />
                        <Grid container direction="column">
                            <Typography fontSize="large" variant="overline" sx={{ lineHeight: "1.5rem", textTransform: "none" }}>{currentUsername}</Typography>
                            <Typography fontSize={"small"}>{currentUserData.numFollowers} followers</Typography>
                        </Grid>
                    </Box>
                    <IconButton onClick={event => {
                        if(popoverOpen)
                            setPopoverAnchor(null);
                        else
                            setPopoverAnchor(event.currentTarget);
                        setPopoverOpen(!popoverOpen);
                    }}>
                        <MoreVertIcon />
                        <Menu
                        open={popoverOpen}
                        anchorEl={popoverAnchor}
                        anchorOrigin={{
                            vertical: "bottom", horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top", horizontal: "right",
                        }}
                        >
                            <MenuItem sx={{ minHeight: "0" }} onClick={handleDelete}>
                                <DeleteForeverIcon sx={{marginRight: "1rem"}} /> 
                                Delete
                            </MenuItem>
                        </Menu>
                    </IconButton>
                </Grid>
                <CardMedia
                component="img"
                src={post.url}
                alt={post.altText}
                sx={{ marginTop: "1rem",aspectRatio: "1" }}
                />
                <Grid container direction="row" alignItems="center" justifyContent="space-between" sx={{ padding: "0.5rem 0.25rem 0rem 0.25rem" }}>
                    <Typography variant="overline" sx={{ lineHeight: "1rem" }}>{currentPost.numberOfLikes} likes</Typography>
                    <Typography variant="overline" sx={{ lineHeight: "1rem" }}>{currentPost.numberOfComments ? currentPost.numberOfComments : "0"} comments</Typography>
                </Grid>
                <span>
                    <Typography variant='caption' fontWeight="bolder" sx={{ paddingRight: "0.25rem" }}>{post.uploaderUsername}</Typography>
                    <Typography variant='caption'>{post.caption}</Typography>
                </span>
                <Typography variant='subtitle2'>{postTimeToDisplay}</Typography>
                <CardActions disableSpacing sx={{ padding: "0", paddingTop: "0.5rem" }}>
                    <Grid container direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <IconButton onClick={handleLikePost} sx={{ padding: "0", paddingRight: "0.5rem" }}>
                                {isPostLiked ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <IconButton sx={{ padding: "0", paddingRight: "0.5rem" }}>
                                <CommentRoundedIcon />
                            </IconButton >
                            <IconButton sx={{ padding: "0" }}>
                                <SendRoundedIcon />
                            </IconButton>
                        </Box>
                        <IconButton sx={{ padding: "0" }}>
                            <BookmarkRoundedIcon />
                        </IconButton>
                    </Grid>
                </CardActions>
            </Paper>
        </Card>
    );
}