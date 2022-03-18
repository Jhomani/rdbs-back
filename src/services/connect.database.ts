import aws from "aws-sdk";

aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
});

export const dynamo = new aws.DynamoDB.DocumentClient();
