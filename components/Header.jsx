import { useEffect } from 'react';
import { AppBar, Button, Grid, IconButton } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userdata, userid, username, wantsToSeeProfileBool } from '../atoms/userAtom';
import { wantsToUploadBool } from "../atoms/actionsAtom";

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase'
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import { doc, getDoc } from 'firebase/firestore';

export function Header() {
    const router = useRouter();
    const setCurrentUserData = useSetRecoilState(userdata);
    const setWantsToUpload = useSetRecoilState(wantsToUploadBool);
    const [currentUserID, setCurrentUserID] = useRecoilState(userid);
    const [currentUsername, setCurrentUsername] = useRecoilState(username);
    const [wantsToSeeProfile, setWantsToSeeProfile] = useRecoilState(wantsToSeeProfileBool);
    const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool);
    const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool);

    useEffect(() => {
        router.push(`/${currentUsername}`);
    }, [currentUsername]);

    onAuthStateChanged(auth, userCredentials => {
        if(!userCredentials) {
            setCurrentUserID(null);
            router.push("/");
            return;
        }

        const currentUserID = userCredentials.uid;
        const userDocumentReference = doc(db, `users/${currentUserID}`);
        getDoc(userDocumentReference).then(querySnapshot => {
            const currentUserData = querySnapshot.data();
            setCurrentUserID(currentUserID);
            setCurrentUserData(currentUserData);
            const loggedInUsername = currentUserData.username;
            setCurrentUsername(loggedInUsername);
        })
        .catch(error => console.log(error));
    });

    const HeaderWithoutSession = () => (
        <AppBar position="static" sx={{marginBottom: "1rem"}}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between" padding="1rem">
                <SportsEsportsIcon />
                {(wantsToSignin || wantsToSignup) ? 
                <Button variant="text" onClick={() => {setWantsToSignin(false);setWantsToSignup(false)}}>
                    Cancel
                </Button> : 
                <div>
                    <Button variant="text" onClick={() => setWantsToSignin(true)}>
                        Sign In
                    </Button>
                    <Button variant="contained" onClick={() => setWantsToSignup(true)}>
                        Sign Up
                    </Button>
                </div>}
            </Grid>
        </AppBar>
    );

    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.push("/");
        })
    }

    const currentAsPath = router.asPath;
    const individualPaths = currentAsPath.split('/');
    const isSeeingFeed = individualPaths.pop() === "feed"

    const WithSessionRight = () => (
        <Box>
            <Grid container direction="row" alignItems="center" justifyContent="center">
                <IconButton onClick={() => setWantsToUpload(true)}>
                    <AddBoxRoundedIcon />
                </IconButton>
                {wantsToSeeProfile ? 
                    <IconButton onClick={handleSignOut}>
                        <LogoutIcon />
                    </IconButton> :
                    <>{
                        isSeeingFeed ?
                        <IconButton onClick={() => {
                            router.push(`/${currentUsername}/explore`);
                        }}>
                            <PeopleAltIcon />
                        </IconButton> :
                        <IconButton onClick={() => {
                            router.push(`/${currentUsername}`);
                        }}>
                            <HomeIcon />
                        </IconButton>
                    }</>
                }
                {wantsToSeeProfile ? 
                    <IconButton onClick={() => {
                        setWantsToSeeProfile(false);
                        router.push(`/${currentUsername}/feed`);
                    }}>
                        <HomeIcon />
                    </IconButton> :
                    <IconButton onClick={() => {
                        setWantsToSeeProfile(true);
                        router.push(`/${currentUsername}/profile`);
                    }}>
                        <AccountCircleRoundedIcon />
                    </IconButton>
                }
            </Grid>
        </Box>
    );

    const HeaderWithSession = () => (
        <AppBar position="static" sx={{marginBottom: "1rem"}}>
            <Grid container direction="row" alignItems="center" justifyContent="space-between" padding="1rem">
                <SportsEsportsIcon />
                <WithSessionRight />
            </Grid>
        </AppBar>
    );

    return (
        <>{ currentUserID ? <HeaderWithSession /> : <HeaderWithoutSession />}</>
    );
}