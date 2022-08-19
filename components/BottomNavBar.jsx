import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import HomeIcon from "@mui/icons-material/Home";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { useRecoilValue } from "recoil";
import { userdata } from "../atoms/userAtom";

export function BottomNavBar({ dummyHeightSetter }) {
	const router = useRouter();
	const routerPath = router.asPath;
	const pathParts = routerPath.split("/");

	const loggedInUserData = useRecoilValue(userdata);
	const loggedInUsername = loggedInUserData?.username;

	const bottomBarRef = useRef(null);
	const [bottomBarValue, setBottomBarValue] = useState("feed");
	useEffect(() => {
		const requestedUsername = router?.query?.username;
		if (requestedUsername !== loggedInUsername) {
			setBottomBarValue("none");
			return;
		}
		const currentAsPath = router.asPath;
		const asPathArray = currentAsPath.split("/");
		const pathEndsWith = asPathArray[asPathArray.length - 1];
		setBottomBarValue(pathEndsWith);

		dummyHeightSetter(bottomBarRef?.current?.clientHeight);
	}, [router, bottomBarRef]);

	const handleBottomBarChange = (event, newValue) => {
		setBottomBarValue(newValue);
		switch (newValue) {
			case "upload":
				router.push(`/${loggedInUsername}/upload`);
				break;

			case "explore":
				router.push(`/${loggedInUsername}/explore`);
				break;

			case "feed":
				router.push(`/${loggedInUsername}`);
				break;

			case "chats":
				router.push(`/${loggedInUsername}/chats`);
				break;

			case "profile":
				router.push(`/${loggedInUsername}/profile`);
				break;

			default:
				break;
		}
	};

	if (pathParts.includes("chats") && pathParts.length === 4) return <></>;
	return (
		<>
			{loggedInUserData && (
				<Paper
					sx={{
						position: "fixed",
						bottom: 0,
						left: 0,
						right: 0,
						padding: "0.5rem 2rem",
					}}
					elevation={0}
					ref={bottomBarRef}
				>
					<BottomNavigation
						value={bottomBarValue}
						onChange={handleBottomBarChange}
					>
						<BottomNavigationAction
							value="upload"
							icon={<AddBoxRoundedIcon />}
						/>
						<BottomNavigationAction
							value="explore"
							icon={<PeopleAltIcon />}
						/>
						<BottomNavigationAction
							value="feed"
							icon={<HomeIcon />}
						/>
						<BottomNavigationAction
							value="chats"
							icon={<QuestionAnswerIcon />}
						/>
						<BottomNavigationAction
							value="profile"
							icon={<AccountCircleRoundedIcon />}
						/>
					</BottomNavigation>
				</Paper>
			)}
		</>
	);
}
