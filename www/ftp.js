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

var exec = require('cordova/exec');

/**
 * Ftp class
 * @constructor
 */
function Ftp() {
}

Ftp.prototype.init = function(hostname, username, password, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "setupManager",
         [hostname, username, password]);
};

Ftp.prototype.ls = function(path, successCallback, errorCallback) {
    exec(function(ok) {
            if (ok instanceof Array) {
                successCallback(ok);
            }
         },
         errorCallback,
         "Ftp",
         "list",
         [path]);
};

Ftp.prototype.mkdir = function(path, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "createDirectory",
         [path]);
};

Ftp.prototype.rmdir = function(path, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "deleteDirectory",
         [path]);
};

Ftp.prototype.rm = function(file, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "deleteFile",
         [file]);
};

Ftp.prototype.upload = function(localFile, remoteFile, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "uploadFile",
         [localFile, remoteFile]);
};

Ftp.prototype.download = function(localFile, remoteFile, successCallback, errorCallback) {
    exec(successCallback,
         errorCallback,
         "Ftp",
         "downloadFile",
         [localFile, remoteFile]);
};

module.exports = new Ftp();
