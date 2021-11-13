const config = require("../config");
const { TableName } = config;

module.exports = async (path, dynamo, event) => {
  const { pk, sk } = event.pathParameters;
  let body;
  let params;

  switch (path) {
    case "/pk-index/{pk}":
      params = {
        ExpressionAttributeValues: {
          ":pk": { S: pk },
        },
        TableName,
        IndexName: "pk-index",
        KeyConditionExpression: "PK = :o",
      };

      body = await dynamo.query(params).promise();
      break;

    case "/sk-index/{sk}":
      params = {
        ExpressionAttributeValues: {
          ":sk": { S: sk },
        },
        TableName,
        IndexName: "sk-index",
        KeyConditionExpression: "SK = :sk",
      };

      body = await dynamo.query(params).promise();
      break;

    case "/inverted-index/{pk}/{sk}":
      params = {
        ExpressionAttributeValues: {
          ":pk": { S: pk },
          ":sk": { S: sk },
        },
        TableName,
        IndexName: "inverted-index",
        KeyConditionExpression: "PK = :pk and SK = :sk",
      };

      body = await dynamo.query(params).promise();
      break;

    case "/{pk}/{sk}":
      body = await dynamo
        .getItem({
          TableName,
          Key: {
            PK: { S: pk },
            SK: { S: sk },
          },
        })
        .promise();
      break;
    case "/{pk}/begins-with/{sk}": {
      const params = {
        TableName,
        KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
        ExpressionAttributeNames: {
          "#pk": "PK",
          "#sk": "SK",
        },
        ExpressionAttributeValues: {
          ":pk": { S: pk },
          ":sk": { S: sk },
        },
      };
      body = await dynamo.query(params).promise();
      break;
    },
    case "/begins-with/{sk}":
      {
        const params = {
          TableName,
          KeyConditionExpression: "#pk = :pk and begins_with(#sk, :sk)",
          ExpressionAttributeNames: {
            "#pk": "PK",
            "#sk": "SK",
          },
          ExpressionAttributeValues: {
            ":pk": { S: pk },
            ":sk": { S: sk },
          },
        };
        body = await dynamo.query(params).promise();
      }
      break;
  }
  return body;
};
