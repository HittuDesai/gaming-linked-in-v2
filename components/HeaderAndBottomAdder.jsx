import { useState } from "react";
import { BottomNavBar } from "./BottomNavBar";
import { Header } from "./Header";

export const HeaderAndBottomAdder = ({ children }) => {
	const [dummyHeight, setDummyHeight] = useState(0);
	const dummyHeightSetter = newDummyHeight => setDummyHeight(newDummyHeight);
	return (
		<>
			<Header />
			{children}
			<div style={{ visibility: "hidden", height: dummyHeight }}>
				Dummy Content
			</div>
			<BottomNavBar dummyHeightSetter={dummyHeightSetter} />
		</>
	);
};
