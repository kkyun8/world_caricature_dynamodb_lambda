import { TableName } from "../config";

export default async function httpPut(path, dynamo, event) {
  let body;
  switch (path) {
    case "PUT /log/{pk}/{sk}":
      body = `Put log`;
      break;
    case "PUT /artist/{pk}/{sk}":
      body = `Put artist`;
      break;
    case "PUT /product/{pk}/{sk}":
      body = `Put product`;
      break;
    case "PUT /label/{pk}/{sk}":
      {
        const { label, language } = JSON.parse(event.body);
        const { pk, sk } = event.pathParameters;
        await dynamo
          .putItem({
            TableName,
            Item: {
              PK: { S: event.pathParameters.pk },
              SK: { S: event.pathParameters.sk },
              label: { S: label },
              language: { S: language },
            },
          })
          .promise();
        body = `Put order ${pk} ${sk}`;
      }

      break;
  }
  return body;
}
