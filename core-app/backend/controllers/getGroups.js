import {ddbClient} from "../database/index.js";
import {ScanCommand} from "@aws-sdk/client-dynamodb";
//import getGroupFiles from "../controllers/getGroupFiles";

const getGroups = async (request, response) => {
    const currentUserId = request.body.currentUserId;
    const params = {
        FilterExpression: "contains (user_id, :id)",
        ExpressionAttributeValues: {
            ":id": {S: currentUserId},
        },
        TableName: "group",
    };

    try {
        const command = new ScanCommand(params);
        const data = await ddbClient.send(command);
        if (data.Items.length === 0) {
            return response.status(400).send({data: "You have no groups"});
        }
        return response.send(data.Items);
    } catch (error) {
        return error;
    }
};

export default getGroups;
