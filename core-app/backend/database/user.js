import {ddbClient, ProvisionedThroughput} from "./index.js";
import {CreateTableCommand} from "@aws-sdk/client-dynamodb";

const params = {
    TableName: "user",
    KeySchema: [{AttributeName: "email", KeyType: "HASH"}],
    AttributeDefinitions: [{AttributeName: "email", AttributeType: "S"}],
    ProvisionedThroughput: {...ProvisionedThroughput},
};

export const createUserTable = async () => {
    try {
        return await ddbClient.send(new CreateTableCommand(params));
    } catch (err) {
        console.log(err);
        return err;
    }
};

createUserTable();
