import { TableName } from "../config";

export default async function httpDelete(path, dynamo, event) {
  let body;
  switch (path) {
    case "DELETE  /{pk}/{sk}":
      await dynamo
        .deleteItem({
          TableName,
          Key: {
            PK: { S: event.pathParameters.pk },
            SK: { S: event.pathParameters.sk },
          },
        })
        .promise();
      body = `Deleted item ${event.pathParameters.pk}`;
      break;
  }
  return body;
}
