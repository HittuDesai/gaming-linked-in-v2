import { ProfileUserData } from "../../components/ProfileUserData";
import { Post } from "../../components/Post";
import { Grid, Typography } from "@mui/material";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { userdata, username, useruploads } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export default function UserHomePage({ uploadsArray }) {
    const setUploadsArray = useSetRecoilState(useruploads);
    setUploadsArray(uploadsArray);
    const currentUserData = useRecoilValue(userdata);
    const currentUsername = useRecoilValue(username);

    return (
        <Grid container direction="column">
            <ProfileUserData />
            {
                uploadsArray.map((post, index) => {
                    return (
                        <Post key={index} post={post}/>
                    );
                })
            }
        </Grid>
    );
}

export async function getServerSideProps(context) {
    const { req, params } = context;
    const { headers } = req;
    const { referer } = headers;
    const { username } = params;

    if(!referer) {
        return {
            redirect: {
                destination: `/${username}`,
                permanent: false,
            }
        }
    }

    let uploadsArray = [];
    const usersCollectionReference = collection(db, "users");
    const usernameQuery = query(usersCollectionReference, where("username", "==", username));
    const querySnapshot = await getDocs(usernameQuery);
    const currentUserData = querySnapshot.docs[0].data();
    const postIDs = currentUserData.uploads;
    
    for(const postID of postIDs) {
        const postReference = doc(db, `posts/${postID}`);
        const snapshot = await getDoc(postReference);
        const postData = snapshot.data();
        postData.time = postData.time.toJSON();
        postData.postID = postID;

        let comments = [];
        const postCommentsCollection = collection(db, `/posts/${postID}/comments`);
        const allCommentsSnapshot = await getDocs(postCommentsCollection);
        const arrayOfComments = allCommentsSnapshot.docs;
        for(const commentDocument of arrayOfComments) {
            const commentDocumentID = commentDocument.id;
            const commentDocumentReference = commentDocument.ref;
            const commentSnapshot = await getDoc(commentDocumentReference);
            const commentData = commentSnapshot.data();
            commentData.commentID = commentDocumentID;
            commentData.commentTime = commentData.commentTime.toJSON();
            comments.push(commentData);
        }
        postData.comments = comments;

        uploadsArray.push(postData);
    }

    return { props: { uploadsArray }};
}