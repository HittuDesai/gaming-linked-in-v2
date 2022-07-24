import { useState } from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";

import { useRecoilValue } from "recoil";
import { userid } from "../atoms/userAtom";
import { grey } from "@mui/material/colors";

export function Message({ message }) {
    const [currentMessage, setCurrentMessage] = useState(comment);
    const currentUserID = useRecoilValue(userid);

    const messageTime = comment.messageTime;
    const messageTimeInDateFormat = new Date(messageTime.seconds * 1000 + messageTime.nanoseconds / 1000000);
    const messageTimeToDisplay = messageTimeInDateFormat.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric", });

    // const likedBy = currentMessage.likedBy;
    // const [isCommentLiked, setIsCommentLiked] = useState(likedBy?.includes(currentUserID));

    // const handleLikeComment = () => {
    //     const commentID = currentMessage.commentID;
    //     const commentDocumentReference = doc(db, `posts/${postID}/comments/${commentID}`);

    //     if(isCommentLiked) {
    //         setIsCommentLiked(false);
    //         const newLikedBy = likedBy.filter( userID => userID !== currentUserID);
    //         setCurrentMessage({ ...comment, likedBy: newLikedBy });
    //         updateDoc(commentDocumentReference, "likedBy", newLikedBy);
    //     }
    //     else {
    //         setIsCommentLiked(true);
    //         const newLikedBy = [...likedBy, currentUserID];
    //         setCurrentMessage({ ...comment, likedBy: newLikedBy });
    //         updateDoc(commentDocumentReference, "likedBy", newLikedBy);
    //     }
    // }

    return(
        <Box sx={{ width: "100%" }}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
                <Avatar sx={{ width: "2rem", height: "2rem" }} />
                <Box flex="1" sx={{ marginLeft: "0.5rem" }}>
                    <span>
                        <Typography variant="caption" fontWeight="bolder" sx={{ paddingRight: "0.25rem" }}>{comment.commentedBy}</Typography>
                        <Typography variant="caption">{message.messageText}</Typography>
                    </span>
                    <Grid container direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" fontStyle="italic" color={grey[600]}>{messageTimeToDisplay}</Typography>
                        <Typography variant="caption" fontStyle="italic" fontWeight="bolder" color={grey[600]}>{likedBy.length} likes</Typography>
                        <Typography variant="caption" fontStyle="italic" color={grey[600]} sx={{ paddingRight: "2rem" }}>Reply</Typography>
                    </Grid>
                </Box>
            </Grid>
        </Box>
    );
}