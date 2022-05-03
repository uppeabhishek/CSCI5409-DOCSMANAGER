import {ddbClient} from "../database/index.js";
import {QueryCommand} from "@aws-sdk/client-dynamodb";

const getGroupFiles = async (request, response) => {
    const groupId = request.params.id;

    const queryParams = {
        KeyConditionExpression: "group_id = :id",
        ExpressionAttributeValues: {
            ":id": {S: groupId},
        },
        ProjectionExpression: "file_id,file_key,file_name,file_url",
        TableName: "group_file",
    };

    try {
        const data = await ddbClient.send(new QueryCommand(queryParams));

        if (data.Items.length === 0) {
            return response.status(400).send({data: "No files in the group"});
        }

        return response.send(data.Items);
    } catch (error) {
        return error;
    }
};

export default getGroupFiles;
