import { useEffect } from "react";
import { useRouter } from "next/router";

import { ProfileUserData } from "../../components/ProfileUserData";
import { Post } from "../../components/Post";
import { UploadModal } from "../../components/UploadModal";
import { CircularProgress, Grid, Typography } from "@mui/material";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { userdata, username } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

export default function UserProfilePage({ uploadsArray, requestedUserData }) {
    if(!uploadsArray)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <CircularProgress />
                <Typography fontSize="small" variant="overline" sx={{marginTop: "1rem"}}>Signing You In</Typography>
            </Grid>
        );

    const loggedInUsername = useRecoilValue(username);
    const requestedUsername = requestedUserData.username;

    return (
        <>{uploadsArray ? <>
            <Grid container direction="column">
                <ProfileUserData requestedUserData={requestedUserData} />
                {
                    uploadsArray.map((post, index) => {
                        return (
                            <Post key={index} post={post}/>
                        );
                    })
                }
            </Grid>
            <UploadModal />
        </> : 
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
            <CircularProgress />
            <Typography fontSize="small" variant="overline" sx={{marginTop: "1rem"}}>Signing You In</Typography>
        </Grid>
        }</>
    );
}

export async function getServerSideProps(context) {
    const { req, params } = context;
    const { headers } = req;
    const { referer } = headers;
    const { username } = params;

    // if(!referer) {
    //     return {
    //         redirect: {
    //             destination: `/${username}`,
    //             permanent: false,
    //         }
    //     }
    // }

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
        uploadsArray.sort((a, b) => b.time - a.time);
        postData.time = postData.time.toJSON();
        postData.postID = postID;

        let comments = [];
        const postCommentsCollection = collection(db, `/posts/${postID}/comments`);
        const commentsQueryConstraint = orderBy("commentTime");
        const commentsQuery = query(postCommentsCollection, commentsQueryConstraint);
        const allCommentsSnapshot = await getDocs(commentsQuery);
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

    return { props: { uploadsArray, requestedUserData: currentUserData }};
}