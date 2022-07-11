import { useState } from "react";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useRecoilValue } from "recoil";
import { userid } from "../atoms/userAtom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { grey } from "@mui/material/colors";

export function Comment({ comment, postID }) {
    const [currentComment, setCurrentComment] = useState(comment);
    const currentUserID = useRecoilValue(userid);

    const commentTime = comment.commentTime;
    const commentTimeInDateFormat = new Date(commentTime.seconds * 1000 + commentTime.nanoseconds / 1000000);
    const commentTimeToDisplay = commentTimeInDateFormat.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", });

    const likedBy = currentComment.likedBy;
    const [isCommentLiked, setIsCommentLiked] = useState(likedBy?.includes(currentUserID));

    const handleLikeComment = () => {
        const commentID = currentComment.commentID;
        const commentDocumentReference = doc(db, `posts/${postID}/comments/${commentID}`);

        if(isCommentLiked) {
            setIsCommentLiked(false);
            const newLikedBy = likedBy.filter( userID => userID !== currentUserID);
            setCurrentComment({ ...comment, likedBy: newLikedBy });
            updateDoc(commentDocumentReference, "likedBy", newLikedBy);
        }
        else {
            setIsCommentLiked(true);
            const newLikedBy = [...likedBy, currentUserID];
            setCurrentComment({ ...comment, likedBy: newLikedBy });
            updateDoc(commentDocumentReference, "likedBy", newLikedBy);
        }
    }

    return(
        <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <Avatar sx={{ width: "2rem", height: "2rem" }} />
            <Box flex="1" sx={{ marginLeft: "0.5rem" }}>
                <span>
                    <Typography variant="caption" fontWeight="bolder" sx={{ paddingRight: "0.25rem" }}>{comment.commentedBy}</Typography>
                    <Typography variant="caption">{comment.commentText}</Typography>
                </span>
                <Grid container direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="caption" fontStyle="italic" color={grey[600]}>{commentTimeToDisplay}</Typography>
                    <Typography variant="caption" fontStyle="italic" fontWeight="bolder" color={grey[600]}>{likedBy.length} likes</Typography>
                    <Typography variant="caption" fontStyle="italic" color={grey[600]} sx={{ paddingRight: "2rem" }}>Reply</Typography>
                </Grid>
            </Box>
            <IconButton onClick={handleLikeComment} sx={{ padding: "0", marginLeft: "0.5rem", width: "1rem", height: "1rem" }}>
                {isCommentLiked ? <FavoriteIcon sx={{ color: "red", width: "1rem", height: "1rem" }} /> : <FavoriteBorderIcon sx={{ width: "1rem", height: "1rem" }} />}
            </IconButton>
        </Grid>
    );
}