## Preparation

Follow [these instructions](https://www.electronjs.org/docs/development/build-instructions-gn)
to clone and prepare electron.

I included the following file to get the environment setup via `source source-me`

```sh
#!/bin/bash

# from https://www.electronjs.org/docs/development/build-instructions-gn

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

export PATH=$DIR/depot_tools:$PATH
export GIT_CACHE_PATH="${HOME}/.git_cache"
mkdir -p "${GIT_CACHE_PATH}"

export CHROMIUM_BUILDTOOLS_PATH=$DIR/electron/src/buildtools
```

### Make Build Truly Debuggable

#### electron/build/args/debug.gn  
```sh
import("all.gn")
is_debug = true            # <-- this is important
is_component_build = false
is_component_ffmpeg = true
is_official_build = false
dcheck_always_on = true
symbol_level = 1           # <-- changing symbol_level did not work 

# This may be guarded behind is_chrome_branded alongside
# proprietary_codecs https://webrtc-review.googlesource.com/c/src/+/36321,
# explicitly override here to build OpenH264 encoder/FFmpeg decoder.
# The initialization of the decoder depends on whether ffmpeg has
# been built with H.264 support.
rtc_use_h264 = proprietary_codecs
```

### Build in Debug MODULE

```sh
gn gen out/debug --args="import(\"//electron/build/args/debug.gn\") $GN_EXTRA_ARGS"
```

## Debug Session

### Export module to debug
```
➝  export MODULE=/Volumes/d/dev/cy/bugs/electron-worker-threads-sigabrt/index.js
```

### Launch lldb

```sh
/Volumes/d/dev/cy/electron/electron/src
➝  lldb -- out/debug/Electron.app/Contents/MacOS/Electron $MODULE
```

### Load Python Plugin to Improve Symbols

```lldb
(lldb) script sys.path[:0] = ['/Volumes/d/dev/cy/electron/electron/src/tools/lldb']
(lldb) script import lldbinit
```

### Run App Which Crashes with Full Stack Trace
```lldb
(lldb) r
Process 83683 launched: '/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/MacOS/Electron' (x86_64)
2020-06-09 15:22:48.381161-0600 Electron Helper (GPU)[83737:419410] GVA info: preferred scaler idx 1
[parent]        calling process.exit

undefined:0


illegal access
Thrown at:
/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/MacOS/Electron[83696]: ../../third_party/electron_node/src/node_platform.cc:467:std::shared_ptr<PerIsolatePlatformData> node::NodePlatform::ForIsolate(v8::Isolate *): Assertion `data' failed.
 1: 0x117bd3a0e node::DumpBacktrace(__sFILE*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 2: 0x117cd88eb node::Abort() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 3: 0x117cd84a6 node::Assert(node::AssertionInfo const&) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 4: 0x117dd9268 node::NodePlatform::ForIsolate(v8::Isolate*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 5: 0x117dd9784 node::NodePlatform::GetForegroundTaskRunner(v8::Isolate*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 6: 0x10a1f0394 node::inspector::MainThreadInterface::Post(std::__1::unique_ptr<node::inspector::Request, std::__1::default_delete<node::inspector::Request> >) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 7: 0x10a1f1b27 node::inspector::MainThreadHandle::Post(std::__1::unique_ptr<node::inspector::Request, std::__1::default_delete<node::inspector::Request> >) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 8: 0x10a2123a1 node::inspector::ParentInspectorHandle::~ParentInspectorHandle() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
 9: 0x10a212445 node::inspector::ParentInspectorHandle::~ParentInspectorHandle() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
10: 0x117c779ab std::__1::default_delete<node::inspector::ParentInspectorHandle>::operator()(node::inspector::ParentInspectorHandle*) const [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
11: 0x117c7792d std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::reset(node::inspector::ParentInspectorHandle*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
12: 0x117c778b9 std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::~unique_ptr() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
13: 0x117c72df5 std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::~unique_ptr() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
14: 0x117eb5660 node::inspector::Agent::~Agent() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
15: 0x117eb56e5 node::inspector::Agent::~Agent() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
16: 0x117c22e8b std::__1::default_delete<node::inspector::Agent>::operator()(node::inspector::Agent*) const [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
17: 0x117bfd80d std::__1::unique_ptr<node::inspector::Agent, std::__1::default_delete<node::inspector::Agent> >::reset(node::inspector::Agent*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
18: 0x117bfc87d node::Environment::~Environment() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
19: 0x117bfddc5 node::Environment::~Environment() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
20: 0x117bfddec node::Environment::~Environment() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
21: 0x117b8e024 node::FreeEnvironment(node::Environment*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
22: 0x117e38bf9 node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))>::operator()(node::Environment*) const [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
23: 0x117e30c1d std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::reset(node::Environment*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
24: 0x117e388d9 std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::~unique_ptr() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
25: 0x117e30f45 std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::~unique_ptr() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
26: 0x117e308d3 node::worker::Worker::Run() [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
27: 0x117e35c9e node::worker::Worker::StartThread(v8::FunctionCallbackInfo<v8::Value> const&)::$_2::operator()(void*) const [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
28: 0x117e35c35 node::worker::Worker::StartThread(v8::FunctionCallbackInfo<v8::Value> const&)::$_2::__invoke(void*) [/Volumes/d/dev/cy/electron/electron/src/out/debug/Electron.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework]
29: 0x7fff6d5db109 _pthread_start [/usr/lib/system/libsystem_pthread.dylib]
30: 0x7fff6d5d6b8b thread_start [/usr/lib/system/libsystem_pthread.dylib]
Received signal 6
0   Electron Framework                  0x000000010b6b9e5f base::debug::CollectStackTrace(void**, unsigned long) + 31
1   Electron Framework                  0x000000010b3fc9eb base::debug::StackTrace::StackTrace(unsigned long) + 75
2   Electron Framework                  0x000000010b3fca6d base::debug::StackTrace::StackTrace(unsigned long) + 29
3   Electron Framework                  0x000000010b3fca48 base::debug::StackTrace::StackTrace() + 40
4   Electron Framework                  0x000000010b6b9d01 base::debug::(anonymous namespace)::StackDumpSignalHandler(int, __siginfo*, void*) + 1409
5   libsystem_platform.dylib            0x00007fff6d5cf5fd _sigtramp + 29
6   Electron Framework                  0x0000000119bb6000 v8_crdtp::json::(anonymous namespace)::kBase64Table + 8066576
7   libsystem_c.dylib                   0x00007fff6d4a5808 abort + 120
8   Electron Framework                  0x0000000117cd88ff node::Abort() + 47
9   Electron Framework                  0x0000000117cd84a6 node::Assert(node::AssertionInfo const&) + 214
10  Electron Framework                  0x0000000117dd9268 node::NodePlatform::ForIsolate(v8::Isolate*) + 200
11  Electron Framework                  0x0000000117dd9784 node::NodePlatform::GetForegroundTaskRunner(v8::Isolate*) + 68
12  Electron Framework                  0x000000010a1f0394 node::inspector::MainThreadInterface::Post(std::__1::unique_ptr<node::inspector::Request, std::__1::default_delete<node::inspector::Request> >) + 244
13  Electron Framework                  0x000000010a1f1b27 node::inspector::MainThreadHandle::Post(std::__1::unique_ptr<node::inspector::Request, std::__1::default_delete<node::inspector::Request> >) + 151
14  Electron Framework                  0x000000010a2123a1 node::inspector::ParentInspectorHandle::~ParentInspectorHandle() + 113
15  Electron Framework                  0x000000010a212445 node::inspector::ParentInspectorHandle::~ParentInspectorHandle() + 21
16  Electron Framework                  0x0000000117c779ab std::__1::default_delete<node::inspector::ParentInspectorHandle>::operator()(node::inspector::ParentInspectorHandle*) const + 43
17  Electron Framework                  0x0000000117c7792d std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::reset(node::inspector::ParentInspectorHandle*) + 109
18  Electron Framework                  0x0000000117c778b9 std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::~unique_ptr() + 25
19  Electron Framework                  0x0000000117c72df5 std::__1::unique_ptr<node::inspector::ParentInspectorHandle, std::__1::default_delete<node::inspector::ParentInspectorHandle> >::~unique_ptr() + 21
20  Electron Framework                  0x0000000117eb5660 node::inspector::Agent::~Agent() + 128
21  Electron Framework                  0x0000000117eb56e5 node::inspector::Agent::~Agent() + 21
22  Electron Framework                  0x0000000117c22e8b std::__1::default_delete<node::inspector::Agent>::operator()(node::inspector::Agent*) const + 43
23  Electron Framework                  0x0000000117bfd80d std::__1::unique_ptr<node::inspector::Agent, std::__1::default_delete<node::inspector::Agent> >::reset(node::inspector::Agent*) + 109
24  Electron Framework                  0x0000000117bfc87d node::Environment::~Environment() + 285
25  Electron Framework                  0x0000000117bfddc5 node::Environment::~Environment() + 21
26  Electron Framework                  0x0000000117bfddec node::Environment::~Environment() + 28
27  Electron Framework                  0x0000000117b8e024 node::FreeEnvironment(node::Environment*) + 52
28  Electron Framework                  0x0000000117e38bf9 node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))>::operator()(node::Environment*) const + 25
29  Electron Framework                  0x0000000117e30c1d std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::reset(node::Environment*) + 109
30  Electron Framework                  0x0000000117e388d9 std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::~unique_ptr() + 25
31  Electron Framework                  0x0000000117e30f45 std::__1::unique_ptr<node::Environment, node::FunctionDeleter<node::Environment, &(node::FreeEnvironment(node::Environment*))> >::~unique_ptr() + 21
32  Electron Framework                  0x0000000117e308d3 node::worker::Worker::Run() + 4851
33  Electron Framework                  0x0000000117e35c9e _ZZN4node6worker6Worker11StartThreadERKN2v820FunctionCallbackInfoINS2_5ValueEEEENK3$_2clEPv + 94
34  Electron Framework                  0x0000000117e35c35 _ZZN4node6worker6Worker11StartThreadERKN2v820FunctionCallbackInfoINS2_5ValueEEEEN3$_28__invokeEPv + 21
35  libsystem_pthread.dylib             0x00007fff6d5db109 _pthread_start + 148
36  libsystem_pthread.dylib             0x00007fff6d5d6b8b thread_start + 15
[end of stack trace]
[wrapper]       process exited with code: null signal: SIGABRT
2020-06-09 15:22:51.051751-0600 Electron Helper (GPU)[83842:419808] GVA info: preferred scaler idx 1
```
