import {ddbClient} from "../database/index.js";
import {QueryCommand} from "@aws-sdk/client-dynamodb";

const getGroupAdmin = async (request, response) => {
    const groupId = request.params.id;

    const queryParams = {
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": {S: groupId},
        },
        ProjectionExpression: "admin_user_id",
        TableName: "group",
    };

    try {
        const data = await ddbClient.send(new QueryCommand(queryParams));

        if (data.Items.length === 0) {
            return response.status(400).send({data: "No users in the group"});
        }
        return response.send(data.Items);
    } catch (error) {
        return error;
    }
};

export default getGroupAdmin;
