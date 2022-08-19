import { useEffect, useState } from "react";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

import { Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import { db } from "../firebase";
import {
	collection,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";

export function CommentSection({ postID }) {
	const [comments, setComments] = useState([]);
	const [rerenderDummyValue, setRerenderDummyValue] = useState(0);
	const rerenderComments = () => {
		setRerenderDummyValue(previousValue => previousValue + 1);
	};
	useEffect(() => {
		let commentsArray = [];
		const postCommentsCollection = collection(
			db,
			`/posts/${postID}/comments`
		);
		const commentsQueryConstraint = orderBy("commentTime");
		const commentsQuery = query(
			postCommentsCollection,
			commentsQueryConstraint
		);
		getDocs(commentsQuery)
			.then(allCommentsSnapshot => {
				const arrayOfComments = allCommentsSnapshot.docs;
				for (const commentSnapshot of arrayOfComments) {
					const commentDocumentID = commentSnapshot.id;
					const commentData = commentSnapshot.data();
					commentData.commentID = commentDocumentID;
					commentData.commentTime = commentData.commentTime.toJSON();
					commentsArray.push(commentData);
				}
				commentsArray.sort((a, b) => b.commentTime - a.commentTime);
			})
			.then(() => setComments(commentsArray));
	}, [rerenderDummyValue]);

	return (
		<Stack
			sx={{ marginTop: "1rem", overflow: "hidden", overflowY: "scroll" }}
		>
			{comments.length === 0 && (
				<Typography
					variant="caption"
					fontStyle="italic"
					color={grey[600]}
					sx={{ paddingRight: "2rem" }}
				>
					No comments yet
				</Typography>
			)}
			{comments.map(comment => (
				<Comment
					key={comment.commentID}
					comment={comment}
					postID={postID}
				/>
			))}
			<CommentForm postID={postID} rerenderComments={rerenderComments} />
		</Stack>
	);
}
