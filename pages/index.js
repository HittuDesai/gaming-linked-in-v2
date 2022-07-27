import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { userdata, userid, username } from "../atoms/userAtom";
import { HeaderAndBottomAdder } from "../components/HeaderAndBottomAdder";
import { IndexSection } from "../components/IndexSection";
import { auth, db } from "../firebase";

export default function IndexPage() {
	const setCurrentUserData = useSetRecoilState(userdata);
	const setCurrentUserID = useSetRecoilState(userid);
	const setCurrentUsername = useSetRecoilState(username);

	const router = useRouter();
	useEffect(() => {
		console.log("running");
		onAuthStateChanged(auth, userCredentials => {
			if (!userCredentials) {
				router.push("/");
				return;
			}

			const currentUserID = userCredentials.uid;
			const userDocumentReference = doc(db, `users/${currentUserID}`);
			getDoc(userDocumentReference)
				.then(querySnapshot => {
					const currentUserData = querySnapshot.data();
					setCurrentUserID(currentUserID);
					setCurrentUserData(currentUserData);
					const loggedInUsername = currentUserData.username;
					setCurrentUsername(loggedInUsername);
					router.push(`/${loggedInUsername}`);
				})
				.catch(error => console.log(error));
		});
	}, []);

	return (
		<HeaderAndBottomAdder>
			<IndexSection />
		</HeaderAndBottomAdder>
	);
}
