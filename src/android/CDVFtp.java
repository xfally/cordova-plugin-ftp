/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

package io.github.xfally.cordova.plugin.ftp;

import android.util.Log;

import it.sauronsoftware.ftp4j.*;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/**
 * Cordova plugin ftp
 *
 * @author pax
 */
public class CDVFtp extends CordovaPlugin {
    private static final String TAG = CDVFtp.class.getSimpleName();
    private static final String OK = "OK";
    private static final String ANONY_USERNAME = "anonymous";
    private static final String ANONY_PASSWORD = "anonymous@";
    private static final String ERROR_NO_ARG_LOCALPATH = "Expected one non-empty arg localPath!";
    private static final String ERROR_NO_ARG_REMOTEPATH = "Expected one non-empty arg remotePath!";
    private static final String FILE_SEPARATOR = "/";
    private static final String ROOT_PATH = "/";
    private final FTPClient client = new FTPClient();
    private String address;

    @Override
    public void onReset() {
        Log.d(TAG, "onReset...");
        try {
            cancelAllRequests();
        } catch (IOException | FTPIllegalReplyException e) {
            Log.e(TAG, "onReset: fail: " + e.getMessage());
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        Log.d(TAG, "execute: action=" + action);
        try {
            switch (action) {
                case "setSecurity":
                    callbackContext.success(setSecurity(args.getString(0), args.getString(1)));
                    break;
                case "connect":
                    callbackContext.success(connect(args.getString(0), args.getString(1), args.getString(2)));
                    break;
                case "list":
                    callbackContext.success(list(args.getString(0)));
                    break;
                case "createDirectory":
                    callbackContext.success(createDirectory(args.getString(0)));
                    break;
                case "deleteDirectory":
                    callbackContext.success(deleteDirectory(args.getString(0)));
                    break;
                case "deleteFile":
                    callbackContext.success(deleteFile(args.getString(0)));
                    break;
                case "uploadFile":
                    cordova.getThreadPool().execute(() -> {
                        Log.d(TAG, "execute: Created new thread to execute uploadFile...");
                        try {
                            callbackContext.success(uploadFile(args.getString(0), args.getString(1), callbackContext));
                        } catch (Exception e) {
                            callbackContext.error(e.toString());
                        }
                    });
                    break;
                case "downloadFile":
                    cordova.getThreadPool().execute(() -> {
                        Log.d(TAG, "execute: Created new thread to execute downloadFile...");
                        try {
                            callbackContext
                                    .success(downloadFile(args.getString(0), args.getString(1), callbackContext));
                        } catch (Exception e) {
                            callbackContext.error(e.toString());
                        }
                    });
                    break;
                case "cancelAllRequests":
                    callbackContext.success(cancelAllRequests());
                    break;
                case "disconnect":
                    callbackContext.success(disconnect());
                    break;
                default:
                    Log.e(TAG, "execute: Failed to exec action/cmd: " + action + ", which is not found or supported!");
                    return false;
            }
        } catch (Exception e) {
            callbackContext.error(e.toString());
        }
        Log.d(TAG, "execute: Succeed to exec action/cmd: " + action);
        return true;
    }

    private String setSecurity(String ftpsType, String protocol) {
        Log.d(TAG, "setSecurity: ftpsType=" + ftpsType + ", protocol=" + protocol);
        // process ftps type
        int securityType;
        if (ftpsType == null || ftpsType.length() == 0 || "default".equalsIgnoreCase(ftpsType)) {
            securityType = 2;
        } else {
            ftpsType = ftpsType.toUpperCase();
            switch (ftpsType) {
                case "FTP":
                    securityType = 0;
                    break;
                case "FTPS":
                    securityType = 1;
                    break;
                case "FTPES":
                    securityType = 2;
                    break;
                default:
                    ftpsType = "FTPES";
                    securityType = 2;
                    break;
            }
        }
        client.setSecurity(securityType);
        // process cert and protocol
        if (protocol == null || protocol.length() == 0 || "default".equalsIgnoreCase(protocol)) {
            protocol = "TLS";
        }
        // trust every certificate given by the remote host
        TrustManager[] trustManager = new TrustManager[] { new X509TrustManager() {
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {
            }
        } };
        SSLContext sslContext = null;
        try {
            sslContext = SSLContext.getInstance(protocol);
            sslContext.init(null, trustManager, new SecureRandom());
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new CDVFtpException(e.toString());
        }
        SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();
        client.setSSLSocketFactory(sslSocketFactory);
        Log.i(TAG, "setSecurity: Set ftp security type to: " + ftpsType + ", protocol=" + protocol);
        return OK;
    }

    private String connect(String address, String username, String password)
            throws FTPException, IOException, FTPIllegalReplyException {
        Log.d(TAG, "connect: address=" + address + ", username=" + username + ", password=***");
        if (client.isConnected()) {
            return OK;
        }
        if (address == null || address.length() == 0) {
            throw new CDVFtpException("Expected one non-empty arg hostname!");
        }
        if (username == null && password == null) {
            username = ANONY_USERNAME;
            password = ANONY_PASSWORD;
        }
        String[] addressSplit = address.split(":");
        if (addressSplit.length == 2) {
            String host = addressSplit[0];
            int port = Integer.parseInt(addressSplit[1]);
            client.connect(host, port);
        } else {
            client.connect(address);
        }
        client.login(username, password);
        Log.i(TAG, "connect: Succeed to connect and login: " + address);
        this.address = address;
        return OK;
    }

    private JSONArray list(String remotePath) throws FTPException, IOException, FTPIllegalReplyException,
            FTPAbortedException, FTPDataTransferException, FTPListParseException, JSONException {
        Log.d(TAG, "list: remotePath=" + remotePath);
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        if (!remotePath.endsWith(FILE_SEPARATOR)) {
            remotePath = remotePath.concat(FILE_SEPARATOR);
        }
        client.changeDirectory(remotePath);
        FTPFile[] list = client.list();
        JSONArray fileList = new JSONArray();
        for (FTPFile file : list) {
            String name = file.getName();
            int type = file.getType();
            String link = file.getLink();
            long size = file.getSize();
            Date modifiedDate = file.getModifiedDate();
            String modifiedDateString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss zzz", Locale.getDefault())
                    .format(modifiedDate);
            String jsonStr = "{" + "name:\"" + name + "\",type:" + type + ",link:\"" + link + "\",size:" + size
                    + ",modifiedDate:\"" + modifiedDateString + "\"}";
            JSONObject jsonObj = new JSONObject(jsonStr);
            fileList.put(jsonObj);
        }
        Log.d(TAG, "list: Succeed to list directory (" + remotePath + "):\n" + fileList);
        return fileList;
    }

    private String createDirectory(String remotePath) throws FTPException, IOException, FTPIllegalReplyException {
        Log.d(TAG, "createDirectory: remotePath=" + remotePath);
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        if (!remotePath.endsWith(FILE_SEPARATOR)) {
            remotePath = remotePath.concat(FILE_SEPARATOR);
        }
        client.changeDirectory(ROOT_PATH);
        client.createDirectory(remotePath);
        Log.i(TAG, "createDirectory: Succeed to create directory:" + remotePath);
        return OK;
    }

    private String deleteDirectory(String remotePath) throws FTPException, IOException, FTPIllegalReplyException {
        Log.d(TAG, "deleteDirectory: remotePath=" + remotePath);
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        if (!remotePath.endsWith(FILE_SEPARATOR)) {
            remotePath = remotePath.concat(FILE_SEPARATOR);
        }
        client.changeDirectory(ROOT_PATH);
        client.deleteDirectory(remotePath);
        Log.i(TAG, "deleteDirectory: Succeed to delete directory: " + remotePath);
        return OK;
    }

    private String deleteFile(String remotePath) throws FTPException, IOException, FTPIllegalReplyException {
        Log.d(TAG, "deleteFile: remotePath=" + remotePath);
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        client.changeDirectory(ROOT_PATH);
        client.deleteFile(remotePath);
        Log.i(TAG, "deleteFile: Succeed to delete file: " + remotePath);
        return OK;
    }

    private String uploadFile(String localPath, String remotePath, CallbackContext callbackContext)
            throws FTPException, IOException, FTPIllegalReplyException, FTPDataTransferException, FTPAbortedException {
        Log.d(TAG, "uploadFile: localPath=" + localPath + ", remotePath=" + remotePath);
        if (localPath == null || localPath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_LOCALPATH);
        }
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        String remoteParentPath = remotePath.substring(0, remotePath.lastIndexOf(FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FILE_SEPARATOR) + 1);
        client.changeDirectory(remoteParentPath);
        File file = new File(localPath);
        try (InputStream in = new FileInputStream(file)) {
            long size = file.length();
            // refer to CDVFtpTransferListener for transfer percent and completed
            client.upload(remoteFileName, in, 0, 0, new CDVFtpTransferListener(size, callbackContext));
            Log.i(TAG, "uploadFile: Succeed to upload local file: " + localPath + ", to remote: " + remotePath);
            return OK;
        }
    }

    private String downloadFile(String localPath, String remotePath, CallbackContext callbackContext)
            throws FTPException, IOException, FTPIllegalReplyException, FTPAbortedException, FTPDataTransferException,
            FTPListParseException {
        Log.d(TAG, "downloadFile: localPath=" + localPath + ", remotePath=" + remotePath);
        if (localPath == null || localPath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_LOCALPATH);
        }
        if (remotePath == null || remotePath.length() == 0) {
            throw new CDVFtpException(ERROR_NO_ARG_REMOTEPATH);
        }
        String remoteParentPath = remotePath.substring(0, remotePath.lastIndexOf(FILE_SEPARATOR) + 1);
        String remoteFileName = remotePath.substring(remotePath.lastIndexOf(FILE_SEPARATOR) + 1);
        client.changeDirectory(remoteParentPath);
        FTPFile[] list = client.list();
        for (FTPFile file : list) {
            String name = file.getName();
            if (remoteFileName.equals(name)) {
                long size = file.getSize();
                // refer to CDVFtpTransferListener for transfer percent and completed
                client.download(remoteFileName, new File(localPath), new CDVFtpTransferListener(size, callbackContext));
                Log.i(TAG, "downloadFile: Succeed to download remote file: " + remotePath + ", to local: " + localPath);
                return OK;
            }
        }
        throw new CDVFtpException("downloadFile: Could not find remote file: " + remotePath);
    }

    private String cancelAllRequests() throws IOException, FTPIllegalReplyException {
        Log.d(TAG, "cancelAllRequests...");
        // arg `true` to perform a legal abort procedure (an `ABOR` command is sent to
        // the server),
        // arg `false` to abruptly close the transfer without advice.
        client.abortCurrentDataTransfer(true);
        Log.i(TAG, "cancelAllRequests: Succeed to cancel current data transfer.");
        return OK;
    }

    private String disconnect() throws FTPException, IOException, FTPIllegalReplyException {
        Log.d(TAG, "disconnect: address=" + this.address);
        // arg `true` to perform a legal disconnect procedure (an `QUIT` command is sent
        // to the server),
        // arg `false` to break the connection without advice.
        client.disconnect(true);
        Log.i(TAG, "disconnect: Succeed to disconnect.");
        return OK;
    }
}

class CDVFtpException extends RuntimeException {
    public CDVFtpException(String message) {
        super(message);
    }
}

class CDVFtpTransferListener implements FTPDataTransferListener {
    private static final String TAG = CDVFtpTransferListener.class.getSimpleName();
    private final CallbackContext callbackContext;
    private final long totalSize;
    private long curSize = 0;
    private PluginResult pluginResult = null;

    public CDVFtpTransferListener(long size, CallbackContext callbackContext) {
        this.totalSize = size;
        this.callbackContext = callbackContext;
    }

    @Override
    public void started() {
        // Transfer started
        Log.i(TAG, "Transfer started.");
        this.curSize = 0;
    }

    @Override
    public void transferred(int length) {
        // Yet other length bytes has been transferred since the last time this method
        // was called
        this.curSize += length;
        float percent = (float) this.curSize / (float) this.totalSize;
        Log.d(TAG, "Transferred, totalSize=" + this.totalSize + ", curSize=" + this.curSize + ", percent=" + percent);
        // Tip: just return if percent < 1, to prevent js:successCallback() invoked
        // twice, as completed() will also return 1.
        if (percent >= 0 && percent < 1) {
            this.pluginResult = new PluginResult(PluginResult.Status.OK, percent);
            this.pluginResult.setKeepCallback(true);
            this.callbackContext.sendPluginResult(this.pluginResult);
        }
    }

    @Override
    public void completed() {
        // Transfer completed
        Log.i(TAG, "Transfer completed.");
        this.pluginResult = new PluginResult(PluginResult.Status.OK, 1);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }

    @Override
    public void aborted() {
        // Transfer aborted
        Log.w(TAG, "Transfer aborted!");
        this.pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }

    @Override
    public void failed() {
        // Transfer failed
        Log.e(TAG, "Transfer failed!");
        this.pluginResult = new PluginResult(PluginResult.Status.ERROR);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }
}
