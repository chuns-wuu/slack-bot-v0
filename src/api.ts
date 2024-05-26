import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// const client = new S3Client({});




async function getFiles(token: String, fileLink: URL) {

    const headers: Headers = new Headers()
    headers.set('Authorization', `Bearer ${token}`)

    const request: RequestInfo = new Request(fileLink, {
      method: 'GET',
      headers: headers
    })
  
    const res = await fetch(request)

    return res
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Log the event for debugging
    console.log("Received event:", JSON.stringify(event, null, 2));

    // const command = new GetObjectCommand({
    //     Bucket: "slack-documents",
    //     Key: "document.md",
    //   });
    
    // var responseMessage
    // try {
    //     const response = await client.send(command);
    //     // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    //     var responseMessage = await response.Body
    //     const documentStr = responseMessage.transformToString();
    //     console.log(documentStr);
    // } catch (err) {
    //     console.error(err);
    // }

    // Create the response object
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            message: "OK"
        }),
    };

    // Return the response
    return response;
};
