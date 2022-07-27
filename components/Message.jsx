import { useEffect, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export function Message({ message, scrollIntoViewBool }) {
	const [currentMessage, setCurrentMessage] = useState(message);

	const messageTime = currentMessage.messageTime;
	const messageTimeInDateFormat = new Date(
		messageTime.seconds * 1000 + messageTime.nanoseconds / 1000000
	);
	const messageTimeToDisplay = messageTimeInDateFormat.toLocaleDateString(
		undefined,
		{ year: "numeric", month: "long", day: "numeric" }
	);

	const messageRef = useRef(null);
	useEffect(() => {
		if (!scrollIntoViewBool) return;
		const messageElement = messageRef.current;
		messageElement.scrollIntoView();
	}, [messageRef]);

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

	return (
		<Grid
			container
			direction="column"
			alignItems="flex-end"
			justifyContent="center"
			sx={{ paddingLeft: "8rem" }}
			ref={messageRef}
		>
			<Box
				sx={{
					background: "red",
					padding: "0.5rem",
					borderRadius: "0.5rem",
					maxWidth: "100%",
				}}
			>
				<Typography variant="caption" fontSize="0.9rem">
					{message.messageText}
				</Typography>
			</Box>
			<Box>
				<Typography
					variant="caption"
					fontStyle="italic"
					color={grey[600]}
				>
					{messageTimeToDisplay}
				</Typography>
			</Box>
		</Grid>
	);
}
