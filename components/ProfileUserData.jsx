import { Avatar, Badge, Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { userdata } from "../atoms/userAtom";

export function ProfileUserData() {
    const currentUserData = useRecoilValue(userdata);
    const numPosts = currentUserData.numPosts;
    const numFollowers = currentUserData.numFollowers;
    const numFollowing = currentUserData.numFollowing;

    return (
        <Stack sx={{ margin: "1rem" }}>
            <Grid container direction="row" alignItems="center" justifyContent="space-evenly">
                <Box sx={{ height: "5rem", aspectRatio: "1" }}>
                    <Avatar sx={{ width: "100%", height: "100%" }} />
                    {/* src={currentUserData} */}
                </Box>
                <Stack align="center">
                    <Typography fontSize="large">{numPosts}</Typography>
                    <Typography fontSize="small">POSTS</Typography>
                </Stack>
                <Stack align="center">
                    <Typography fontSize="large">{numFollowers}</Typography>
                    <Typography fontSize="small">FOLLOWERS</Typography>
                </Stack>
                <Stack align="center">
                    <Typography fontSize="large">{numFollowing}</Typography>
                    <Typography fontSize="small">FOLLOWING</Typography>
                </Stack>
            </Grid>
            <Button fullWidth variant="contained" sx={{ margin: "1.5rem 0" }}>Edit Profile</Button>
            <Divider><Typography variant="overline">Uploads</Typography></Divider>
        </Stack>
    );
}