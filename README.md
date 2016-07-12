# cordova-plugin-ftp

## Description

This cordova plugin is created to use ftp (client) in web/js.

Support both **iOS** and **Android** platform now.

You can do the following:

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

- For iOS, the plugin depends on *CFNetwork.framework*, which has been added to plugin.xml (and `cordova prepare` will add it to platfrom project), so you don't need to do anything.
- But for Android, it depends on *com.android.support:support-v4:23.2.0*, which should be added to your platfrom project (e.g. in Android Studio) by hand.

## Usage

You can access this plugin by js object `window.cordova.plugin.ftp`.

**DEMO**

```js
// Test code (for angularjs|ionic|cordova)
$scope.data = {
	ftp: {
		ADDRESS: '192.168.1.1',
		USERNAME: 'anonymous',
		PASSWORD: 'anonymous@',
		HOME_PATH: '/remotePath/'
	},
	remote: {
		PATH: '/remotePath/testDir/'
	},
	local: {
		FILE: '/localPath/test.mp4'
	}
};

$scope.action = {
	testFtp: function() {
		var FTP = {
			ADDRESS: $scope.data.ftp.ADDRESS,
			USERNAME: $scope.data.ftp.USERNAME,
			PASSWORD: $scope.data.ftp.PASSWORD,
			HOME_PATH: $scope.data.ftp.HOME_PATH
		};
		var localFile = $scope.data.local.FILE;
		var localFile1 = localFile + '.1';
		var remotePath = $scope.data.remote.PATH;
		if (remotePath.substr(-1) != '/') {
			remotePath += '/';
		}
		var remoteFile = remotePath + localFile.substr(localFile.lastIndexOf('/') + 1);
		$log.debug("xtest: remotePath is " + remotePath);
		$log.debug("xtest: remoteFile is " + remoteFile);
		$log.debug("xtest: localFile is " + localFile);
		$log.debug("xtest: localFile1 is " + localFile1);
		// Tip: Usually init/create $window.cordova.plugin.ftp will take some time.
		//      We should listen `deviceready` event for cordova, or `$ionicPlatform.ready()` for ionic.
		//      You can find more info in official docs of cordova or ionic.
		$ionicPlatform.ready(function() {
			if ($window.cordova && $window.cordova.plugin && $window.cordova.plugin.ftp) {
				$log.info("xtest: ftp: plugin ready");
				// 1. connect to one ftp server, then you can do any actions/cmds
				$window.cordova.plugin.ftp.connect(FTP.ADDRESS, FTP.USERNAME, FTP.PASSWORD, function() {
					$log.info("xtest: ftp: connect ok");
					// 2. list one dir, note that just can be dir, not file
					$window.cordova.plugin.ftp.ls(FTP.HOME_PATH, function(fileList) {
						$log.info("xtest: ftp: list ok");
						if (fileList && fileList.length > 0) {
							$log.debug("xtest: ftp: The last file'name is " + fileList[fileList.length - 1].name);
							$log.debug("xtest: ftp: The last file'type is " + fileList[fileList.length - 1].type);
							$log.debug("xtest: ftp: The last file'link is " + fileList[fileList.length - 1].link);
							$log.debug("xtest: ftp: The last file'size is " + fileList[fileList.length - 1].size);
							$log.debug("xtest: ftp: The last file'modifiedDate is " + fileList[fileList.length - 1].modifiedDate);
							// 3. create one dir on ftp server
							$window.cordova.plugin.ftp.mkdir(remotePath, function(ok) {
								$log.info("xtest: ftp: mkdir ok=" + ok);
								// 4. upload localFile to remote (you can rename at the same time). arg1: localFile, arg2: remoteFile.
								// - make sure you can ACCESS and READ the localFile.
								// - (for iOS) if localFile not exists, a blank remoteFile will be created on ftp server.
								// - if a same named remoteFile exists on ftp server, it will be overrided!
								$window.cordova.plugin.ftp.upload(localFile, remoteFile, function(percent) {
									if (percent == 1) {
										$log.info("xtest: ftp: upload finish");
										// 4a. cancel download after some time
										//$timeout(function() {
										//$window.cordova.plugin.ftp.cancel(function(ok) {
										//$log.info("xtest: ftp: cancel ok=" + ok);
										//}, function(error) {
										//$log.error("xtest: ftp: cancel error=" + error);
										//});
										//}, 2000);
										// 5. download remoteFile to local (you can rename at the same time). arg1: localFile, arg2: remoteFile.
										// - make sure you can ACCESS and WRITE the local dir.
										// - if one same named localFile exists, it will be overrided!
										$window.cordova.plugin.ftp.download(localFile1, remoteFile, function(percent) {
											if (percent == 1) {
												$log.info("xtest: ftp: download finish");
												// 6. delete one file on ftp server
												$window.cordova.plugin.ftp.rm(remoteFile, function(ok) {
													$log.info("xtest: ftp: rm ok=" + ok);
													// 7. delete one dir on ftp server, fail if it's not an empty dir
													$window.cordova.plugin.ftp.rmdir(remotePath, function(ok) {
														$log.info("xtest: ftp: rmdir ok=" + ok);
													}, function(error) {
														$log.error("xtest: ftp: rmdir error=" + error);
													});
												}, function(error) {
													$log.error("xtest: ftp: rm error=" + error);
												});
											} else {
												$log.debug("xtest: ftp: download percent=" + percent * 100 + "%");
											}
										}, function(error) {
											$log.error("xtest: ftp: download error=" + error);
										});
									} else {
										$log.debug("xtest: ftp: upload percent=" + percent * 100 + "%");
									}
								}, function(error) {
									$log.error("xtest: ftp: upload error=" + error);
								});
							}, function(error) {
								$log.error("xtest: ftp: mkdir error=" + error);
							});
						}
					}, function(error) {
						$log.error("xtest: ftp: list error: " + error);
					});
				});
			} else {
				$log.error("xtest: ftp: plugin not found!");
			}
		});
	}
}
```

Refer to [ftp.js](https://github.com/xfally/cordova-plugin-ftp/blob/master/www/ftp.js) for more js API info.

## Notice

For iOS, `ftp.connect` will always success (even if `username` and `password` are incorrect), but it does NOT mean the later actions, e.g. `ls`... `download` will success too! So check their `errorCallback` carefully.

## TODO

Implement `ftp.disconnect` or `ftp.reconnect` later, to fix "too much connect from this client...".

## Thanks

- The iOS native implementing is based on [GoldRaccoon](https://github.com/albertodebortoli/GoldRaccoon).
- The Android native implementing is based on [ftp4j](http://www.sauronsoftware.it/projects/ftp4j/) jar (LGPL).

