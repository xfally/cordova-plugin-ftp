/**
 * @interface
 * */
export interface window {
    cordova : {
        plugin : {
            ftp: Ftp
        }
    }
}
/**
 * @interface
 * */
export interface Ftp {
    /**
     * @param {string} hostname
     * @param {string} username
     * @param {string} password
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    connect (hostname:string, username:string, password:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {string} path
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    ls(path:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {string} path
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    mkdir(path:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {string} file
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    rm(file:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {string} localFile
     * @param {string} remoteFile
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    upload(localFile:string, remoteFile:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {string} localFile
     * @param {string} remoteFile
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    download(localFile:string, remoteFile:string, successCallback?:Function, errorCallback?:Function):never;
    /**
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    cancel(successCallback?:Function, errorCallback?:Function):never;
}
/**
 *
 * */
declare var cordova : {
    plugin: {
        ftp : Ftp
    }
};