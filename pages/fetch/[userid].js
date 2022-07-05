import { CircularProgress, Grid, Typography } from "@mui/material";
import ErrorIcon from '@mui/icons-material/Error';

import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userdata, userid, username } from "../../atoms/userAtom";
import { db } from "../../firebase";
import { useEffect } from "react";

export default function DataFetchingPage({ userFound, currentUserData }) {
    if(!userFound)
        return (
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
                <ErrorIcon fontSize="large" sx={{ color: "red" }}/>
                <Typography fontSize="small" variant="overline" color="red" sx={{marginTop: "1rem"}}>Error in fetching data</Typography>
                <Typography fontSize="small" variant="overline" color="red">Please trying signing in again</Typography>
            </Grid>    
        );

    const router = useRouter();
    const setCurrentUserData = useSetRecoilState(userdata);
    const setCurrentUserID = useSetRecoilState(userid);
    const setCurrentUsername = useSetRecoilState(username);

    useEffect(() => {
      if(currentUserData) {
        setCurrentUserData(currentUserData);
        setCurrentUserID(currentUserData.uid);
        const currentUsername = currentUserData.username;
        setCurrentUsername(currentUsername);
        router.replace(`/${currentUsername}`);
      }
    }, [currentUserData])
    

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" sx={{width: "100vw", height: "100vh"}}>
            <CircularProgress />
            <Typography fontSize="small" variant="overline" sx={{marginTop: "1rem"}}>Signing You In</Typography>
        </Grid>
    );
}
  
export async function getServerSideProps(context) {
    const { query } = context;
    const { userid } = query;

    const userDocumentReference = doc(db, `users/${userid}`);
    const querySnapshot = await getDoc(userDocumentReference);
    const currentUserData = querySnapshot.data();

    if(currentUserData)
        return {
            props: {
                userFound: true,
                currentUserData,
            },
        };
    return {
        props: {
            userFound: false,
        }
    }
}