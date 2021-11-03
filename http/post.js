import { TableName } from "../config";

export default async function httpPost(path, dynamo, event) {
  let body;
  switch (path) {
    case "POST /order/{pk}/{sk}":
      {
        // userKeyemail}/orderKeyorderId}
        // TODO: update
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
          idempotencyKey: { S: idempotencyKey },
          paymentStatus: { S: String(paymentStatus) },
          paymentOrderId: { S: paymentOrderId },
          paymentSourceType: { S: paymentSourceType },
          hasPicture: { BOOL: false },
          isDelete: { BOOL: false },
          createAt: { S: createAt },
          updateAt: { S: createAt },
        };

        await dynamo
          .putItem({
            TableName,
            Item,
          })
          .promise();

        body = `POST put item order ${pk} ${sk}`;
      }
      break;
  }
  return body;
}
