# cordova-plugin-ftp

## Description

This cordova plugin is created to use ftp (client) in web/js.

Support both **iOS** and **Android** platform now.

You can do the following things:

- List a directory
- Create a directory
- Delete a directory (must be empty)
- Delete a file
- Download a file (with percent info)
- Upload a file (with percent info)
- Cancel upload/download

## Installation

```sh
$ cordova plugin add cordova-plugin-ftp
$ cordova prepare
```

Dependency:

- For iOS, the plugin depends on *CFNetwork.framework*, which has been added to plugin.xml (and `cordova prepare` will add it to platform project), so you don't need to do anything.
- But for Android, it depends on *com.android.support:support-v4:23.2.0*, which should be added to your platform project by hand.

## Usage

You can access this plugin by js object `window.cordova.plugin.ftp`.

Refer to [test](./test/) (include [ftp4es6.js](./test/www/js/ftp4es6.js) to show ES6 encapsulation) for usage example.

Refer to [ftp.js](./www/ftp.js) for all available APIs and usages.

This plugin has been tested with:

- Cordova 10.0
- Android 10.0 API 29 (built by Android Studio 4.1.1)
- iOS 7.0+ (built by Xcode 9.0)
- Ftp server: vsftpd 3.0.3

## Notice

1. For iOS, `ftp.connect` will always succeed (even if `username` and `password` are incorrect), but it does NOT mean the later actions, e.g. `ls`... `download` will succeed too! So always check their `errorCallback`.
2. Want to upload/download multiple files? The plugin (Android part) inits just one connection and transmits all files via it. If you use asychronous syntax (e.g. `foreach`) to start multiple upload/download in a short time, it may mess the transfer. Instead, you can try [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [async](https://github.com/caolan/async) to transmit one after one.

## Thanks

- The iOS native implementing is based on [GoldRaccoon](https://github.com/albertodebortoli/GoldRaccoon).
- The Android native implementing is based on [ftp4j](http://www.sauronsoftware.it/projects/ftp4j/) jar (LGPL).

## License

Apache License 2.0. Refer to [LICENSE.md](./LICENSE.md) for more info.

