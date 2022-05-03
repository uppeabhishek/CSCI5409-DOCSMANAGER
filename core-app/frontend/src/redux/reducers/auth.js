import {
    LOGIN_USER,
    REGISTER_USER,
    USER_LOGIN_RECEIVED,
    USER_REGISTRATION_RECEIVED,
    GET_CURRENT_USER,
    CURRENT_USER_RECEIVED
} from "../actions";


const initialState = {
    isUserRegistrationDone: false,
    userRegistrationData: {},
    isUserLoginDone: false,
    userLoginData: {},
    isCurrentUserDone: true,
    currentUserData: {}
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_USER:
            return {
                ...state,
                isUserRegistrationDone: false,
            }
        case USER_REGISTRATION_RECEIVED: {
            return {
                ...state,
                isUserRegistrationDone: true,
                userRegistrationData: action.response,
            }
        }
        case LOGIN_USER:
            return {
                ...state,
                isUserLoginDone: false
            }
        case USER_LOGIN_RECEIVED: {
            return {
                ...state,
                isUserLoginDone: true,
                userLoginData: action.response
            }
        }
        case GET_CURRENT_USER: {
            return {
                ...state,
                isCurrentUserDone: false
            }
        }
        case CURRENT_USER_RECEIVED: {
            return {
                ...state,
                isCurrentUserDone: true,
                currentUserData: action.response
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

export default auth;