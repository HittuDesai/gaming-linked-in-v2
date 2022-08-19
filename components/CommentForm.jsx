import { useState } from "react";
import { Input, InputAdornment } from "@mui/material";
import { grey } from "@mui/material/colors";

import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { username } from "../atoms/userAtom";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";

export function CommentForm({ postID, rerenderComments }) {
	const router = useRouter();
	const [commentText, setCommentText] = useState("");
	const [isPostingComment, setIsPostingComment] = useState(false);
	const currentUsername = useRecoilValue(username);

	const handlePostComment = () => {
		setIsPostingComment(true);
		const postCommentsCollectionReference = collection(
			db,
			`/posts/${postID}/comments`
		);
		const commentTime = serverTimestamp();
		addDoc(postCommentsCollectionReference, {
			commenterDP: "",
			commentedBy: currentUsername,
			commentText,
			commentTime,
			likedBy: [],
		})
			.then(() => {
				setIsPostingComment(false);
				setCommentText("");
				// router.push(router.asPath);
				rerenderComments();
			})
			.catch(error => console.log(error));
	};

	const PostButton = () => (
		<InputAdornment position="end">
			<LoadingButton
				loading={isPostingComment}
				sx={{
					margin: 0,
					padding: 0,
					borderRadius: "1rem",
					minWidth: 0,
				}}
				onClick={handlePostComment}
			>
				Post
			</LoadingButton>
		</InputAdornment>
	);

	return (
		<Input
			fullWidth
			multiline
			disableUnderline
			type="text"
			value={commentText}
			onChange={event => setCommentText(event.target.value)}
			endAdornment={<PostButton />}
			sx={{
				border: `2px solid ${grey[700]}`,
				borderRadius: "3rem",
				padding: "0.5rem 1rem",
				marginTop: "0.25rem",
				minWidth: 0,
			}}
			placeholder="Write a comment"
		/>
	);
}
