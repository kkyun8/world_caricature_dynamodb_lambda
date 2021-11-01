const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB({ accessKeyId, secretAccessKey });

const TableName = "world-caricature-dev";

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "GET /":
        body = await dynamo
          .scan({ TableName: "world-caricature-dev" })
          .promise();
        break;
      case "GET /{pk}":
        body = await dynamo
          .getItem({
            TableName,
            Key: {
              PK: { S: event.pathParameters.pk },
            },
          })
          .promise();
        break;
      case "GET /{pk}/{sk}":
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
      case "GET /{pk}/begins-with/{sk}":
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
      case "PUT /log/{pk}/{sk}":
        body = `Put log`;
        break;
      case "PUT /artist/{pk}/{sk}":
        body = `Put artist`;
        break;
      case "PUT /product/{pk}/{sk}":
        body = `Put product`;
        break;
      case "PUT /order/{pk}/{sk}":
        {
          // userKeyemail}/orderKeyorderId}
          const orderJson = JSON.parse(event.body);
          const { pk, sk } = event.pathParameters;
          const {
            orderStatus,
            productOptions,
            orderNumber,
            nameKanzi,
            nameFurigana,
            lineId,
            cellPhoneNumber,
            postalCode,
            address1,
            address2,
            comment,
            price,
            isSendEmail,
            isSendLine,
            urlKey,
            idempotencyKey,
            paymentStatus,
            paymentOrderId,
            paymentSourceType,
            createAt,
          } = orderJson;

          const Item = {
            PK: { S: pk },
            SK: { S: sk },
            orderStatus: { S: orderStatus },
            productOptions: { M: productOptions },
            orderNumber: { S: orderNumber },
            nameKanzi: { S: nameKanzi },
            nameFurigana: { S: nameFurigana },
            lineId: { S: lineId },
            cellPhoneNumber: { S: cellPhoneNumber },
            postalCode: { S: postalCode },
            address1: { S: address1 },
            address2: { S: address2 },
            comment: { S: comment },
            price: { N: String(price) },
            isSendEmail: { BOOL: isSendEmail },
            isSendLine: { BOOL: isSendLine },
            urlKey: { S: urlKey },
            idempotency_key: { S: idempotencyKey },
            payment_status: { S: String(paymentStatus) },
            payment_order_id: { S: paymentOrderId },
            payment_source_type: { S: paymentSourceType },
            has_picture: { BOOL: false },
            is_delete: { BOOL: false },
            create_at: { S: createAt },
            update_at: { S: createAt },
          };

          await dynamo
            .putItem({
              TableName,
              Item,
            })
            .promise();

          body = `Put order ${pk} ${sk}`;
        }
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
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
