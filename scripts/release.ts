import Git from 'simple-git'

// NOTE: Makes sure that the release is going to the `release` branch for the possibility to easily redeploy from there.

const git = Git()

const hash = await git.revparse(['main'])

console.log('Checkout release branch')
await git.checkout('release')

console.log(`Reset to main branch (${hash})`)
await git.reset(['--hard', hash])

console.log('Push to release branch')
await git.push(['--force'])

console.log('Checkout main branch')
await git.checkout('main')

console.log('Push Tags')
await git.push(['--tags'])

console.log('Push Main Branch')
await git.push()
