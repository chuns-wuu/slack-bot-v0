import { App, AwsLambdaReceiver, LogLevel, Logger } from '@slack/bolt';
import { AwsHandler } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

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

// app.action('button_click', async ({ body, ack, say }) => {
//   // Acknowledge the action
//   await ack();
//   await say(`<@${body.user.id}> clicked the button`);
// });


// app.message('goodbye', async ({ message, say }) => {
//   if (message.subtype === undefined || message.subtype === 'bot_message') {
//     await say(`See ya later, <@${message.user}> :wave:`);
//   }
// });

app.command('/summarize', async ({payload, ack, say}) =>{
  await ack();
  console.log(payload)
  await say(`Hello ppl I am tring to summarize as per requested ${payload.command}`)
})

app.command('/summarize2', async ({ payload, client, logger, ack, say }) => {
  try {
    // Call chat.scheduleMessage with the built-in client
    const result = await client.conversations.replies({
      token: process.env.SLACK_BOT_TOKEN,
      channel: payload.channel_id,
      ts: payload.text
    });

    console.log(result);
    await say(`thread results ${result}`)
  }
  catch (error) {
    logger.error(error);
  }
});

export const handler: AwsHandler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
