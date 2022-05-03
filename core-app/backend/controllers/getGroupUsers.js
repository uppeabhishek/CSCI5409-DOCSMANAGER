import {ddbClient} from "../database/index.js";
import {QueryCommand} from "@aws-sdk/client-dynamodb";

const getGroupUsers = async (request, response) => {
    const groupId = request.params.id;

    const params = {
        TableName: "group",
    };

    const queryParams = {
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": {S: groupId},
        },
        ProjectionExpression: "user_id, user_name",
        TableName: "group",
    };

    try {
        const data = await ddbClient.send(new QueryCommand(queryParams));

        if (data.Items.length === 0) {
            return response.status(400).send({data: "No users in the group"});
        }

        const users = [];
        for (let i = 0; i < data.Items.length; i++) {
            let userIdArray = data.Items[0].user_id.S.split(",");
            let userNameArray = data.Items[0].user_name.S.split(",");
            for (let j = 0; j < userIdArray.length; j++) {
                users[j] = {user_id: userIdArray[j], user_name: userNameArray[j]};
            }
        }
        return response.send(users);
    } catch (error) {
        return error;
    }
};

export default getGroupUsers;
