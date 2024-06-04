import { App, AwsLambdaReceiver, LogLevel, Logger, SlashCommand } from '@slack/bolt';
import { AwsHandler } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from 'fs';


const client = new S3Client({});

const API_URL = "https://oulgrtv8x8.execute-api.us-east-1.amazonaws.com/dev/api/file"
const FILE_URL = "https://slack-documents.s3.us-east-1.amazonaws.com/document.md?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBYaCXVzLWVhc3QtMSJIMEYCIQDZADiz2UoW%2B7YjcnOGp98aV7FJmj4r4lrHgqQ9aEZSaAIhAJhYvx5xygEBr%2BX9QJHn7%2F8tDiG19Yz8PxuzVFVwFPCmKu0CCI7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNzMwMzM1NDc4MDk3IgwwDyE6FzU05zOxBCQqwQJ0g%2FFmiX6WJexuOb%2F%2BOf4zUvZDXGpHCxAAob95kAGdH3Lu9xSsp8549OPJ6k5qH8AvJ8LFAFm0OtOqlQTyljHFApcKmat7TxVTPdC2NMQfV%2Fm36x9Z41ZuS%2Fgby08Ih2%2FF0%2Ff97kuVemHDNNDBlS8gUAAZf1%2BFSd3bhyMV%2BVPNtK4fhw51Ou5%2FF%2F3Dp%2BS234fXeDrou0CvFaXbaoLQMUQDOvGP1KPix9KFA%2F85cnPY5Dp%2FpFjJ7n2zVhl3wvogJd3okybKZTG6hnthw%2FaRkMfkwX%2FgaN9L%2Bby0b%2BLS4zqvPfAFd%2F%2BR03YEuQdGH0wjHcAB7MFD7ks6r4CMWMuudl6dppa1vNjDjRe%2BEShrIt7RoYcCIU7gyRj8YJQMwHzN5LRshU5uIBiMiifnzLa2pd3DrCH%2BzgvqA3QwvB6fWJzJjj0w6aTCsgY6sgLegFzDCB279gBa16fyaDhstkmxPtq81dvt1tSquWy9NMEIbRIeMevjt1xm1i%2FgUN5Gb4MH5VNlD%2FjkhoT%2F11%2Fc63ioqA8Y1N74ZtJp9oALWrIx%2Bd6s9VuFnBOFJi0hUvsRtwpOCOlL3ig2Sz0h2aVPj82bm3ELlzWMiy%2F6EWVYINpIV%2F0hZwu9AR1WBqk%2Fw0F8aZAwx9oyaZldOLozDrSqP1NN%2Fh4Vj7I5J75KqBA0mqkqJlxNv1OxoSqhnycQ%2BCtIckejbV4UBubW6WTIXbliQctBThc%2FeKikc2vAp%2BGtf9j371bbQbSi2ACllxt0kaVKO9izgzkHeoPPXsvxDCQR%2BsfgwIokdWw%2FfwLNhl9uncIK7u4iyZSscNJhqqzYj9HAHCWuAuKfMXbpkOSLU8L%2BwFE%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240524T143840Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIA2UC3DAFIUBSZ6CAG%2F20240524%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ecd9b3aa6fcc691648f6e9ab5869e500b8e8337d9942c69a23f210c4f9a0f68c"

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  logLevel: LogLevel.DEBUG,
});

interface Prompt {
  prompt: string;
  fileName: string;
  title: string;
  s3: string;
}

const howto: Prompt = {
  prompt: "how i deploy the lambda to ECR",
  title: "How to deploy docker based lambda to AWS ECR",
  fileName: "how-to-deploy-docker-based-lambda-to-aws-ecr.md",
  s3: "tutorial.md"
}

const quickfix: Prompt = {
  prompt: "how i fix the s3 credential bug",
  title: "Quick fix for 'unable to locate S3 credential'",
  fileName: "quick-fix-for-unable-to-locate-s3-credential.md",
  s3: "troubleshoot.md"
}

const systemdesign: Prompt = {
  prompt: "system architecture for my lambda",
  title: "System design for the whisper lambda",
  fileName: "system-design-for-the-whisper-lambda.md",
  s3: "explanation.md"
}

const empty: Prompt = {
  prompt: "",
  title: "Hello World",
  fileName: "hello-world.md",
  s3: "success.md"
}


async function shareS3File(prompt: Prompt, payload: SlashCommand, logger: Logger) {
    const command = new GetObjectCommand({
        Bucket: "slack-documents",
        Key: prompt.s3,
    });
    const s3Response = await client.send(command);
    const s3Content = s3Response.Body
    const s3ByteContent = (await s3Content!.transformToByteArray())

    const fileUploadURL = (await app.client.files.getUploadURLExternal({
      token: process.env.SLACK_BOT_TOKEN,
      filename: prompt.fileName,
      length: s3ByteContent.byteLength
    }))
    logger.info(fileUploadURL.upload_url)

    // const s3ContentForm = new FormData()
    // s3ContentForm.append("content", await s3Content!.transformToString())
    
    const request: RequestInfo = new Request(new URL(fileUploadURL.upload_url!), {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data'
        "Content-Type": "application/octet-stream"
      },
      body: s3ByteContent
    })
    logger.info(s3ByteContent)

    
    const uploadResponse = await fetch(request)
    logger.info(uploadResponse)

    const completeResponse = await app.client.files.completeUploadExternal({
      channels: payload.channel_id,
      files: [{ id: fileUploadURL.file_id!, title: prompt.fileName}],
    });
    logger.info(completeResponse);

    const chatResponse = await app.client.chat.postMessage({
      channel: payload.channel_id,
      text: `"${prompt.title}" has just been created for you! :hugging_face: ${completeResponse.files![0].permalink}`
    })
    logger.info(chatResponse);
}

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  if (message.subtype === undefined || message.subtype === 'bot_message') {
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hey there <@${message.user}>!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "button_click"
          }
        }
      ],
      text: `Hey there <@${message.user}>!`
    });
  }
});

app.message(/.*/, async ({ message, say }) => {
  // RegExp matches are inside of context.matches
  await say(`${message.ts} is the thread ID`);
});


app.command('/echox', async ({payload, ack, say, logger}) =>{
  await ack();
  const text = payload.text
  logger.info(payload)

  var prompt = empty
  if(text === howto.prompt) {
    prompt = howto
  } else if(text === quickfix.prompt) {
    prompt = quickfix
  } else if(text === systemdesign.prompt) {
    prompt = systemdesign
  }

  await shareS3File(prompt, payload, logger);
})


app.event('file_shared', async ({ event, client, logger }) => {
  try {
    const file = await app.client.files.info({
      token: process.env.SLACK_BOT_TOKEN,
      file: event['file_id']
    })
    const data = {
      file_url: file.file?.url_private_download,
      channel: event['user_id']
    }
    const request: RequestInfo = new Request(new URL(API_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const response = await fetch(request)
    
    if (!response.ok) {
      throw new Error(`Error while calling downstream API. Status: ${response.status}`);
    }
    await client.chat.postMessage({
      channel: event['user_id'],
      text: "Your recording is being processed."
    });
  }
  catch (error) {
    logger.error(error);
  }
});



// app.command('/summarize2', async ({ payload, client, logger, ack, say }) => {
//   try {
//     // Call chat.scheduleMessage with the built-in client
//     const result = await client.conversations.replies({
//       token: process.env.SLACK_BOT_TOKEN,
//       channel: payload.channel_id,
//       ts: payload.text
//     });

//     console.log(result);
//     await say(`thread results ${result}`)
//   }
//   catch (error) {
//     logger.error(error);
//   }
// });

app.shortcut('thread_summary', async ({ shortcut, ack, client, logger }) => {

  try {
    // Acknowledge shortcut request
    await ack();

    // Call the views.open method using one of the built-in WebClients
    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        "title": {
          "type": "plain_text",
          "text": "Incident summary"
        },
        "submit": {
          "type": "plain_text",
          "text": "Send"
        },
        "callback_id": "incident_summary_submit",
        "blocks": [
          {
            "block_id": "thread_id_input",
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "thread_id"
            },
            "label": {
              "type": "plain_text",
              "text": "Thread ID",
              "emoji": true
            }
          },
          // TODO: adding the dropdown block will cause a handler not found error, need to figure out a fix
          // {
          //   "block_id": "recipient_list_input",
          //   "type": "section",
          //   "text": {
          //     "type": "mrkdwn",
          //     "text": "Recipients"
          //   },
          //   "accessory": {
          //     "type": "multi_static_select",
          //     "placeholder": {
          //       "type": "plain_text",
          //       "text": "Select who to send the summary to",
          //       "emoji": true
          //     },
          //     "options": [
          //       {
          //         "text": {
          //           "type": "plain_text",
          //           "text": "The current message thread",
          //           "emoji": true
          //         },
          //         "value": "thrad"
          //       }
          //     ],
          //     "action_id": "recipient_list"
          //   }
          // },
        ],
        "type": "modal"
      }
    });

    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});

app.view('incident_summary_submit', async ({ ack, body, view, client, logger }) => {
  // Acknowledge the view_submission request
  await ack()
 
  //const threadid = view['state']['values']['thread_id_input']['thread_id'].value
  const threadid = view['state']['values']['thread_id_input']['thread_id'].value
  
  // Message the user
  try {
    const result = await client.chat.postMessage({
      channel:  body['user'].id,
      text: "The thread is being summarized...",
      thread_ts: threadid || body['user'].id
    });
    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }

});



export const handler: AwsHandler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
