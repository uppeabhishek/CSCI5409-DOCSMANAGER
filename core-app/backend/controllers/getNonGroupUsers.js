import {ddbClient} from "../database/index.js";
import {QueryCommand, ScanCommand} from "@aws-sdk/client-dynamodb";

const getNonGroupUsers = async (request, response) => {
    const groupId = request.params.id;

    const queryParams = {
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": {S: groupId},
        },
        ProjectionExpression: "user_id",
        TableName: "group",
    };

    try {
        const data = await ddbClient.send(new QueryCommand(queryParams));

        if (data.Items.length === 0) {
            return response.status(400).send({data: "No users in the group"});
        }
        const users = [];
        let userIdArray = [];
        for (let i = 0; i < data.Items.length; i++) {
            userIdArray = data.Items[0].user_id.S.split(",");
            for (let j = 0; j < userIdArray.length; j++) {
                users[j] = {user_id: userIdArray[j]};
            }
        }

        const userParams = {
            TableName: "user",
        };

        const command = new ScanCommand(userParams);
        const dataUsers = await ddbClient.send(command);

        const allUsers = [];
        const allUsers2 = [];

        for (let i = 0; i < dataUsers.Items.length; i++) {
            //console.log("U: ", dataUsers.Items[i].id.S);
            allUsers[i] = dataUsers.Items[i].id.S;
            allUsers2[i] = {id: dataUsers.Items[i].id.S, email: dataUsers.Items[i].email.S};
            //console.log("GU: ", users[i].user_id);
        }

        console.log("AU: ", allUsers);
        console.log("GU: ", userIdArray);
        const filteredUsers = allUsers.filter((n) => !userIdArray.includes(n));
        let queryUserParams;
        let outputUsers = [];

        for (let i = 0; i < filteredUsers.length; i++) {
            console.log("hanji:", filteredUsers[i]);
            let email;
            let id = filteredUsers[i];
            for (let j = 0; j < allUsers2.length; j++) {
                if (allUsers2[j].id === filteredUsers[i]) {
                    email = allUsers2[j].email;
                }
            }
            queryUserParams = {
                KeyConditionExpression: "email= :e",
                ExpressionAttributeValues: {
                    //   ":id": { S: id },
                    ":e": {S: email},
                },
                ProjectionExpression: "id, first_name, last_name",
                TableName: "user",
            };

            try {
                const filUserData = await ddbClient.send(new QueryCommand(queryUserParams));

                if (filUserData.Items.length === 0) {
                    return response.status(400).send({data: "No users in the group"});
                }
                console.log("FU: ", filUserData.Items);
                outputUsers[i] = filUserData.Items[0];
                console.log("OU: ", outputUsers);
            } catch (error) {
                console.log(error);
                return error;
            }
        }

        return response.send(outputUsers);
        //    return response.send(users);
    } catch (error) {
        console.log(error);
        return error;
    }
};

export default getNonGroupUsers;
