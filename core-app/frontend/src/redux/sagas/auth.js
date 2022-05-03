import {put, takeLatest} from "redux-saga/effects";
import axios from "axios";
import {
    currentUserReceived,
    GET_CURRENT_USER,
    LOGIN_USER,
    REGISTER_USER,
    userLoginReceived,
    userRegistrationReceived
} from "../actions";
import {showError} from "../../commonUtils";
import Cookies from 'js-cookie'


function* registerUser(action) {
    try {
        const json = yield axios
            .post("/signup", action.payload)
            .then((res) => res.data);
        Cookies.set("x-access-token", json.Items[0].token);
        axios.defaults.headers.common['x-access-token'] = json.Items[0].token;
        yield put(userRegistrationReceived(json));
    } catch (err) {
        showError(err);
        yield put(userRegistrationReceived(err));
    }
}

export function* registerUserSaga() {
    yield takeLatest(REGISTER_USER, registerUser);
}


function* loginUser(action) {
    try {
        const json = yield axios
            .post("/login", action.payload)
            .then((res) => res.data);
        Cookies.set("x-access-token", json.Items[0].token);
        axios.defaults.headers.common['x-access-token'] = json.Items[0].token;
        yield put(userLoginReceived(json));
    } catch (err) {
        showError(err);
        yield put(userLoginReceived(err));
    }
}

export function* loginUserSaga() {
    yield takeLatest(LOGIN_USER, loginUser);
}

function* getCurrentUser(action) {
    try {
        const json = yield axios
            .get("/current-user", action.payload)
            .then((res) => res.data);
        yield put(currentUserReceived(json));
    } catch (err) {
        yield put(currentUserReceived(err));
    }
}

export function* getCurrentUserSaga() {
    yield takeLatest(GET_CURRENT_USER, getCurrentUser);
}
