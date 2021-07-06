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

    // TIP: Refer to `ftp.js` for more api info.
    // Set connection security type if needed.
    window.cordova.plugin.ftp.setSecurity("ftpes", "TLSv1", (result) => {
        console.info("ftp: setSecurity result=" + result);
        // Connect to ftp server address without protocol prefix.
        window.cordova.plugin.ftp.connect('192.168.3.77', 'anonymous', 'anonymous@', (result) => {
            console.info("ftp: connect result=" + result);
            // Then, You can do any ftp actions from now on...
            // Try upload...
            window.cordova.plugin.ftp.upload('/data/data/io.github.xfally.cordova.plugin.ftp.test/test/A.txt', '/pub/A1.txt', (percent) => {
                if (percent == 1) {
                    console.debug("ftp: upload percent=100%");
                    console.info("ftp: upload finish");
                    // Try download...
                    window.cordova.plugin.ftp.download('/data/data/io.github.xfally.cordova.plugin.ftp.test/test/C1.zip', '/pub/C.zip', (percent) => {
                        if (percent == 1) {
                            console.debug("ftp: download percent=100%");
                            console.info("ftp: download finish");
                        } else {
                            console.debug("ftp: download percent=" + percent * 100 + "%");
                        }
                    }, (error) => {
                        console.error("ftp: download error=" + error);
                    });
                } else {
                    console.debug("ftp: upload percent=" + percent * 100 + "%");
                }
            }, (error) => {
                console.error("ftp: upload error=" + error);
            });
        }, (error) => {
            console.error("ftp: connect error=" + error);
        });
    }, (error) => {
        console.error("ftp: setSecurity error=" + error);
    });
}
