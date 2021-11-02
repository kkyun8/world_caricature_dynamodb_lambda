import httpGet from "./http/get";
import httpPost from "./http/post";
import httpPut from "./http/put";
import httpDelete from "./http/delete";

const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB({ accessKeyId, secretAccessKey });

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const [httpMethod, path] = event.routeKey.split(" ")[0];

    switch (httpMethod) {
      case "GET":
        body = httpGet(path, dynamo, event);
        break;
      case "POST":
        body = httpPost(path, dynamo, event);
        break;
      case "PUT":
        body = httpPut(path, dynamo, event);
        break;
      case "DELETE":
        body = httpDelete(path, dynamo, event);
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
