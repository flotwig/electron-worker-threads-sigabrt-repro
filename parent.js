const { Worker } = require('worker_threads')

// create a worker for this filename
new Worker(__filename)
.on('exit', () => {
  console.log('[parent]\tworker exited')
})

// exit with failing exit code after 1 second
setTimeout(() => {
  console.log('[parent]\tcalling process.exit')
  process.exit(2)
}, 1000)
