import {v4} from "uuid";

import FileUploader from "../utils/fileUploadService.js";

import {addGroupFile, readFileUrl, readGroupFiles} from "../database/group_file.js";
import {analyzeFile} from "../services/textract.js";
import {translateFile} from "../services/translate.js";

export const listFilesController = async (req, res) => {
    const {groupId} = req.body;

    if (!groupId) {
        return res.status(500).send("groupId not provided.");
    }

    const allFiles = await readGroupFiles(groupId);

    const filesFormatted = allFiles.map((file) => {
        return {
            id: file.file_id,
            fileName: file.file_name,
        };
    });

    res.status(200).send(filesFormatted);
};

export const addFileController = async (req, res) => {
    try {
        // get form data from request
        const file = req.files.file;
        const name = file.name;
        const body = file.data;
        const contentType = file.mimetype;
        let groupId;

        if (req.body.groupId) {
            groupId = req.body.groupId;
        }

        // upload the file and get uploaded file name
        const uploader = new FileUploader();
        const {url, key} = await uploader.createFileOnS3(name, body, contentType);

        // generate a unique id
        const id = v4();

        // change for inserting into db
        const fileRecord = {
            file_id: id,
            file_name: name,
            file_url: url,
            file_key: key,
            group_id: groupId,
            permission: true,
        };

        await addGroupFile(fileRecord);
        res.status(200).send(fileRecord);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error, please try again.");
    }
};

export const viewFileController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.groupId;

        const fileUrlResponse = await readFileUrl({
            file_id: id,
            group_id: groupId,
        });

        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const key = fileUrlResponse.file_key;
        console.log(key);
        const fileService = new FileUploader();
        const stream = await fileService.getFileStream(key);
        stream.pipe(res);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error!");
    }
};

export const downloadFileController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.groupId;

        const fileUrlResponse = await readFileUrl(
            {
                file_id: id,
                group_id: groupId,
            },
            true
        );

        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const key = fileUrlResponse.file_key;
        console.log(key);
        const fileService = new FileUploader();
        const stream = await fileService.getFileStream(key);
        res.set("Content-Disposition", `attachment; filename="${fileUrlResponse.file_name}"`);
        stream.pipe(res);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error!");
    }
};

export const analyzeFileWithTextractController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.groupId;

        const fileUrlResponse = await readFileUrl(
            {
                file_id: id,
                group_id: groupId,
            },
            true
        );

        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const key = fileUrlResponse.file_key;

        const blocks = await analyzeFile(key);

        const blockLines = blocks.filter(({BlockType}) => BlockType === "LINE").map((block) => {
            return {
                text: block.Text
            }
        });

        const blockWords = blocks.filter(({BlockType}) => BlockType === "WORD").map((block) => {
            return {
                text: block.Text
            }
        });

        return res.status(200).send({
            words: blockWords,
            lines: blockLines
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
}

export const translateFileController = async (req, res) => {
    try {
        const {id, groupId} = req.params;
        const {targetLanguageCode} = req.body;

        if (!id) {
            res.status(500).send("`fileId` is missing.");
        } else if (!targetLanguageCode) {
            res.status(500).send("`targetLanguageCode is missing.");
        }


        const fileUrlResponse = await readFileUrl(
            {
                file_id: id,
                group_id: groupId,
            },
            true
        );


        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const key = fileUrlResponse.file_key;

        const blocks = await analyzeFile(key);

        if (!blocks) {
            return res.status(500).send("error");
        }
        const blockLines = blocks.filter(({BlockType}) => BlockType === "LINE").map((block) => {
            return {
                text: block.Text
            }
        });

        const translatedData = await translateFile(blockLines, targetLanguageCode);

        res.status(200).send(translatedData);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
}