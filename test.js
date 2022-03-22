import process from 'node:process'
import 'dotenv/config.js'// eslint-disable-line import/no-unassigned-import
import test from 'ava'
import pnotice from './index.js'

const config = {
  chat: {
    id: process.env.PUSHNOTICE_CHAT_ID,
    secret: process.env.PUSHNOTICE_CHAT_SECRET,
  },
}

if (config.chat.id) {
  console.log('Test file currently being run:', test.meta.file)

  test('handle options.disabled = true', async (t) => {
    const pn = pnotice('pntest', {
      disabled: true,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('hello world', 'INFO')
    t.is(response?.error?.title, 'Disabled')
  })

  test('handle options.chat.id = undefined', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: {
        id: undefined,
        secret: config.chat.secret,
      },
      env: 'test',
    })
    const response = await pn('hello world', 'INFO')
    t.is(response?.error?.title, 'MissingChatId')
  })

  test('handle options.chat.secret = undefined', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: {
        id: config.chat.id,
        secret: undefined,
      },
      env: 'test',
    })
    const response = await pn('hello world', 'INFO')
    t.is(response?.error?.title, 'MissingChatSecret')
  })

  test('handle options.chat = undefined', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: undefined,
      env: 'test',
    })
    const response = await pn('hello world', 'INFO')
    t.is(response?.error?.title, 'MissingChatObject')
  })

  test('handle text being an object', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn({ i: 'am an object' }, 'INFO')
    t.is(response?.error?.title, 'TextMustBeString')
  })

  test('handle namespace being an object', async (t) => {
    const pn = pnotice({ i: 'am an object' }, {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('hello world', 'INFO')
    t.is(response?.error?.title, 'NamespaceMustBeString')
  })

  test('handle level and optionsInner sent', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('handle level and optionsInner sent', 'WARNING', { silent: true })
    t.is(response?.status, 'ok')
  })

  test('handle no level but optionsInner (with level) as second argument', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('handle no level but optionsInner (with level) as second argument', { level: 'TESTING', silent: true })
    t.is(response?.status, 'ok')
  })

  test('handle no level but optionsInner as second argument', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('handle no level but optionsInner as second argument', { silent: true })
    t.is(response?.status, 'ok')
  })

  test('handle successfully sent', async (t) => {
    const pn = pnotice('pntest', {
      disabled: false,
      debug: true,
      chat: config.chat,
      env: 'test',
    })
    const response = await pn('handle successfully sent', 'INFO')
    t.is(response?.status, 'ok')
  })
}
