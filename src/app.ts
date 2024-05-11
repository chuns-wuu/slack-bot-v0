import { App, AwsLambdaReceiver, LogLevel } from '@slack/bolt';
import { AwsCallback, AwsEvent, AwsHandler } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

// const { AwsLambdaReceiver } = require('@slack/bolt');
require('dotenv').config({ path: require('find-config')('.env') })

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

app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});


app.message('goodbye', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  if (message.subtype === undefined || message.subtype === 'bot_message') {
    await say(`See ya later, <@${message.user}> :wave:`);
  }
});

export const handler: AwsHandler= async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
