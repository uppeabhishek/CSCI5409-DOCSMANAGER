import {rootReducer} from "./reducers";
import {applyMiddleware, createStore} from "redux";
import createSagaMiddleware from "redux-saga";
import {createLogger} from "redux-logger";
import saga from "./sagas";
import {composeWithDevTools} from "redux-devtools-extension";

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
    collapsed: true,
    duration: true,
    predicate: () => process.env.NODE_ENV === "development"
});

export const store = createStore(
    rootReducer,
    {},
    composeWithDevTools(
        applyMiddleware(sagaMiddleware),
        applyMiddleware(logger)
    )
);

sagaMiddleware.run(saga);
