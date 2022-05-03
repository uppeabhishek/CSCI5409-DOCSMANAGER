import {ddbClient} from "../database/index.js";
import {QueryCommand} from "@aws-sdk/client-dynamodb";

export const shortenLookUp = async (request, response) => {
    const shortId = request.params.shortendId;
    let data;
    const queryParams = {
        KeyConditionExpression: "shortend_id = :id",
        ExpressionAttributeValues: {
            ":id": {S: shortId},
        },
        ProjectionExpression: "#orig_url, shortend_url",
        TableName: "shortened_url",
        ExpressionAttributeNames: {
            "#orig_url": "url",
        },
    };

    try {
        data = await ddbClient.send(new QueryCommand(queryParams));

        if (data.Items.length === 0) {
            return response.status(400).send({data: "No such shortened url found"});
        }
        return response
            .writeHead(301, {
                Location: data.Items[0].url.S,
            })
            .end();
    } catch (error) {
        return error;
    }
};
