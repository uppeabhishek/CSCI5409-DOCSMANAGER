import jwt from "jsonwebtoken"
import {SECRET_KEY} from "../utils/auth.js";

export const validateToken = (request, response, next) => {
    const token = request.headers["x-access-token"];

    if (!token) {
        return response.status(403).send({data: "token missing"});
    }
    try {
        request.user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return response.status(401).send({data: "Invalid Token"});
    }
    return next();
};
