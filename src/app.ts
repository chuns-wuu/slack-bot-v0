import { App, AwsLambdaReceiver, LogLevel, Logger } from '@slack/bolt';
import { AwsHandler } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

const API_URL = "https://oulgrtv8x8.execute-api.us-east-1.amazonaws.com/dev/api/file"

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  logLevel: LogLevel.DEBUG,
});

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


app.command('/summarize', async ({payload, ack, say}) =>{
  await ack();
  await say(`Hello ppl I am tring to summarize as per requested ${payload.command}`)
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
      text: "a file was just shared successfully!"
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
