import { CommentForm } from "./CommentForm";

export function CommentSection({ postID }) {

    return(
        <>
            <CommentForm postID={postID} />
        </>
    );
}