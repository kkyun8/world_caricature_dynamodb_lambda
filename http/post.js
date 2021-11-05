import {
  TableName,
  productKey,
  logKey,
  logInfoKey,
  logErrorKey,
} from "../config";

export default async function httpPost(path, dynamo, event) {
  const { pk, sk } = event.pathParameters;
  let body;

  switch (path) {
    case "PUT /log/info/{sk}":
      {
        const logJson = JSON.parse(event.body);
        const { messages } = logJson;

        const Item = {
          PK: { S: logKey },
          SK: { S: logInfoKey + sk },
          messages: { S: messages },
        };

        await dynamo
          .putItem({
            TableName,
            Item,
          })
          .promise();

        body = `POST put item log info ${pk} ${sk}`;
      }
      break;
    case "PUT /log/error/{sk}":
      {
        const logJson = JSON.parse(event.body);
        const { messages } = logJson;

        const Item = {
          PK: { S: logKey },
          SK: { S: logErrorKey + sk },
          messages: { S: messages },
        };

        await dynamo
          .putItem({
            TableName,
            Item,
          })
          .promise();

        body = `POST put item log error ${pk} ${sk}`;
      }
      break;
    case "PUT /artist/{pk}/{sk}":
      {
        const artistJson = JSON.parse(event.body);
        const { artistNickname, serviceYears, careerData } = artistJson;

        const Item = {
          PK: { S: pk },
          SK: { S: sk },
          artistNickname: { S: artistNickname },
          serviceYears: { N: String(serviceYears) },
          careerData: { S: careerData },
        };

        await dynamo
          .putItem({
            TableName,
            Item,
          })
          .promise();

        body = `POST put item artist ${pk} ${sk}`;
      }

      break;
    case "PUT /product/{pk}/{sk}":
      {
        const productJson = JSON.parse(event.body);
        const id = sk.replace(productKey, "");
        const {
          title,
          information,
          numberOfPeople,
          price,
          productionTime,
          artistComment,
          productDetailImageUrl,
          orderType,
        } = productJson;

        const Item = {
          PK: { S: pk },
          SK: { S: sk },
          id: { S: id },
          title: { S: title },
          information: { S: information },
          numberOfPeople: { N: String(numberOfPeople) },
          price: { N: String(price) },
          productionTime: { S: productionTime },
          artistComment: { S: artistComment },
          productDetailImageUrl: { S: productDetailImageUrl },
          orderType: { SS: orderType },
        };

        await dynamo
          .putItem({
            TableName,
            Item,
          })
          .promise();

        body = `POST put item product ${pk} ${sk}`;
      }

      break;
    case "POST /order/{pk}/{sk}":
      {
        // userKeyemail}/orderKeyorderId}
        const orderJson = JSON.parse(event.body);
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
