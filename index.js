process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const request = require('request-promise-native');

function sendRequest(namespace, text, level='INFO', options={}) {
  if (options.chat == undefined) {
    console.error('PushNotice: chat object has to be provided');
    return;
  }
  if (options.chat && options.chat.id == undefined) {
    console.error('PushNotice: chat id has to be provided');
    return;
  }
  if (options.chat && options.chat.secret == undefined) {
    console.error('PushNotice: chat secret has to be provided');
    return;
  }
  if (namespace == undefined) {
    console.error('PushNotice: namespace has to be provided');
    return;
  }
  if (text == undefined) {
    console.error('PushNotice: text has to be provided');
    return;
  }
  if (level == undefined) {
    console.error('PushNotice: level has to be provided');
    return;
  }
  if (options.url == undefined) options.url = 'https://pushnotice.chat/api/vi/chatnotice';
  if (options.debug == undefined) options.debug = false;
  let requestOptions = {
    method: 'POST',
    uri: options.url,
    body: {
      chatId: options.chat.id,
      chatSecret: options.chat.secret,
      namespace: namespace,
      level: level,
      text: text,
    },
    json: true,
    headers: {
      'content-type': 'application/json',
    }
  };
  request(requestOptions).then((res) => {
    if (options.debug) console.log("PushNotice: Successfully sent Notification to PushNotice API");
  }).catch((err) => {
    if (options.debug) console.error("PushNotice: Error sending Notification to PushNotice API");
  });
}

module.exports = (namespace, options={}) => {
  return (text, level='INFO') => {
    sendRequest(namespace, text, level, options);
  }
}
