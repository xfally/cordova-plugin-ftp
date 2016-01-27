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
			if (fileList && fileList.length > 0) {
				console.log("The last file'name is " + fileList[fileList.length - 1].kCFFTPResourceName);
			}
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

- Refer to [ftp.js](https://github.com/xfally/cordova-plugin-ftp/blob/master/www/ftp.js) for more js API info.
- Refer to [Apple CF doc](https://developer.apple.com/library/mac/documentation/CoreFoundation/Reference/CFFTPStreamRef/index.html#//apple_ref/doc/uid/TP40003359-CH3-205971) for all available file fields, e.g. `kCFFTPResourceName`, `kCFFTPResourceType`... But notice that `kCFFTPResourceModDate` is **excluded** currently as one json convert bug.
- Refer to [Apple dirent doc](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man5/dirent.5.html) for all available file type `kCFFTPResourceType`.

	```c
	#define DT_UNKNOWN       0
	#define DT_FIFO          1
	#define DT_CHR           2
	#define DT_DIR           4	// directory. It's shown as `d` with linux cmd `ls -l`.
	#define DT_BLK           6
	#define DT_REG           8	// regular file, e.g. txt, png, mov... it's shown as `-` with linux cmd `ls -l`.
	#define DT_LNK          10
	#define DT_SOCK         12
	#define DT_WHT          14
	```

## Thanks

The iOS native implementing is based on [GoldRaccoon](https://github.com/albertodebortoli/GoldRaccoon).

