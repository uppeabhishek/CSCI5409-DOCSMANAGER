import {ddbClient} from "../database/index.js";
import {PutItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
import {v4 as uuidv4} from "uuid";
import {invokeLambda} from "../services/lambda/email.js";

const sendMails = (emails, groupName) => {
    try {
        let emailString = "";
        emails.forEach((email, index) => {
            if (index === 0) {
                emailString += "[";
            }
            emailString += '\"' + email + '\"';
            if (index !== emails.length - 1) {
                emailString += ", "
            } else {
                emailString += "]"
            }
        })
        invokeLambda("sendEmail",
            `{"emails" : ${emailString}, "subject": "Welcome to ${groupName}",
        "message": "You have to added to workspace ${groupName}!"}`);
    } catch (e) {
        throw e;
    }
};

const createGroup = async (request, response) => {
    const {name, user_id, user_name, userId} = request.body;
    const timestamp = new Date().getTime();

    if (!user_id) {
        return response.status(400).send({data: "User Id is missing"});
    }

    try {
        const emails = [];
        user_id.map(async (current_id, index) => {
            const queryParams = {
                TableName: "user",
                ExpressionAttributeValues: {
                    ':user_id': {S: current_id}
                },
                ProjectionExpression: 'email',
                FilterExpression: 'id = :user_id',
            }
            const data = await ddbClient.send(new ScanCommand(queryParams));
            emails.push(data.Items[0].email.S);
            if (index === user_id.length - 1) {
                sendMails(emails, name);
            }
        });
    } catch (e) {
        throw e;
    }

    const params = {
        TableName: "group",
        Item: {
            id: {S: parseInt(uuidv4()) + "" + timestamp},
            name: {S: name},
            user_id: {S: user_id.toString()},
            user_name: {S: user_name.toString()},
            admin_user_id: {S: userId.toString()},
        },
    };

    try {
        const data = await ddbClient.send(new PutItemCommand(params));
        return response.send(data);
    } catch (error) {
        throw error;
    }
};

export default createGroup;
