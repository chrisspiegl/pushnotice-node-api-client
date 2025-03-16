import fetch from 'isomorphic-unfetch'

function checkInputs(namespace, text, level, options) {
  if (options.url === undefined) {
    options.url = 'https://pushnotice.chat/api/v1/chatnotice'
  }

  if (options.debug === undefined) {
    options.debug = false
  }

  if (options.env === undefined) {
    options.env = undefined
  }

  if (options.disabled === true) {
    return { error: { title: 'Disabled', message: 'disabled not sending the notification' } }
  }

  if (options.chat === undefined) {
    return { error: { title: 'MissingChatObject', message: 'chat object has to be provided' } }
  }

  if (options.chat?.id === undefined) {
    return { error: { title: 'MissingChatId', message: 'chat id has to be provided' } }
  }

  if (options.chat?.secret === undefined) {
    return { error: { title: 'MissingChatSecret', message: 'chat secret has to be provided' } }
  }

  if (namespace === undefined) {
    return { error: { title: 'MissingNamespace', message: 'namespace has to be provided' } }
  }

  if (typeof namespace !== 'string' && !(namespace instanceof String)) {
    return { error: { title: 'NamespaceMustBeString', message: 'namespace must be a String' } }
  }

  if (text === undefined && text === '') {
    return { error: { title: 'MissingText', message: 'text has to be provided' } }
  }

  if (typeof text !== 'string' && !(text instanceof String)) {
    return { error: { title: 'TextMustBeString', message: 'text must be a String' } }
  }

  if (level === undefined) {
    return { error: { title: 'MissingLevel', message: 'level has to be provided' } }
  }

  if (typeof level !== 'string' && !(level instanceof String)) {
    return { error: { title: 'LevelMustBeString', message: 'level must be a String' } }
  }
}

async function sendRequest(namespace, text, level = 'INFO', options = {}) {
  const error = checkInputs(namespace, text, level, options)

  if (error && options.debug) {
    console.error('PushNotice:', error?.error?.message || error)
    return error
  }

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idChat: options?.chat?.id || undefined,
      idThread: options.idThread || undefined,
      secret: options?.chat?.secret || undefined,
      namespace,
      level,
      text,
      env: options.env || undefined,
      silent: options.silent || undefined,
      clean: options.clean || undefined,
    }),
  }

  try {
    const response = await fetch(options.url, request)
    const body = await response.json()
    if (body.status !== 'ok') {
      return {
        error: {
          title: 'ApiRequestFailed',
          message: 'Error sending Notification to PushNotice API',
          body,
        },
      }
    }

    return body
  } catch {
    return { error: { title: 'ApiRequestFailed', message: 'Error sending Notification to PushNotice API' } }
  }
}

function isString(value) {
  return typeof value === 'string' || value instanceof String
}

function pnotice(namespace, options = {}) {
  return (text, level = 'INFO', optionsInner = {}) => {
    if (!isString(level)) {
      optionsInner = { ...level }
      level = undefined
    }

    if (optionsInner.level) {
      level = optionsInner.level
    }

    return sendRequest(namespace, text, level, { ...options, ...optionsInner })
  }
}

export default pnotice
