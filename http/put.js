const config = require("../config");
const { TableName } = config;

module.exports = async (path, dynamo, event) => {
  const { pk, sk } = event.pathParameters;
  let body;
  let params;

  switch (path) {
    case "PUT /label/{pk}/{sk}":
      {
        const { label, language } = JSON.parse(event.body);
        await dynamo
          .putItem({
            TableName,
            Item: {
              PK: { S: pk },
              SK: { S: sk },
              label: { S: label },
              language: { S: language },
            },
          })
          .promise();
        body = `Put label ${pk} ${sk}`;
      }

      break;
    case "PUT /order/{pk}/{sk}":
      {
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
          hasPicture,
          isDelete,
          createAt,
          updateAt,
        } = orderJson;

        params = {
          ExpressionAttributeNames: {
            "#OS": "orderStatus",
            "#PO": "productOptions",
            "#ON": "orderNumber",
            "#NK": "nameKanzi",
            "#NF": "nameFurigana",
            "#LI": "lineId",
            "#CPN": "cellPhoneNumber",
            "#PC": "postalCode",
            "#AR1": "address1",
            "#AR2": "address2",
            "#CM": "comment",
            "#PR": "price",
            "#ISE": "isSendEmail",
            "#ISL": "isSendLine",
            "#UK": "urlKey",
            "#IK": "idempotencyKey",
            "#PS": "paymentStatus",
            "#POI": "paymentOrderId",
            "#PST": "paymentSourceType",
            "#HP": "hasPicture",
            "#ID": "isDelete",
            "#CA": "createAt",
            "#UA": "updateAt",
          },
          ExpressionAttributeValues: {
            ":os": {
              S: orderStatus,
            },
            ":po": { M: productOptions },
            ":on": { S: orderNumber },
            ":nk": { S: nameKanzi },
            ":nf": { S: nameFurigana },
            ":li": { S: lineId },
            ":cpn": { S: cellPhoneNumber },
            ":pc": {
              S: postalCode || "",
              ":ar1": { S: address1 },
              ":ar2": { S: address2 },
              ":cm": { S: comment },
              ":pr": { N: String(price) },
              ":ise": { BOOL: isSendEmail },
              ":isl": { BOOL: isSendLine },
              ":uk": { S: urlKey },
              ":ik": { S: idempotencyKey },
              ":ps": { S: String(paymentStatus) },
              ":poi": { S: paymentOrderId },
              ":pst": { S: paymentSourceType },
              ":hp": { BOOL: hasPicture || false },
              ":id": { BOOL: isDelete || false },
              ":ca": { S: createAt },
              ":ua": { S: updateAt || createAt },
            },
            Key: {
              PK: {
                S: pk,
              },
              SK: {
                S: sk,
              },
            },
            TableName,
            UpdateExpression:
              "SET #OS = :os, #IK = :ik, #POI = :poi, #PST = :pst",
          },
        };
        await dynamo.updateItem(params).promise();
        body = `PUT update item order ${pk} ${sk}`;
      }
      break;
  }
  return body;
};
