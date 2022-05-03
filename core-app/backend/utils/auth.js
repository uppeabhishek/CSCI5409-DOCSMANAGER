// referred https://nodejs.org/api/crypto.html
import * as crypto from "crypto";

const algorithm = "sha512";
const iterations = 1000;
const keyLength = 64;

export const getHashedPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    return {salt, hash: crypto.pbkdf2Sync(password, salt, iterations, keyLength, algorithm).toString(`hex`)};
}

export const isValidPassword = (password, hash, salt) => {
    return crypto.pbkdf2Sync(password, salt, iterations, keyLength, algorithm).toString(`hex`) === hash
}

// add to .env
export const SECRET_KEY = "2324902059381580";