import { AppBar, Button, Grid, Typography } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import { wantsToSigninBool, wantsToSignupBool } from '../atoms/loginAtom';
import { userid } from '../atoms/userAtom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { getAuth, signOut } from 'firebase/auth';

export function Header() {
    const [wantsToSignin, setWantsToSignin] = useRecoilState(wantsToSigninBool)
    const [wantsToSignup, setWantsToSignup] = useRecoilState(wantsToSignupBool)
    const currentUserID = useRecoilValue(userid);

    const HeaderWithoutSession = () => (
        <AppBar>
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
                    <Button variant="outlined" onClick={() => setWantsToSignup(true)}>
                        Sign Up
                    </Button>
                </div>}
            </Grid>
        </AppBar>
    );

    const handleSignOut = () => {
        setWantsToLogin(false);

        const auth = getAuth();
        signOut(auth).then(() => {
            console.log("SIGNED OUT");
        })
    }

    const WithSessionRight = () => (
        <Group>
            <ActionIcon onClick={() => setShowUserProfile(!showUserProfile)}>
                <CgProfile color='white'/>
            </ActionIcon>
            <ActionIcon onClick={handleSignOut}>
                <GoSignIn color='white'/>
            </ActionIcon>
        </Group>
    );

    const HeaderWithSession = () => (
        <Header height={50}>
            <Group position='center' p={5} mr='1rem' ml='1rem'>
                <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                    <Group position='apart' style={{width: "100%"}}>
                        <Burger
                        opened={hamburgerClicked}
                        onClick={() => setHamburgerClicked(hamburgerClicked => !hamburgerClicked)}
                        />
                        <WithSessionRight />
                    </Group>
                </MediaQuery>
                <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                    <Group position='apart' style={{width: "100%"}}>
                        <Group><AnchorTags /></Group>
                        <WithSessionRight />
                    </Group>
                </MediaQuery>
            </Group>
        </Header>
    );

    return (
        <>
        { !currentUserID ? <HeaderWithoutSession /> : <HeaderWithSession />}
        </>
    );
}