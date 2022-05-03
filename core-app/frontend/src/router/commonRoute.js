import {Route, useHistory} from "react-router-dom";
import {isError} from "../commonUtils";
import {useSelector} from "react-redux";

function CommonRoute({path, children}) {
    const currentUser = useSelector((state) => state.auth.currentUserData);
    const history = useHistory();

    if (path !== "/register") {
        if (path !== "/login" && isError(currentUser)) {
            history.push("/login");
            return null;
        }

        if (path === "/login" && !isError(currentUser) && Object.keys(currentUser).length > 0) {
            history.push("/home");
            return null;
        }
    }

    return (
        <Route exact path={path}>
            {children}
        </Route>
    )
}

export default CommonRoute;