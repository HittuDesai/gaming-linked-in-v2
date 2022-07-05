import { useEffect } from "react";

import { useSetRecoilState } from "recoil";
import { userdata, userid, username } from "../../atoms/userAtom";

import { db } from "../../firebase"
import { collection, getDocs, query, where } from "firebase/firestore";
import { Grid, Typography } from "@mui/material";

import { Feed } from "../../components/Feed"
import { redirect } from "next/dist/server/api-utils";

export default function UserHomePage({ referer }) {
    console.log(referer);
    return (
        <></>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;
    const { headers } = req;
    const { referer } = headers;

    const { params } = context;
    const { username } = params;

    if(!referer) {
        return {
            redirect: {
                destination: `/${username}`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            referer,
        }
    }
}