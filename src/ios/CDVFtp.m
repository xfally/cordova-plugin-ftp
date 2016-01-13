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

#import "GRRequestsManager.h"
#import "CDVFtp.h"

@interface CDVFtp () <GRRequestsManagerDelegate>

@property (nonatomic, strong) GRRequestsManager *requestsManager;
@property (nonatomic, strong) NSString *hostname;
@property (nonatomic, strong) NSString *username;
@property (nonatomic, strong) NSString *password;

@property (nonatomic, strong) CDVPluginResult* pluginResult;
@property (nonatomic, strong) CDVInvokedUrlCommand* cmd;


@end

@implementation CDVFtp

- (void)setupManager:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    self.hostname = [cmd.arguments objectAtIndex:0];
    self.username = [cmd.arguments objectAtIndex:1];
    self.password = [cmd.arguments objectAtIndex:2];

    // Warning: we won't reset login info when request fail, this may be not good, but don't care now.
    if (self.hostname == nil || self.hostname.length <= 0)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    else
    {
        if (self.username == nil && self.password == nil)
        {
            self.username = @"anonymous";
            self.password = @"anonymous@";
        }

        self.requestsManager = [[GRRequestsManager alloc] initWithHostname:self.hostname
                                                                      user:self.username
                                                                  password:self.password];
        self.requestsManager.delegate = self;

        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    }

    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)list:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* path = [cmd.arguments objectAtIndex:0];

    if (path == nil)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        if ([path characterAtIndex:path.length - 1] != '/')
        {
            path = [path stringByAppendingString:@"/"];
        }

        [self.requestsManager addRequestForListDirectoryAtPath:path];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

- (void)createDirectory:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* path = [cmd.arguments objectAtIndex:0];

    if (path == nil)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        if ([path characterAtIndex:path.length - 1] != '/')
        {
            path = [path stringByAppendingString:@"/"];
        }

        [self.requestsManager addRequestForCreateDirectoryAtPath:path];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

- (void)deleteDirectory:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* path = [cmd.arguments objectAtIndex:0];

    if (path == nil)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        if ([path characterAtIndex:path.length - 1] != '/')
        {
            path = [path stringByAppendingString:@"/"];
        }

        [self.requestsManager addRequestForDeleteDirectoryAtPath:path];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

- (void)deleteFile:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* path = [cmd.arguments objectAtIndex:0];

    if (path == nil)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        [self.requestsManager addRequestForDeleteFileAtPath:path];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

- (void)uploadFile:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* localPath = [cmd.arguments objectAtIndex:0];
    NSString* remotePath = [cmd.arguments objectAtIndex:1];

    if ([localPath length] == 0 || [remotePath length] == 0)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        [self.requestsManager addRequestForUploadFileAtLocalPath:localPath toRemotePath:remotePath];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

- (void)downloadFile:(CDVInvokedUrlCommand*)cmd
{
    self.cmd = cmd;
    NSString* localPath = [cmd.arguments objectAtIndex:0];
    NSString* remotePath = [cmd.arguments objectAtIndex:1];

    if ([localPath length] == 0 || [remotePath length] == 0)
    {
        self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:cmd.callbackId];
    }
    else
    {
        [self.requestsManager addRequestForDownloadFileAtRemotePath:remotePath toLocalPath:localPath];
        [self.requestsManager startProcessingRequests];
        [self.pluginResult setKeepCallbackAsBool:YES];
    }
}

#pragma mark - GRRequestsManagerDelegate

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didScheduleRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didScheduleRequest:");
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [self.pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteListingRequest:(id<GRRequestProtocol>)request listing:(NSArray *)listing
{
    NSLog(@"requestsManager:didCompleteListingRequest:listing: \n%@", listing);
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:listing];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteCreateDirectoryRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteCreateDirectoryRequest:");
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDeleteRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteDeleteRequest:");
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompletePercent:(float)percent forRequest:(id<GRRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompletePercent:forRequest: %f", percent);
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:percent];
    [self.pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteUploadRequest:(id<GRDataExchangeRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteUploadRequest:");
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didCompleteDownloadRequest:(id<GRDataExchangeRequestProtocol>)request
{
    NSLog(@"requestsManager:didCompleteDownloadRequest:");
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailWritingFileAtPath:(NSString *)path forRequest:(id<GRDataExchangeRequestProtocol>)request error:(NSError *)error
{
    NSLog(@"requestsManager:didFailWritingFileAtPath:forRequest:error: \n %@", error);
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

- (void)requestsManager:(id<GRRequestsManagerProtocol>)requestsManager didFailRequest:(id<GRRequestProtocol>)request withError:(NSError *)error
{
    NSLog(@"requestsManager:didFailRequest:withError: \n %@", error);
    self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    [self.pluginResult setKeepCallbackAsBool:NO];
    [self.commandDelegate sendPluginResult:self.pluginResult callbackId:self.cmd.callbackId];
}

@end
