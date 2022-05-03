import FileUploader from "../utils/fileUploadService.js";

import {readFileUrl} from "../database/group_file.js";

export const viewGroupFileController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.group;

        const fileUrlResponse = await readFileUrl({
            file_id: id,
            group_id: groupId,
        });

        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const key = fileUrlResponse.file_key;
        const fileService = new FileUploader();
        const stream = await fileService.getFileStream(key);
        stream.pipe(res);
    } catch (err) {
        res.status(500).send("Error!");
    }
};

export const downloadGroupFileController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.group;

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
        const fileService = new FileUploader();
        const stream = await fileService.getFileStream(key);
        res.set("Content-Disposition", `attachment; filename="${fileUrlResponse.file_name}"`);
        stream.pipe(res);
    } catch (err) {
        res.status(500).send("Error!");
    }
};

export const getGroupFileURLController = async (req, res) => {
    try {
        const id = req.params.id;
        const groupId = req.params.group;

        const fileUrlResponse = await readFileUrl({
            file_id: id,
            group_id: groupId,
        });

        if (!fileUrlResponse || !fileUrlResponse.file_key) {
            res.status(404).send("Not found");
        }

        const url = fileUrlResponse.file_url;
        return res.status(200).json({message: url, success: true});
    } catch (err) {
        res.status(500).send("Error!");
    }
};
