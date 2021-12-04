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

import Ftp4es6 from "./ftp4es6.js";

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    let ftp4es6 = new Ftp4es6();
    console.log("platform=" + device.platform);
    console.log("dataDirectory=" + cordova.file.dataDirectory);
    switch (device.platform) {
        case "Android":
            ftp4es6.isConnected();
            ftp4es6.setSecurity("FTPES", "TLSv1")
                .then(() => ftp4es6.connect('192.168.0.150', 'anonymous', 'anonymous@'))
                .then(() => ftp4es6.isConnected())
                .then(() => ftp4es6.download(cordova.file.dataDirectory + '/A.txt', '/pub/A1.txt'))
                .then(() => ftp4es6.upload(cordova.file.dataDirectory + '/A.txt', '/pub/A2.txt'))
                .finally(() => ftp4es6.disconnect());
            break;
        case "iOS":
            ftp4es6.connect('192.168.0.150', 'anonymous', 'anonymous@')
                .then(() => ftp4es6.download(cordova.file.dataDirectory + '/A.txt', '/pub/A1.txt'))
                .then(() => ftp4es6.upload(cordova.file.dataDirectory + '/A.txt', '/pub/A2.txt'))
                .finally(() => ftp4es6.disconnect());
            break;
        default:
            break;
    }
}
