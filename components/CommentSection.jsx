import { useEffect, useState } from "react";
import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

import { Stack } from "@mui/material";

import { db } from "../firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";

export function CommentSection({ postID }) {
    const [allComments, setAllComments] = useState([]);
    useEffect(() => {
        let comments = [];
        const postCommentsCollection = collection(db, `/posts/${postID}/comments`);
        getDocs(postCommentsCollection).then(snapshot => {
            const arrayOfComments = snapshot.docs;
            const numberOfComments = arrayOfComments.length;
            for(const commentDocument of  arrayOfComments) {
                const commentDocumentID = commentDocument.id;
                const commentDocumentReference = commentDocument.ref;
                getDoc(commentDocumentReference).then(commentSnapshot => {
                    const commentData = { ...commentSnapshot.data(), commentID: commentDocumentID };
                    comments = [ ...comments, commentData ];
                }).then(() => {
                    if(comments.length === numberOfComments)
                        setAllComments(comments);
                })
            }
        })
    }, [])

    return(
        <Stack sx={{ marginTop: "1rem" }}>
            {allComments.map(comment => <Comment comment={comment} postID={postID} />)}
            <CommentForm postID={postID} />
        </Stack>
    );
}