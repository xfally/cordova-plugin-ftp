// Usage demo (for angularjs|ionic|cordova)

$scope.data = {
	ftp: {
		ADDRESS: '192.168.1.1', // domain name is also supported, e.g. 'one.two.com'
		USERNAME: 'anonymous',
		PASSWORD: 'anonymous@',
		HOME_PATH: '/remotePath/' // any ftp start path you want, e.g. '/', '/myFtpHome/'...
	},
	remote: {
		PATH: '/remotePath/testDir/' // the dir for mkdir test, e.g. '/myFtpHome/testDir/'. Must start with root path '/', instead of 'file://'.
	},
	local: {
		FILE: '/localPath/test.mp4' // the file for upload test, e.g. '/tmp/test.mp4'. Must start with root path '/', instead of 'file://'.
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
		var localFileCopy = localFile + '.copy'; // one copy of `localFile`, for download test
		var remotePath = $scope.data.remote.PATH;
		if (remotePath.substr(-1) != '/') {
			remotePath += '/';
		}
		var remoteFile = remotePath + localFile.substr(localFile.lastIndexOf('/') + 1); // `remoteFile`, uploaded from `localFile`
		$log.debug("xtest: remotePath is " + remotePath);
		$log.debug("xtest: remoteFile is " + remoteFile);
		$log.debug("xtest: localFile is " + localFile);
		$log.debug("xtest: localFileCopy is " + localFileCopy);

		// Caution: Usually init/create $window.cordova.plugin.ftp will take some time.
		// We should listen `deviceready` event for cordova, or `$ionicPlatform.ready()` for ionic.
		// You can find more info in official docs of cordova or ionic.
		$ionicPlatform.ready(function() {
			if ($window.cordova && $window.cordova.plugin && $window.cordova.plugin.ftp) {
				$log.info("xtest: ftp: plugin ready");

				// 1. Connect to one ftp server, then you can do any actions/cmds
				$window.cordova.plugin.ftp.connect(FTP.ADDRESS, FTP.USERNAME, FTP.PASSWORD, function(ok) {
					$log.info("xtest: ftp: connect ok=" + ok);

					// 2. List one dir, note that it can just be dir, not file
					$window.cordova.plugin.ftp.ls(FTP.HOME_PATH, function(fileList) {
						$log.info("xtest: ftp: list ok");
						if (fileList && fileList.length > 0) {
							$log.debug("xtest: ftp: the last file'name is " + fileList[fileList.length - 1].name);
							$log.debug("xtest: ftp: the last file'type is " + fileList[fileList.length - 1].type);
							$log.debug("xtest: ftp: the last file'link is " + fileList[fileList.length - 1].link);
							$log.debug("xtest: ftp: the last file'size is " + fileList[fileList.length - 1].size);
							$log.debug("xtest: ftp: the last file'modifiedDate is " + fileList[fileList.length - 1].modifiedDate);
						} else {
							$log.debug("xtest: ftp: no files");
						}

						// 3. Create one dir on ftp server, fail if a same named dir exists
						$window.cordova.plugin.ftp.mkdir(remotePath, function(ok) {
							$log.info("xtest: ftp: mkdir ok=" + ok);

							// 4. Upload localFile to remote (you can rename at the same time). arg1: localFile, arg2: remoteFile
							// - make sure you can ACCESS and READ the localFile.
							// - (for iOS) if localFile dose not exist or accessible, a blank remoteFile will be created on ftp server.
							// - if a same named remoteFile exists on ftp server, it will be overrided!
							$window.cordova.plugin.ftp.upload(localFile, remoteFile, function(percent) {
								if (percent == 1) {
									$log.info("xtest: ftp: upload finish");

									// 5. Download remoteFile to local (you can rename at the same time). arg1: localFile, arg2: remoteFile
									// - make sure you can ACCESS and WRITE the local dir.
									// - if a same named localFile exists, it will be overrided!
									$window.cordova.plugin.ftp.download(localFileCopy, remoteFile, function(percent) {
										if (percent == 1) {
											$log.info("xtest: ftp: download finish");

											// 6. Delete one file on ftp server
											$window.cordova.plugin.ftp.rm(remoteFile, function(ok) {
												$log.info("xtest: ftp: rm ok=" + ok);

												// 7. Delete one dir on ftp server, fail if it's not an empty dir
												$window.cordova.plugin.ftp.rmdir(remotePath, function(ok) {
													$log.info("xtest: ftp: rmdir ok=" + ok);

													// 8. Disconnect from ftp server explicitly
													$window.cordova.plugin.ftp.disconnect(function(ok) {
														$log.info("xtest: ftp: disconnect ok=" + ok);
													}, function(error) {
														$log.error("xtest: ftp: disconnect error=" + error);
													});

												}, function(error) {
													$log.error("xtest: ftp: rmdir error=" + error);
												});
											}, function(error) {
												$log.error("xtest: ftp: rm error=" + error);
											});
										} else {
											$log.debug("xtest: ftp: download percent=" + percent * 100 + "%");

											// 5a. Cancel download if needed
											//if (percent >= 0.5) {
											//	$window.cordova.plugin.ftp.cancel(function(ok) {
											//		$log.info("xtest: ftp: cancel ok=" + ok);
											//	}, function(error) {
											//		$log.error("xtest: ftp: cancel error=" + error);
											//	});
											//}
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
					}, function(error) {
						$log.error("xtest: ftp: list error=" + error);
					});
				}, function(error) {
					$log.error("xtest: ftp: connect error=" + error);
				});
			} else {
				$log.error("xtest: ftp: plugin not found!");
			}
		});
	}
}
