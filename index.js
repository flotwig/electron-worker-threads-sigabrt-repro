const { spawnSync } = require('child_process')

// this is a little wrapper that will let us see the signal and exit code the parent exits with

const { signal, status } = spawnSync(process.execPath, ['./parent.js'], { stdio: 'inherit' })

console.log(`[wrapper]\tprocess exited with code: ${status} signal: ${signal}`)
