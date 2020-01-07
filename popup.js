
// check if the user has already inputted their email
chrome.storage.local.get(['email'], function(data) {
  console.log(data);
  if (data.email)
  {
    console.log("email is: "+data.email);
    document.getElementById("textEntry").style.display = "none";
    document.getElementById("loginOrSubscribe").style.display = "none";
    document.getElementById("tts").style.display = "block";
    document.getElementById("result").style.display = "block";
    // subscribeToSNS(data.email)
  }
});

let tts = document.getElementById('tts');
let loginOrSubscribe = document.getElementById('loginOrSubscribe');

AWS.config.region = 'us-east-1'; 
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'us-east-1:71730a6b-dd40-461c-bc75-b2fc4bff1d06'});
let snsTopicArn = "arn:aws:sns:us-east-1:894697003047:theathletic-audio";
  // chrome.storage.sync.get('color', function(data) {
  //   changeColor.style.backgroundColor = data.color;
  //   changeColor.setAttribute('value', data.color);
  // });

  // changeColor.onclick = function(element) {
  //   let color = element.target.value;
  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     chrome.tabs.executeScript(
  //         tabs[0].id,
  //         {code: 'document.body.style.backgroundColor = "' + color + '";'});
  //   });
  // };

  
  function subscribeToSNS(email)
  {
    // subscribe and blah
    var sns = new AWS.SNS();
    var params = {
      Protocol: 'email', /* required */
      TopicArn: snsTopicArn, /* required */
      Endpoint: email
    };
    sns.subscribe(params, function(err, data){
      if (err)
      {
        console.log(err.stack)
        return;
      }
      console.log("subscribed")
    })
  }

loginOrSubscribe.onclick = function(element) {
  //check if email is already subscribed to topic
  var sns = new AWS.SNS();
  var params = {
    TopicArn: snsTopicArn, /* required */
  };
  sns.listSubscriptionsByTopic(params, function(err, data) {
    if (err) 
    {
      console.log(err, err.stack); // an error occurred
      document.getElementById('result').innerHTML = err.stack;
      document.getElementById('result').style.display = "block";
    }
    else
    { 
      console.log(data);           // successful response
      let email = document.getElementById('textEntry').value;
      chrome.storage.local.set({email: email}, function() {
        console.log('email is ' + email);
      });
      for (let index = 0; index < data.Subscriptions.length; index++) {
        const element = data.Subscriptions[index];
        if (element.Endpoint == document.getElementById('textEntry').value)
        {
          // already subscribed
          console.log(document.getElementById('textEntry').value)
          document.getElementById('result').innerHTML = "You are already subscribed!, now click on Synthesize to convert the content to audio";
          document.getElementById('result').style.display = "block";
          document.getElementById('tts').style.display = "block";
          document.getElementById('loginOrSubscribe').style.display = "none";
          document.getElementById('textEntry').style.display = "none";
          return;
        }
      }
      // subscribe
      
      subscribeToSNS(email);
      document.getElementById('loginOrSubscribe').style.display = "none";
      document.getElementById('textEntry').style.display = "none";
      document.getElementById('result').innerHTML = "Please confirm the subscription via email to be able to receive the audio file.";
      document.getElementById('result').style.display = "block";
      document.getElementById('tts').style.display = "block";
    }
  });
  
}

  tts.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getBody"}, function(response) {
        if (response)
        {
          var text = response.text;
          
          var speechParams = {
              OutputFormat: "mp3",
              OutputS3BucketName: "ccalderon-theathletic1",
              Engine: "neural",
              Text: "",
              TextType: "text",
              VoiceId: "Joey",
              SnsTopicArn: snsTopicArn
          };
          // Create the Polly service object and presigner object
          var polly = new AWS.Polly({apiVersion: '2016-06-10'});
          // var signer = new AWS.Polly.Presigner(speechParams, polly);
          // cut the first line:
          text = text.split("• • •")[1]
          text = text.split("What did you think of this story?")[0]
          speechParams.Text = text;
          polly.startSpeechSynthesisTask(speechParams, function(error, data){
            if (error)
            {
              console.log(error.stack);
              return; 
            }
            console.log(data.SynthesisTask.OutputUri)
            document.getElementById('result').innerHTML = data.SynthesisTask.OutputUri;
          //   //console.log(event['detail']['requestParameters']['key']);
          //   key = data.SynthesisTask.OutputUri.split("/")[4];
          //   //granting read permissions
          //   var params = {
          //     Bucket: 'ccalderon-theathletic1', /* required */
          //     Key: key, /* required */
          //     ACL: "public-read"
          //   };
          //   var s3 = new AWS.S3({apiVersion: '2006-03-01'});
          //   s3.putObjectAcl(params, function(err, data) {
          //     if (err) console.log(err, err.stack); // an error occurred
          //     else     console.log(data);           // successful response
          //   });
          //   return;
          });
        }
        else
        {
          document.getElementById('result').innerHTML = "Error retrieving the data or subscribing to the SNS topic";
        }
        });
      
      });
      
  }