import {ddbClient} from "../database/index.js";
import {UpdateItemCommand} from "@aws-sdk/client-dynamodb";
//import getGroupFiles from "../controllers/getGroupFiles";

const updateGroupUsers = async (request, response) => {
    const groupId = request.params.id;
    let updatedUserIds = "";
    let updatedUserNames = "";

    for (let i = 0; i < request.body.updatedUsers.length; i++) {
        updatedUserIds += request.body.updatedUsers[i].user_id;
        updatedUserNames += request.body.updatedUsers[i].user_name;
        updatedUserIds += ",";
        updatedUserNames += ",";
    }
    updatedUserIds = updatedUserIds.substring(0, updatedUserIds.length - 1);
    updatedUserNames = updatedUserNames.substring(0, updatedUserNames.length - 1);


    const params = {
        TableName: "group",
        Key: {
            id: {S: groupId},
        },
        UpdateExpression: "SET user_id = :newusers, user_name = :newusernames",
        ExpressionAttributeValues: {
            ":newusers": {S: updatedUserIds},
            ":newusernames": {S: updatedUserNames},
        },
    };

    try {
        const command = new UpdateItemCommand(params);
        const data = await ddbClient.send(command);
        return response.send(data.Items);
    } catch (error) {
        return error;
    }
};

export default updateGroupUsers;
