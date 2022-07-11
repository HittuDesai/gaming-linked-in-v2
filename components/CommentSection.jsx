import { Comment } from "./Comment";
import { CommentForm } from "./CommentForm";
import { Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

export function CommentSection({ postID, comments }) {
    comments.sort((a, b) => b.commentTime - a.commentTime);

    return(
        <Stack sx={{ marginTop: "1rem", overflow: "hidden", overflowY: "scroll" }}>
            {comments.length === 0 && <Typography variant="caption" fontStyle="italic" color={grey[600]} sx={{ paddingRight: "2rem" }}>No comments yet</Typography>}
            {comments.map(comment => <Comment key={comment.commentID} comment={comment} postID={postID} />)}
            <CommentForm postID={postID} />
        </Stack>
    );
}