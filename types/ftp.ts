/**
 * This package requires Lodash, @angular/core and RXjs
 * */
import {Injectable} from "@angular/core";
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";

/**
 * @interface
 * */
export interface FtpInterface {
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
     * @param {string} file
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    rmdir(file:string, successCallback?:Function, errorCallback?:Function):never;
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
    /**
     * @param {function} successCallback
     * @param {function} errorCallback
     * @return {void}
     * */
    disconnect(successCallback?:Function, errorCallback?:Function):never;
}
/**
 *
 * */
export declare var cordova : {
    plugin: {
        ftp : FtpInterface
    }
};

/**
 * @constructor
 * */
@Injectable()
export class Ftp
{
    /**
     * Check if cordova.plugin.ftp is available
     *
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          // cordova.plugin.ftp is availible
     *      }, () => {
     *          // cordova.plugin.ftp is not availible
     *      )
     *  }
     * ```
     * @return {Promise<any>}
     * */
    public static isAvailible ():Promise<any>
    {
        return new Promise((reject, resolve) => {
            if (_.has(window, 'cordova.plugin.ftp')) resolve();
            reject();
        })
    }
    /**
     * Returns trailing name component of path
     *
     * @return {string}
     * */
    public static basename (path:string, suffix?:string):string
    {
        let b = path, lastChar = b.charAt(b.length - 1);
        if (lastChar === '/' || lastChar === '\\') b = b.slice(0, -1);
        b = b.replace(/^.*[/\\]/g, '');
        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) b = b.substr(0, b.length - suffix.length);
        return b
    }
    /**
     * Returns a parent directory's path
     *
     * @param {string} path - Full path
     * @return {string}
     * */
    public static dirname (path:string):string
    {
        return path.replace(/\\/g, '/').replace(/\/[^/]*\/?$/, '')
    }
    /**
     * Connect to the target server
     *
     * @param {string} hostname - Hostname or IP
     * @param {string} username
     * @param {string} password
     * @return {Promise<any>}
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              // connected
     *          })
     *      })
     *  }
     * ```
     * */
    public static connect (hostname:string, username:string, password:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.connect(hostname, username, password, (response:any) => resolve(response), (err:any) => reject(err));
        });
    }
    /**
     * Upload file from local to remote server
     *
     * @param {string} local - Local path
     * @param {string} remote - Remote path
     * @return {Promise<any>}
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.upload('file.zip', '/var/www/file.zip').then(() => {
     *                  // success
     *              })
     *          })
     *      })
     *  }
     * */
    public static upload (local:string, remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.upload(local, remote, (percentage:any) => {
                if (percentage == 1) resolve();
            }, (err:any) => reject(err))
        })
    }
    /**
     * Upload file from local to remote server
     *
     * @param {string} local - Local path
     * @param {string} remote - Remote path
     * @return {Observable<any>}
     *  @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.upload('file.zip', '/var/www/file.zip', true).subscribe((percentage:number) => {
     *                  // progress: percentage %
     *              },
     *              error => {
     *                  // error
     *              },
     *              () => {
     *                  // end
     *              })
     *          })
     *      })
     *  }
     * */
    public static uploadWithProgress (local:string, remote:string):Observable<any>
    {
        return new Observable((observer:Subscriber<any>) => {
            cordova.plugin.ftp.upload(local, remote, (percentage:any) => {
                if (percentage == 1) {
                    observer.next(percentage);
                    observer.complete();
                }
                else observer.next(percentage);
            }, (err:any) => observer.error(err))
        });
    }
    /**
     * @param {string} local - Local path
     * @param {string} remote - Remote path
     * @return {Promise<any>}
     *
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.download('file.zip', '/var/www/file.zip').then(() => {
     *                  // success
     *              })
     *          })
     *      })
     *  }
     * */
    public static download (local:string, remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.download(local, remote, (percentage:any) => {
                if (percentage == 1) resolve();
            } , (err:any) => reject(err))
        })
    }
    /**
     * @param {string} local - Local path
     * @param {string} remote - Remote path
     * @return {Observable<any>}
     *  @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.download('file.zip', '/var/www/file.zip', true).subscribe((percentage:number) => {
     *                  // progress: percentage %
     *              },
     *              error => {
     *                  // error
     *              },
     *              () => {
     *                  // end
     *              })
     *          })
     *      })
     *  }
     * */
    public static downloadWithProgress (local:string, remote:string):Observable<any>
    {
        return new Observable((observer:Subscriber<any>) => {
            cordova.plugin.ftp.download(local, remote, (percentage:any) => {
                if (percentage == 1) {
                    observer.next(percentage);
                    observer.complete();
                }
                else observer.next(percentage);
            }, (err:any) => observer.error(err))
        });
    }
    /**
     * @param {string} remote - Remote path
     * @param {boolean} recursive - Recursive mode: If it set as True, it can remove directories and files
     * @return {Promise<any>}
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.remove('/var/www/file.zip').then(() => {
     *                  // success
     *              })
     *          })
     *      })
     *  }
     * @example
     * ```
     *  constructor (private ftp:Ftp) {
     *      this.ftp.isAvailible().then(() => {
     *          this.ftp.connect('localhost', 'username', password'').then(() => {
     *              this.ftp.remove('/var/www/', true).then(() => {
     *                  // success
     *              })
     *          })
     *      })
     *  }
     * */
    public static rm (remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.rm(remote, (success:any) => resolve(success), (err:any) => reject(err))
        });
    }
    /**
     * @param {string} remote - Remote path
     * @return {Promise<any>}
     * */
    public static rmdir (remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.rmdir(remote, (success:any) => resolve(success), (err:any) => reject(err))
        });
    }
    /**
     * @param {string} remote - Remote path
     * @return {Promise<any>}
     * */
    public static ls(remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.ls(remote, (success:any) => resolve(success), (err:any) => reject(err));
        })
    }
    /**
     * @param {string} remote - Remote path
     * @return {Promise<any>}
     * */
    public static mkdir(remote:string):Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.mkdir(remote, (success:any) => resolve(success), (err:any) => reject(err));
        });
    }
    /**
     * @return {Promise<any>}
     * */
    public static cancel():Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.cancel((success:any) => resolve(success), (err:any) => reject(err))
        });
    }
    /**
     * @return {Promise<any>}
     * */
    public static disconnect():Promise<any>
    {
        return new Promise((resolve, reject) => {
            cordova.plugin.ftp.disconnect((success:any) => resolve(success), (err:any) => reject(err))
        });
    }
}
