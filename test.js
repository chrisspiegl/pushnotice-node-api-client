import test from 'ava'
import pnotice from '.'

// TODO: find a way to load config.chat from file?

console.log('Test file currently being run:', test.meta.file)

test('handle options.disabled = true', async (t) => {
  const pn = pnotice('pntest', {
    disabled: true,
    debug: true,
    chat: config.chat,
    env: 'test',
  })
  t.is((await pn('hello world', 'INFO'))?.error?.title, 'Disabled')
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
  t.is((await pn('hello world', 'INFO'))?.error?.title, 'MissingChatId')
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
  t.is((await pn('hello world', 'INFO'))?.error?.title, 'MissingChatSecret')
})

test('handle options.chat = undefined', async (t) => {
  const pn = pnotice('pntest', {
    disabled: false,
    debug: true,
    chat: undefined,
    env: 'test',
  })
  t.is((await pn('hello world', 'INFO'))?.error?.title, 'MissingChatObject')
})

test('handle text being an object', async (t) => {
  const pn = pnotice('pntest', {
    disabled: false,
    debug: true,
    chat: config.chat,
    env: 'test',
  })
  t.is((await pn({ i: 'am an object' }, 'INFO'))?.error?.title, 'TextMustBeString')
})

test('handle namespace being an object', async (t) => {
  const pn = pnotice({ i: 'am an object' }, {
    disabled: false,
    debug: true,
    chat: config.chat,
    env: 'test',
  })
  t.is((await pn('hello world', 'INFO'))?.error?.title, 'NamespaceMustBeString')
})

test('handle successfully sent', async (t) => {
  const pn = pnotice('pntest', {
    disabled: false,
    debug: true,
    chat: config.chat,
    env: 'test',
  })
  t.is((await pn('hello world', 'INFO'))?.success, true)
})
