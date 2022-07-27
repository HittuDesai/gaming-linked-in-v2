import { BottomNavBar } from "./BottomNavBar";
import { Header } from "./Header";

export const HeaderAndBottomAdder = ({ children }) => {
	return (
		<>
			<Header />
			{children}
			<BottomNavBar />
		</>
	);
};
