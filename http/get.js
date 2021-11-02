import { TableName } from "../config";

export default async function httpGet(path, dynamo, event) {
  let body;
  switch (path) {
    case "/":
      body = await dynamo.scan({ TableName: "world-caricature-dev" }).promise();
      break;
    case "/pk-index/{pk}":
      // TODO: set index
      body = await dynamo
        .getItem({
          TableName,
          Key: {
            PK: { S: event.pathParameters.pk },
          },
        })
        .promise();
      break;
    case "/sk-index/{pk}":
      // TODO: set index
      body = await dynamo
        .getItem({
          TableName,
          Key: {
            PK: { S: event.pathParameters.pk },
          },
        })
        .promise();
      break;
    case "/inverted-index/{pk}":
      // TODO: set index
      body = await dynamo
        .getItem({
          TableName,
          Key: {
            PK: { S: event.pathParameters.pk },
          },
        })
        .promise();
      break;

    case "/{pk}/{sk}":
      body = await dynamo
        .getItem({
          TableName,
          Key: {
            PK: { S: event.pathParameters.pk },
            SK: { S: event.pathParameters.sk },
          },
        })
        .promise();
      break;
    case "/{pk}/begins-with/{sk}":
      {
        const params = {
          TableName,
          KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
          ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK",
          },
          ExpressionAttributeValues: {
            ":pk": { S: event.pathParameters.pk },
            ":sk": { S: event.pathParameters.sk },
          },
        };
        body = await dynamo.query(params).promise();
      }

      break;
  }
  return body;
}
