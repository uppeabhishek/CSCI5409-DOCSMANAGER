import {useHistory} from "react-router-dom";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {isError} from "../commonUtils";

function Index() {
    const history = useHistory();
    const currentUser = useSelector((state) => state.auth.currentUserData);

    useEffect(() => {
        if (isError(currentUser)) {
            history.push("/login");
        } else {
            history.push("/home");
        }
    }, []);

    return null;
}

export default Index;