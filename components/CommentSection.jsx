import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

import { Stack } from "@mui/material";

export function CommentSection({ postID, comments }) {
    console.log(comments);
    return(
        <Stack sx={{ marginTop: "1rem" }}>
            {comments.map(comment => <Comment comment={comment} postID={postID} />)}
            <CommentForm postID={postID} />
        </Stack>
    );
}