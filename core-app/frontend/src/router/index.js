import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "../components/auth/login";
import Register from "../components/auth/register";
import FileModule from "../components/FileModule/FileModule";
import CreateGroup from "../components/group/creategroup";
import HomePage from "../components/group/homepage";
import ViewGroup from "../components/group/viewgroup";
import AddMember from "../components/group/addmember";
import RemoveMember from "../components/group/removemember";
import FileAnalyze from "../components/FileModule/FileAnalyze";
import FileTranslate from "../components/FileModule/FileTranslate";
import Index from "../components/index";
import CommonRoute from "./commonRoute";

function AppRouter() {
    return (
        <Router>
            <Switch>
                <CommonRoute path={"/login"}>
                    <Login/>
                </CommonRoute>
                <CommonRoute exact path={"/register"}>
                    <Register/>
                </CommonRoute>
                <CommonRoute exact path={"/files"}>
                    <FileModule/>
                </CommonRoute>
                <CommonRoute exact path="/analyze/:groupId/:fileId">
                    <FileAnalyze/>
                </CommonRoute>
                <CommonRoute exact path="/translate/:groupId/:fileId">
                    <FileTranslate/>
                </CommonRoute>
                <CommonRoute exact path="/creategroup">
                    <CreateGroup/>
                </CommonRoute>
                <CommonRoute exact path="/home">
                    <HomePage/>
                </CommonRoute>
                <CommonRoute exact path="/viewgroup/:id">
                    <ViewGroup/>
                </CommonRoute>
                <CommonRoute exact path="/addmember/:id">
                    <AddMember/>
                </CommonRoute>
                <CommonRoute exact path="/removemember/:id">
                    <RemoveMember/>
                </CommonRoute>
                <CommonRoute exact path={"/"}>
                    <Index/>
                </CommonRoute>
            </Switch>
        </Router>
    );
}

export default AppRouter;
