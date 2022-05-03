import {ddbClient, ProvisionedThroughput} from "./index.js";
import {CreateTableCommand} from "@aws-sdk/client-dynamodb";

const params = {
    TableName: "user_group",
    KeySchema: [
        {AttributeName: "user_email", KeyType: "HASH"},
        {AttributeName: "group_id", KeyType: "RANGE"}
    ],
    AttributeDefinitions: [
        {AttributeName: "user_email", AttributeType: "S"},
        {AttributeName: "group_id", AttributeType: "S"}
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "user_group_index", KeySchema: [
                {AttributeName: "user_email", KeyType: "HASH"},
                {AttributeName: "group_id", KeyType: "RANGE"}
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
            ProvisionedThroughput: {...ProvisionedThroughput}
        }
    ],
    ProvisionedThroughput: {...ProvisionedThroughput}
};

export const createGroupTable = async () => {
    try {
        return await ddbClient.send(new CreateTableCommand(params));
    } catch (err) {
        return err;
    }
}

createGroupTable();