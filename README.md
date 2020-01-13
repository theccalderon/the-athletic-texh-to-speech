# Chrome extension to convert articles from The Athletic to speech.

This chrome extension allows you to convert content from a website (in this case, https://theathletic.com) to speech so you can listen to it instead of reading it.

You can follow [https://developer.chrome.com/extensions/getstarted](https://developer.chrome.com/extensions/getstarted) to see how to load an unpacked extension to your Chrome Browser.

## Pre-requisites
1. [AWS account](https://aws.amazon.com/free/)
2. [Amazon Cognito Identity pool](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html)
3. [AWS SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-tutorial-create-topic.html)
4. [Amazon S3 bucket](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-1-create-bucket.html)

## Usage
1. `git clone https://github.com/theccalderon/the-athletic-texh-to-speech.git`
2. replace the values of `AWS.config.region`(`popup.js:19`), `IdentityPoolId`(`popup.js:20`), `snsTopicArn`(`popup.js:21`) and `s3_bucket`(`popup.js:22`) with the values created in the Pre-requisites section.
3. Follow [https://developer.chrome.com/extensions/getstarted](https://developer.chrome.com/extensions/getstarted) to load the extension into your Google Chrome.