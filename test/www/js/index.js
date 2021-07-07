/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    setSecurity("ftpes", "TLSv1")
        .then(() => connect('192.168.3.77', 'anonymous', 'anonymous@'))
        .then(() => upload('/data/data/io.github.xfally.cordova.plugin.ftp.test/test/A.txt', '/pub/A1.txt'))
        .then(() => download('/data/data/io.github.xfally.cordova.plugin.ftp.test/test/A2.txt', '/pub/A1.txt'))
        .finally(() => disconnect());
}

// ES6 encapsulation example.
// TIP: Refer to `ftp.js` for more api info.
function setSecurity(ftpsType, protocol) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.setSecurity(ftpsType, protocol, (result) => {
            console.info("ftp: setSecurity result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: setSecurity error=" + error);
            reject(error);
        });
    });
}

function connect(address, username, password) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.connect(address, username, password, (result) => {
            console.info("ftp: connect result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: connect error=" + error);
            reject(error);
        });
    });
}

function ls(remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.ls(remotePath, (fileList) => {
            console.info("ftp: ls fileList=" + fileList);
            resolve(fileList);
        }, (error) => {
            console.error("ftp: ls error=" + error);
            reject(error);
        });
    });
}

function mkdir(remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.mkdir(remotePath, (result) => {
            console.info("ftp: mkdir result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: mkdir error=" + error);
            reject(error);
        });
    });
}

function rmdir(remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.rmdir(remotePath, (result) => {
            console.info("ftp: rmdir result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: rmdir error=" + error);
            reject(error);
        });
    });
}

function rm(remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.rm(remotePath, (result) => {
            console.info("ftp: rm result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: rm error=" + error);
            reject(error);
        });
    });
}

function upload(localPath, remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.upload(localPath, remotePath, (percent) => {
            if (percent == 1) {
                console.debug("ftp: upload percent=100%");
                console.info("ftp: upload finish");
                resolve(percent);
            } else {
                console.debug("ftp: upload percent=" + percent * 100 + "%");
            }
        }, (error) => {
            console.error("ftp: upload error=" + error);
            reject(error);
        });
    });
}

function download(localPath, remotePath) {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.download(localPath, remotePath, (percent) => {
            if (percent == 1) {
                console.debug("ftp: download percent=100%");
                console.info("ftp: download finish");
                resolve(percent);
            } else {
                console.debug("ftp: download percent=" + percent * 100 + "%");
            }
        }, (error) => {
            console.error("ftp: download error=" + error);
            reject(error);
        });
    });
}

function cancel() {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.cancel((result) => {
            console.info("ftp: cancel result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: cancel error=" + error);
            reject(error);
        });
    });
}

function disconnect() {
    return new Promise(function (resolve, reject) {
        cordova.plugin.ftp.disconnect((result) => {
            console.info("ftp: disconnect result=" + result);
            resolve(result);
        }, (error) => {
            console.error("ftp: disconnect error=" + error);
            reject(error);
        });
    });
}
