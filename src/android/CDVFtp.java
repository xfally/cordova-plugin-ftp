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
import it.sauronsoftware.ftp4j.FTPClient;
import it.sauronsoftware.ftp4j.FTPDataTransferListener;
import it.sauronsoftware.ftp4j.FTPFile;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Cordova plugin ftp
 *
 * @author pax
 */
public class CDVFtp extends CordovaPlugin {
    private static final String NO_ARG_LOCALPATH = "Expected one non-empty arg localPath.";
    private static final String NO_ARG_REMOTEPATH = "Expected one non-empty arg remotePath.";
    private static final String FILE_SEPARATOR = "/";
    private static final String ROOT_PATH = "/";
    private FTPClient client = null;

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) {
        switch (action) {
            case "setSecurity":
                cordova.getThreadPool().execute(() -> {
                    try {
                        setSecurity(args.getString(0), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "connect":
                cordova.getThreadPool().execute(() -> {
                    try {
                        connect(args.getString(0), args.getString(1), args.getString(2), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "list":
                cordova.getThreadPool().execute(() -> {
                    try {
                        list(args.getString(0), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "createDirectory":
                cordova.getThreadPool().execute(() -> {
                    try {
                        createDirectory(args.getString(0), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "deleteDirectory":
                cordova.getThreadPool().execute(() -> {
                    try {
                        deleteDirectory(args.getString(0), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "deleteFile":
                cordova.getThreadPool().execute(() -> {
                    try {
                        deleteFile(args.getString(0), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "uploadFile":
                cordova.getThreadPool().execute(() -> {
                    try {
                        uploadFile(args.getString(0), args.getString(1), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "downloadFile":
                cordova.getThreadPool().execute(() -> {
                    try {
                        downloadFile(args.getString(0), args.getString(1), callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "cancelAllRequests":
                cordova.getThreadPool().execute(() -> {
                    try {
                        cancelAllRequests(callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            case "disconnect":
                cordova.getThreadPool().execute(() -> {
                    try {
                        disconnect(callbackContext);
                    } catch (Exception e) {
                        callbackContext.error(e.toString());
                    }
                });
                break;
            default:
                // This action/cmd is not found/supported
                return false;
        }
        // This action/cmd is found/supported
        return true;
    }

    private void setSecurity(String ftpsType, CallbackContext callbackContext) {
        if (ftpsType == null || ftpsType.length() == 0) {
            callbackContext.error("Expected one non-empty arg ftpsType.");
        } else {
            ftpsType = ftpsType.toUpperCase();
            int securityType = 0;
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
                    break;
            }
            try {
                this.client.setSecurity(securityType);
                callbackContext.success("Set ftp security type OK");
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void connect(String address, String username, String password, CallbackContext callbackContext) {
        if (address == null || address.length() == 0) {
            callbackContext.error("Expected one non-empty arg hostname.");
        } else {
            if (username == null && password == null) {
                username = "anonymous";
                password = "anonymous@";
            }

            try {
                this.client = new FTPClient();
                String[] addressSplit = address.split(":");
                if (addressSplit.length == 2) {
                    String host = addressSplit[0];
                    int port = Integer.parseInt(addressSplit[1]);
                    this.client.connect(host, port);
                } else {
                    this.client.connect(address);
                }
                this.client.login(username, password);
                callbackContext.success("Connect and login OK.");
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void list(String remotePath, CallbackContext callbackContext) {
        if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            if (!remotePath.endsWith(FILE_SEPARATOR)) {
                remotePath = remotePath.concat(FILE_SEPARATOR);
            }

            try {
                this.client.changeDirectory(remotePath);
                FTPFile[] list = client.list();
                JSONArray fileList = new JSONArray();
                for (FTPFile file : list) {
                    String name = file.getName();
                    Number type = file.getType();
                    String link = file.getLink();
                    Number size = file.getSize();
                    Date modifiedDate = file.getModifiedDate();
                    String modifiedDateString = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss zzz", Locale.getDefault()).format(modifiedDate);
                    String jsonStr = "{" + "name:\"" + name + "\",type:" + type + ",link:\"" + link + "\",size:" + size
                        + ",modifiedDate:\"" + modifiedDateString + "\"}";
                    JSONObject jsonObj = new JSONObject(jsonStr);
                    fileList.put(jsonObj);
                }
                callbackContext.success(fileList);
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void createDirectory(String remotePath, CallbackContext callbackContext) {
        if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            if (!remotePath.endsWith(FILE_SEPARATOR)) {
                remotePath = remotePath.concat(FILE_SEPARATOR);
            }

            try {
                this.client.changeDirectory(ROOT_PATH);
                this.client.createDirectory(remotePath);
                callbackContext.success("Create directory OK");
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void deleteDirectory(String remotePath, CallbackContext callbackContext) {
        if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            if (!remotePath.endsWith(FILE_SEPARATOR)) {
                remotePath = remotePath.concat(FILE_SEPARATOR);
            }

            try {
                this.client.changeDirectory(ROOT_PATH);
                this.client.deleteDirectory(remotePath);
                callbackContext.success("Delete directory OK");
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void deleteFile(String remotePath, CallbackContext callbackContext) {
        if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            try {
                this.client.changeDirectory(ROOT_PATH);
                this.client.deleteFile(remotePath);
                callbackContext.success("Delete file OK");
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void uploadFile(String localPath, String remotePath, CallbackContext callbackContext) {
        if (localPath == null || localPath.length() == 0) {
            callbackContext.error(NO_ARG_LOCALPATH);
        } else if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            try {
                String remoteParentPath = remotePath.substring(0, remotePath.lastIndexOf('/') + 1);
                String remoteFileName = remotePath.substring(remotePath.lastIndexOf('/') + 1);
                this.client.changeDirectory(remoteParentPath);
                File file = new File(localPath);
                try (InputStream in = new FileInputStream(file)) {
                    long size = file.length();
                    client.upload(remoteFileName, in, 0, 0, new CDVFtpTransferListener(size, callbackContext));
                }
                // refer to CDVFtpTransferListener for transfer percent and completed
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void downloadFile(String localPath, String remotePath, CallbackContext callbackContext) {
        if (localPath == null || localPath.length() == 0) {
            callbackContext.error(NO_ARG_LOCALPATH);
        } else if (remotePath == null || remotePath.length() == 0) {
            callbackContext.error(NO_ARG_REMOTEPATH);
        } else {
            try {
                String remoteParentPath = remotePath.substring(0, remotePath.lastIndexOf('/') + 1);
                String remoteFileName = remotePath.substring(remotePath.lastIndexOf('/') + 1);
                this.client.changeDirectory(remoteParentPath);
                FTPFile[] list = client.list();
                for (FTPFile file : list) {
                    String name = file.getName();
                    Number size = file.getSize();
                    if (remoteFileName.equals(name)) {
                        client.download(remoteFileName, new File(localPath),
                            new CDVFtpTransferListener(size.longValue(), callbackContext));
                        // refer to CDVFtpTransferListener for transfer percent and completed
                        return;
                    }
                }
                // should never reach here!
            } catch (Exception e) {
                callbackContext.error(e.toString());
            }
        }
    }

    private void cancelAllRequests(CallbackContext callbackContext) {
        try {
            // `true` to perform a legal abort procedure (an `ABOR` command is sent to the
            // server),
            // `false` to abruptly close the transfer without advice.
            this.client.abortCurrentDataTransfer(true);
            callbackContext.success("Cancel OK.");
        } catch (Exception e) {
            callbackContext.error(e.toString());
        }
    }

    private void disconnect(CallbackContext callbackContext) {
        try {
            // `true` to perform a legal disconnect procedure (an `QUIT` command is sent to
            // the server),
            // `false` to break the connection without advice.
            this.client.disconnect(true);
            callbackContext.success("Disconnect OK.");
        } catch (Exception e) {
            callbackContext.error(e.toString());
        }
    }
}

class CDVFtpTransferListener implements FTPDataTransferListener {
    public static final String TAG = CDVFtpTransferListener.class.getSimpleName();
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
        Log.i(TAG, "Transfer started");
        this.curSize = 0;
    }

    @Override
    public void transferred(int length) {
        // Yet other length bytes has been transferred since the last time this
        // method was called
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
        Log.i(TAG, "Transfer completed");
        this.pluginResult = new PluginResult(PluginResult.Status.OK, 1);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }

    @Override
    public void aborted() {
        // Transfer aborted
        Log.w(TAG, "Transfer aborted");
        this.pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }

    @Override
    public void failed() {
        // Transfer failed
        Log.e(TAG, "Transfer failed");
        this.pluginResult = new PluginResult(PluginResult.Status.ERROR);
        this.pluginResult.setKeepCallback(false);
        this.callbackContext.sendPluginResult(this.pluginResult);
    }
}
