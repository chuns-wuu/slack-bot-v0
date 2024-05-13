# Incident assistant
> Because there's no time to document what you did with the incident last time

## Overview

This is a Slack app built with the [Bolt for JavaScript framework][2]. The original repo is the [bolt-js-getting-started-app][9].

The slack-bot-v0 is a proof-of-concept project for summarizing threads in Slack. Some mentioned use cases that could help developers during incident response are:

1. Annotate and collect shared observability links with what they are used for in a single place.
2. Extract relevant information(screenshots, communication, timestamps, metrics, impact) from each Slack thread in the on-call or alert channels into a single place so that they can create Jira ticket or postmorterm Wiki based off it. 
3. Keep track of the priority of the postmorterm action items 
4. Correlate the new incident with the past incidents and provide suggestions.

If there's any use case you think we should include but that's missing, please let us know!

## Contributing

### 0. Try it out
The slack bot is under developement, and is only available in [echo-X][5].

- Ask Chunchun to add you to the workspace
- Go to the `#services-alerts` channel to interact with the bot
- You can also create a channel, then use `/invite @Demo App` to interact with the bot
- Type in "hello" to get greeted by the bot

That's it! You now can access the bot, Demo App.

### 1. Slack App organization
The Slack App's [home page][6] contains settings for the app. The important concepts are:

- **Event subscriptions**: the request URL is the destination that Slack will [POST][7] the events to. 
- **Events**: Only specific, subscribed events will be sent to the request URL, as defined by their event name. However the App must be reinstalled each time a new event is added to the list.
- **OAth tokens**: The Bot User OAuth Token is used in the Slack App's implementation, in addition, a Signing Secret is used to verify the request is coming from the Slack App.
- **Bolt**: The Bolt SDK supports deployment in [AWS Lambda][8], which requires the use of `AwsLambdaReceiver` 


### 2. Setup your local project

```zsh
# Clone this project onto your machine
git clone https://github.com/chuns-wuu/slack-bot-v0

# Change into the project
cd slack-bot-v0/

# Install the dependencies
npm install

# Replace with your bot and app token
export SLACK_BOT_TOKEN=<bot-token> # from the OAuth section
export SLACK_SIGNING_SECRET=<signing-token> # from the Basic Info App Token Section

# Running locally using serverless, which also requires AWS credentials
export AWS_ACCESS_KEY_ID=<aws-user-access-key-id>
export AWS_SECRET_ACCESS_KEY=<aws-user-secret-key>
export AWS_DEFAULT_REGION=us-east-1

# Test out a single .ts file
npx tsx src/app.ts 

```

### 3. Deploy changes to Lambda

```zsh

brew install serverless

serverless plugin install -n serverless-offline

# Build the code
# TODO (rajaram) automate the dev env
npx webpack

serverless offline --noPrependStageInUrl

# TODO: Find sample Slack events to try out in Postman locally

# Deploy changes to the AWS Lambda function
serverless deploy function -f slack
```

### Tutorials
[Getting started with Bolt and AWS Lambda][8]

[1]: https://slack.dev/bolt-js/tutorial/getting-started
[2]: https://slack.dev/bolt-js/
[3]: https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events
[4]: https://github.com/slackapi/bolt-js/issues/new
[5]: https://echo-x.slack.com
[6]: https://api.slack.com/apps/A072Z6STZKK/
[7]: https://api.slack.com/interactivity/slash-commands#app_command_handling
[8]: https://slack.dev/bolt-js/deployments/aws-lambda
[9]: https://github.com/slackapi/bolt-js-getting-started-app
