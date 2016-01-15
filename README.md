# cordova-plugin-ftp

## Description

This cordova plugin is created to use ftp in web/js.

Just support iOS platform now, but I will support Android platform soon.

## Installation

```sh
$ cordova plugin add https://github.com/xfally/cordova-plugin-ftp
$ cordova prepare
```

It has not added to npm registry yet.

## Usage

```js
if (window.ftp) {
	window.ftp.init("192.168.1.1", "anonymous", "anonymous@", function() {
		window.ftp.ls("/one/ftp/path/", function(fileList) {
			console.log(fileList);
		});
		// do some other things...
		window.ftp.mkdir("/one/ftp/path/newPath", function() {
			window.ftp.upload("/one/local/path/localFile.txt", "/one/ftp/path/newPath/remoteFile.txt", function(percent) {
				if (percent == 1) {
					console.log("upload finished.");
				} else {
					console.log("upload percent = " + percent * 100 + "%");
				}
			})
		})
	});
}
```

Refer to ftp.js for more API info.

## Thanks

The iOS native implementing is based on [GoldRaccoon](https://github.com/albertodebortoli/GoldRaccoon).

