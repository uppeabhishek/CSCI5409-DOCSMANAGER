import AWS from "aws-sdk";

export const invokeLambda = (FunctionName, Payload) => {
    AWS.config.update({region: "us-east-1"});
    const params = {
        FunctionName,
        Payload,
    };
    const lambda = new AWS.Lambda();
    lambda.invoke(params, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
};
// invokeLambda("sendVerificationEmail", '{"email" : "uppeabhishek97@gmail.com"}');
// invokeLambda("sendEmail", '{"emails" : ["uppeabhishek97@gmail.com"], "message": "hello", "subject": "world"}');
