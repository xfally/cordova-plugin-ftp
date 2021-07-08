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

/*
 * Util to remove path protocol prefix.
 */
function removePathProtocolPrefix(path) {
    if (path.indexOf("file://") === 0) {
        return path.substring(7);
    } else if (path.indexOf("file:") === 0) {
        return path.substring(5);
    } else {
        return path;
    }
}

/**
 * Ftp class
 * @constructor
 */
function Ftp() {
    console.debug("Ftp: constructor...");
}

/**
 * Set the security type for the connection.
 *
 * Notice:
 * - This method is only supported for Android.
 * - This method should be called before starting a connection.
 *
 * @param {string} ftpsType The ftp security type. Accept these values below:
 *                          - "ftp": FTP security level (the default value).
 *                          - "ftps": FTPS (FTP over implicit TLS/SSL) security level.
 *                          - "ftpes": FTPES (FTP over explicit TLS/SSL) security level.
 * @param {string} protocol The ftp protocol. Default value is "TLS" if pass arg "default" or empty string.
 *                          Accept these values: `SSL`, `SSLv2`, `SSLv3`, `TLS`, `TLSv1`, `TLSv1.1`, `TLSv1.2`.
 *                          More info: https://docs.oracle.com/javase/8/docs/technotes/guides/security/StandardNames.html#SSLContext
 * @param {function} successCallback The success callback. If triggered, means success.
 * @param {function} errorCallback The error callback. If triggered, means init fail.
 */
Ftp.prototype.setSecurity = function (ftpsType, protocol, successCallback, errorCallback) {
    console.debug("Ftp: setSecurity: ftpsType=" + ftpsType + ", protocol=" + protocol);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "setSecurity", [ftpsType, protocol]);
}

/**
 * Connect to one ftp server.
 *
 * Just need to init the connection once. If success, you can do any ftp actions later.
 *
 * @param {string} address The ftp server address. The address without protocol prefix (e.g. "192.168.1.1:21", "ftp.xfally.github.io").
 *                         Notice:
 *                         - The address port is only supported for Android.
 *                         - If the port not given explicitly, the default port 21 (or 990 if FTPS) will be used.
 * @param {string} username The ftp login username. If both `username` and `password` are empty, the default username "anonymous" will be used.
 * @param {string} password The ftp login password. If both `username` and `password` are empty, the default password "anonymous@" will be used.
 * @param {function} successCallback The success callback.
 *                                   Notice: For iOS, if triggered, means init success, but NOT means the later action (e.g. `ls`... `download`) will success!
 * @param {function} errorCallback The error callback. If triggered, means fail.
 */
Ftp.prototype.connect = function (address, username, password, successCallback, errorCallback) {
    console.debug("Ftp: connect: address=" + address + ", username=" + username + ", password=***");
    exec(successCallback,
        errorCallback,
        "Ftp",
        "connect", [address, username, password]);
}

/**
 * List files (with info of `name`, `type`, `link`, `size`, `modifiedDate`) under one dir on the ftp server.
 *
 * You can get one file's name using `fileList[x].name` (`x` is the location in the array).
 *
 * Explain file property:
 * - name: The file name (utf-8).
 * - type: The file type. number `0` means regular file, `1` means dir, `2` means symbolic link, `-1` means unknown type (maybe block/char dev...).
 * - link: If the file is a symbolic link, then this field stores symbolic link information (utf-8), else it's an empty string.
 * - size: The file size in bytes.
 * - modifiedDate: The modified date of this file. Format is `yyyy-MM-dd HH:mm:ss zzz` (e.g. "2015-12-01 20:45:00 GMT+8").
 *
 * @param {string} remotePath The dir (with full path) on the ftp server (e.g. "/path/to/remoteDir/").
 * @param {function} successCallback The success callback, invoked with arg `{array} fileList`.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.ls = function (remotePath, successCallback, errorCallback) {
    console.debug("Ftp: ls: remotePath=" + remotePath);
    exec(function (fileList) {
            if (fileList instanceof Array) {
                successCallback(fileList);
            }
        },
        errorCallback,
        "Ftp",
        "list", [removePathProtocolPrefix(remotePath)]);
}

/**
 * Create one dir on the ftp server.
 *
 * @param {string} remotePath The dir (with full path) you want to create (e.g. "/path/to/remoteDir/").
 * @param {function} successCallback The success callback.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.mkdir = function (remotePath, successCallback, errorCallback) {
    console.debug("Ftp: mkdir: remotePath=" + remotePath);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "createDirectory", [removePathProtocolPrefix(remotePath)]);
}

/**
 * Delete one dir on the ftp server.
 *
 * Notice: As many ftp server could not rm dir when it's not empty, so always recommended to `rm` all files under the dir at first before `rmdir`.
 *
 * @param {string} remotePath The dir (with full path) you want to delete (e.g. "/path/to/remoteDir/").
 * @param {function} successCallback The success callback.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.rmdir = function (remotePath, successCallback, errorCallback) {
    console.debug("Ftp: rmdir: remotePath=" + remotePath);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "deleteDirectory", [removePathProtocolPrefix(remotePath)]);
}

/**
 * Delete one file on the ftp server.
 *
 * @param {string} remotePath The file (with full path) you want to delete (e.g. "/path/to/remoteFile").
 * @param {function} successCallback The success callback.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.rm = function (remotePath, successCallback, errorCallback) {
    console.debug("Ftp: rm: remotePath=" + remotePath);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "deleteFile", [removePathProtocolPrefix(remotePath)]);
}

/**
 * Upload one local file to the ftp server.
 *
 * @param {string} localPath The file (with full path) you want to upload from the local device (e.g. "/path/to/localFile").
 * @param {string} remotePath The file (with full path) you want to create on the ftp server (e.g. "/path/to/remoteFile").
 *                            As you see, "localFile" can be renamed to "remoteFile".
 * @param {function} successCallback The success callback. It will be triggered many times according the file's size.
 *                                   The arg `0`, `0.11..`, `0.23..` ... `1` means the upload percent. When it reaches `1`, means finished.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.upload = function (localPath, remotePath, successCallback, errorCallback) {
    console.debug("Ftp: upload: localPath=" + localPath + ", remotePath=" + remotePath);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "uploadFile", [removePathProtocolPrefix(localPath), removePathProtocolPrefix(remotePath)]);
}

/**
 * Download one remote file on the ftp server to local path.
 *
 * @param {string} localPath The file (with full path) you want to create in the local device (e.g. "/path/to/localFile").
 * @param {string} remotePath The file (with full path) you want to download from the ftp server (e.g. "/path/to/remoteFile").
 *                            As you see, "remoteFile" can be renamed to "localFile".
 * @param {function} successCallback The success callback. It will be triggered many times according the file's size.
 *                                   The arg `0`, `0.11..`, `0.23..` ... `1` means the download percent. When it reaches `1`, means finished.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.download = function (localPath, remotePath, successCallback, errorCallback) {
    console.debug("Ftp: download: localPath=" + localPath + ", remotePath=" + remotePath);
    exec(successCallback,
        errorCallback,
        "Ftp",
        "downloadFile", [removePathProtocolPrefix(localPath), removePathProtocolPrefix(remotePath)]);
}

/**
 * Cancel all requests. Always success.
 *
 * @param {function} successCallback The success callback.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.cancel = function (successCallback, errorCallback) {
    console.debug("Ftp: cancel...");
    exec(successCallback,
        errorCallback,
        "Ftp",
        "cancelAllRequests", []);
}

/**
 * Disconnect from ftp server.
 *
 * @param {function} successCallback The success callback.
 * @param {function} errorCallback The error callback.
 */
Ftp.prototype.disconnect = function (successCallback, errorCallback) {
    console.debug("Ftp: disconnect...");
    exec(successCallback,
        errorCallback,
        "Ftp",
        "disconnect", []);
}

/**
 * Is connected?
 *
 * @param {function} successCallback The success callback, invoked with arg string `TRUE` or `FALSE`.
 * @param {function} errorCallback The error callback.
 */
 Ftp.prototype.isConnected = function (successCallback, errorCallback) {
    console.debug("Ftp: judge isConnected...");
    exec(successCallback,
        errorCallback,
        "Ftp",
        "isConnected", []);
}

module.exports = new Ftp();
