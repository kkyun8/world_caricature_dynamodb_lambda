const config = require("../config");
const { TableName } = config;

module.exports = async (path, dynamo, event) => {
  const { pk, sk } = event.pathParameters;
  let body;
  switch (path) {
    case "DELETE  /{pk}/{sk}":
      await dynamo
        .deleteItem({
          TableName,
          Key: {
            PK: { S: pk },
            SK: { S: sk },
          },
        })
        .promise();
      body = `Deleted item ${pk} ${sk}`;
      break;
  }
  return body;
};
