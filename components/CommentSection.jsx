import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";

import { Stack } from "@mui/material";

export function CommentSection({ postID, comments }) {
    comments.sort((a, b) => b.commentTime - a.commentTime);

    return(
        <Stack sx={{ marginTop: "1rem" }}>
            {comments.map(comment => <Comment key={comment.commentID} comment={comment} postID={postID} />)}
            <CommentForm postID={postID} />
        </Stack>
    );
}