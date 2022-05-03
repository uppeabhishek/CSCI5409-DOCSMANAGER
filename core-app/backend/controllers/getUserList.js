import {ddbClient} from "../database/index.js";
import {ScanCommand} from "@aws-sdk/client-dynamodb";

const getUsers = async (request, response) => {
    const params = {
        TableName: "user",
    };

    try {
        const command = new ScanCommand(params);
        const data = await ddbClient.send(command);
        return response.send(data.Items);
    } catch (error) {
        return error;
    }
};

export default getUsers;
