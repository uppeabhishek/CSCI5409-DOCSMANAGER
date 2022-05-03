import {CreateTableCommand, GetItemCommand, PutItemCommand, ScanCommand} from "@aws-sdk/client-dynamodb";

import {marshall, unmarshall} from "@aws-sdk/util-dynamodb";

import {ddbClient, ProvisionedThroughput} from "./index.js";

const params = {
    TableName: "group_file",
    KeySchema: [
        {AttributeName: "group_id", KeyType: "HASH"},
        {AttributeName: "file_id", KeyType: "RANGE"},
    ],
    AttributeDefinitions: [
        {AttributeName: "group_id", AttributeType: "S"},
        {AttributeName: "file_id", AttributeType: "S"},
        // { AttributeName: "file_name", AttributeType: "S" },
        // { AttributeName: "file_url", AttributeType: "S" },
        // { AttributeName: "file_key", AttributeType: "S" },
        // { AttributeName: "permission", AttributeType: "S" },
    ],
    ProvisionedThroughput: ProvisionedThroughput,
    GlobalSecondaryIndexes: [
        {
            IndexName: "group_file_index",
            KeySchema: [
                {AttributeName: "file_id", KeyType: "HASH"},
                {AttributeName: "group_id", KeyType: "RANGE"},
            ],
            Projection: {
                ProjectionType: "ALL",
            },
            ProvisionedThroughput: {...ProvisionedThroughput},
        },
        {
            IndexName: "group_url_index",
            KeySchema: [{AttributeName: "file_id", KeyType: "HASH"}],
            Projection: {
                ProjectionType: "KEYS_ONLY",
            },
            ProvisionedThroughput: {...ProvisionedThroughput},
        },
    ],
};

export const createGroupFileTable = async () => {
    try {
        return await ddbClient.send(new CreateTableCommand(params));
    } catch (err) {
        return err;
    }
};

export const addGroupFile = async (file) => {
    try {
        const params = {
            TableName: "group_file",
            Item: marshall(file),
        };
        return await ddbClient.send(new PutItemCommand(params));
    } catch (error) {
        return error;
    }
};

export const readGroupFiles = async (groupId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const params = {
                TableName: "group_file",
                FilterExpression: "group_id = :groupId",
                ExpressionAttributeValues: {
                    ":groupId": {S: groupId}
                }
            };

            const commandResponse = await ddbClient.send(new ScanCommand(params));
            if (commandResponse.$metadata.httpStatusCode === 200) {
                resolve(commandResponse.Items.map((item) => unmarshall(item)));
            }
            reject(commandResponse);
        } catch (error) {
            reject(error);
        }
    });
};


export const readFileUrl = async (file, withFileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const params = {
                TableName: "group_file",
                Key: marshall(file),
                ProjectionExpression: withFileName ? "file_key,file_url,file_name" : "file_key,file_url",
            };
            console.log(file);
            const commandResponse = await ddbClient.send(new GetItemCommand(params));
            if (commandResponse.$metadata.httpStatusCode === 200) {
                resolve(unmarshall(commandResponse.Item));
            }
            throw new Error("failed.");
        } catch (error) {
            reject(error);
        }
    });
};

createGroupFileTable();
