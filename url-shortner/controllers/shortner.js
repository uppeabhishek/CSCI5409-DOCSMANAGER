import {createEntry, generateId} from "../database/shortner.js";

export const shortner = async (req, res) => {
    const origUrl = req.body.url;

    const shortId = generateId(7);

    const shortendUrl = `http://${req.get('host')}/${shortId}`;

    createEntry(origUrl, shortId, shortendUrl);

    return res.send(shortendUrl);
};
