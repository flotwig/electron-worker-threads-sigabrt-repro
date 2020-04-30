electron-worker-threads-sigabrt
===

Demonstration of an issue with exiting Electron with worker_threads active.

With `node index.js` (Node 12.13.0):

```
[parent]        calling process.exit
[parent]        worker exited
[wrapper]       process exited with code: 2 signal: null
```

With `electron index.js` (Electron 8.2.4, bundles Node 12.13.0)

```
[parent]        calling process.exit
.../dist/electron ./parent.js[13467]: ../../third_party/electron_node/src/node_worker.cc:384:virtual node::worker::Worker::~Worker(): Assertion `stopped_' failed.
[wrapper]       process exited with code: null signal: SIGABRT
```

For some reason, exiting with a worker thread active causes a SIGABRT when the parent process tries to exit.

This can be worked around by calling `worker.terminate()` and waiting for it to resolve before calling `process.exit`.
