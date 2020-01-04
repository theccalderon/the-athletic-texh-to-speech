chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log("something happening from the extension");
  if (request.action == "getBody")
  {
    var text = document.body.innerText || {};
    // AWS.config.region = 'us-east-1'; 
    // // Create subscribe/email parameters
    // var params = {
    //   Protocol: 'EMAIL', /* required */
    //   TopicArn: 'arn:aws:sns:us-east-1:075975402138:theathletic-audio', /* required */
    //   Endpoint: request.email
    // };
    // // Create promise and SNS service object
    // var subscribePromise = new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();

    // // Handle promise's fulfilled/rejected states
    // subscribePromise.then(
    //   function(data) {
    //     console.log("Subscription ARN is " + data.SubscriptionArn);
    //   }).catch(
    //     function(err) {
    //     console.error(err, err.stack);
    //   });
    sendResponse({text: text});
  }
});