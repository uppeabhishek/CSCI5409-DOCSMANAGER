import {AnalyzeDocumentCommand, TextractClient} from "@aws-sdk/client-textract";

const client = new TextractClient({region: "us-east-1"});

export const analyzeFile = async (fileName) => {
    try {
        const params = {
            Document: {
                S3Object: {
                    Bucket: "cloud-crowd",
                    Name: fileName
                }
            },
            FeatureTypes: ["FORMS", "TABLES"]
        };

        const command = new AnalyzeDocumentCommand(params);
        const result = await client.send(command);

        return result.Blocks;
    
    } catch (err) {
        console.log(err);
    }
}
