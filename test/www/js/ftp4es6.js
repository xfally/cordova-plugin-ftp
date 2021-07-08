/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

// ES6 encapsulation example.
// Refer to `ftp.js` for more api info.

class Ftp4es6 {
    constructor() {
        console.debug("Ftp4es6: constructor...");
    }

    setSecurity(ftpsType, protocol) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.setSecurity(ftpsType, protocol, (result) => {
                console.info("Ftp4es6: setSecurity result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: setSecurity error=" + error);
                reject(error);
            });
        });
    }

    connect(address, username, password) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.connect(address, username, password, (result) => {
                console.info("Ftp4es6: connect result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: connect error=" + error);
                reject(error);
            });
        });
    }

    ls(remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.ls(remotePath, (fileList) => {
                console.info("Ftp4es6: ls fileList=" + fileList);
                resolve(fileList);
            }, (error) => {
                console.error("Ftp4es6: ls error=" + error);
                reject(error);
            });
        });
    }

    mkdir(remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.mkdir(remotePath, (result) => {
                console.info("Ftp4es6: mkdir result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: mkdir error=" + error);
                reject(error);
            });
        });
    }

    rmdir(remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.rmdir(remotePath, (result) => {
                console.info("Ftp4es6: rmdir result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: rmdir error=" + error);
                reject(error);
            });
        });
    }

    rm(remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.rm(remotePath, (result) => {
                console.info("Ftp4es6: rm result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: rm error=" + error);
                reject(error);
            });
        });
    }

    upload(localPath, remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.upload(localPath, remotePath, (percent) => {
                if (percent == 1) {
                    console.debug("Ftp4es6: upload percent=100%");
                    console.info("Ftp4es6: upload finish");
                    resolve(percent);
                } else {
                    console.debug("Ftp4es6: upload percent=" + percent * 100 + "%");
                }
            }, (error) => {
                console.error("Ftp4es6: upload error=" + error);
                reject(error);
            });
        });
    }

    download(localPath, remotePath) {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.download(localPath, remotePath, (percent) => {
                if (percent == 1) {
                    console.debug("Ftp4es6: download percent=100%");
                    console.info("Ftp4es6: download finish");
                    resolve(percent);
                } else {
                    console.debug("Ftp4es6: download percent=" + percent * 100 + "%");
                }
            }, (error) => {
                console.error("Ftp4es6: download error=" + error);
                reject(error);
            });
        });
    }

    cancel() {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.cancel((result) => {
                console.info("Ftp4es6: cancel result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: cancel error=" + error);
                reject(error);
            });
        });
    }

    disconnect() {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.disconnect((result) => {
                console.info("Ftp4es6: disconnect result=" + result);
                resolve(result);
            }, (error) => {
                console.error("Ftp4es6: disconnect error=" + error);
                reject(error);
            });
        });
    }

    isConnected() {
        return new Promise(function (resolve, reject) {
            cordova.plugin.ftp.isConnected((result) => {
                console.info("Ftp4es6: isConnected result=" + result);
                if ("TRUE" == result) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }, (error) => {
                console.error("Ftp4es6: isConnected error=" + error);
                reject(error);
            });
        });
    }
}

export default Ftp4es6;
