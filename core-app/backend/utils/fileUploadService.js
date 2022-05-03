import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

class FileUploader {
    region = "us-east-1";
    bucketParams = {
        Bucket: "cloud-crowd",
        Region: this.region
    };

    constructor() {
        try {
            const client = new S3Client({
                region: this.region
            });

            this.client = client;
        } catch (err) {
            console.log("Error while initialising S3 Bucket:", err);
        }
    }

    createFileOnS3 = async (name, body, contentType) => {
        try {
            const fileBucketParams = {
                ...this.bucketParams,
                Key: `${Date.now()}-${name}`,
                Body: body,
                ACL: "public-read",
                ContentType: contentType
            }

            const data = await this.client.send(new PutObjectCommand(fileBucketParams));

            // return public url if the status is ok
            if (data.$metadata.httpStatusCode < 300 && data.$metadata.httpStatusCode >= 200) {
                const publicUrl = `https://${fileBucketParams.Bucket}.s3.${fileBucketParams.Region}.amazonaws.com/${fileBucketParams.Key}`;
                return {
                    url: publicUrl,
                    key: fileBucketParams.Key
                };
            }

        } catch (err) {
            console.log("Error while creating file:", err);

        }
    }

    getFileStream = async (name) => {
        try {
            const fileBucketParams = {
                ...this.bucketParams,
                Key: name
            }

            const body = (await this.client.send(new GetObjectCommand(fileBucketParams))).Body;
            return body;
        } catch (error) {
            console.log(error.message);
        }
    }
}

export default FileUploader;
