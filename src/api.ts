import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

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

    // Perform the business logic here
    const responseMessage = "Successfully shared a file!";

    // Create the response object
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            message: responseMessage
        }),
    };

    // Return the response
    return response;
};
