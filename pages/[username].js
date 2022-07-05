import { useRecoilValue } from "recoil";
import { username } from "../atoms/userAtom";

export default function UserHomePage() {
    const currentUsername = useRecoilValue(username);
  return (
    <>{currentUsername}</>
  );
}

export function getServerSideProps(context) {
    const { params } = context;
    const { username } = params;
    return {
        props: {
            username,
        },
    };
}