var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
/*
  Generated class for the ImgurApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var ImgurApiProvider = /** @class */ (function () {
    function ImgurApiProvider(http, base64, file) {
        this.http = http;
        this.base64 = base64;
        this.file = file;
        this.localImages = {};
        this.uploadedImagesKey = "uploadedImages";
        this.accessTokenKey = "accessToken";
        this.refreshTokenKey = "refreshToken";
        this.baseURL = "https://api.imgur.com/3";
        this.client_id = 'a99f12969fe4e4b';
        this.client_secret = 'd3798cf86b3c677a8ef30d0a1a9fbbea1e317a66';
        this.authorizationHeader = new HttpHeaders({
            Authorization: 'Bearer ' + this.accessToken
        });
        this.runningUploads = 0;
        this.runningUploadsSubject = new Subject();
        this.refreshToken = this.getRefreshToken();
        this.accessTokenKey = this.getAccessToken();
    }
    ImgurApiProvider.prototype.renewAccessToken = function (callback) {
        var _this = this;
        var body = {
            refresh_token: this.refreshToken,
            client_id: this.client_id,
            client_secret: this.client_secret,
            grant_type: 'refresh_token'
        };
        console.log(body);
        this.http.post("https://api.imgur.com/oauth2/token", body).subscribe(function (data) {
            _this.accessToken = data.access_token;
            _this.refreshToken = data.refresh_token;
            _this.setAccessToken(_this.accessToken);
            _this.setRefreshToken(_this.refreshToken);
            if (callback) {
                callback(data, null);
            }
        }, function (err) {
            if (callback) {
                callback(null, err);
            }
        });
    };
    ImgurApiProvider.prototype.uploadImage = function (base64Img, title, description, callback) {
        var _this = this;
        var body = {
            image: base64Img,
            title: title,
            description: description
        };
        this.runningUploads++;
        this.runningUploadsSubject.next(this.runningUploads);
        this.http.post(this.baseURL + "/image", body, { headers: this.authorizationHeader }).subscribe(function (data) {
            var result = data;
            console.log(result);
            var uploadedImagesString = localStorage.getItem(_this.uploadedImagesKey);
            var uploadedImages;
            if (uploadedImagesString) {
                uploadedImages = JSON.parse(uploadedImagesString);
            }
            else {
                uploadedImages = [];
            }
            var img = {
                url: result.data.link,
                timestamp: result.data.datetime,
                id: result.data.id,
                deletehash: result.data.deletehash,
                title: result.data.title
            };
            uploadedImages.unshift(img);
            localStorage.setItem(_this.uploadedImagesKey, JSON.stringify(uploadedImages));
            _this.runningUploads--;
            _this.runningUploadsSubject.next(_this.runningUploads);
            if (callback) {
                callback(data, null);
            }
        }, function (err) {
            _this.runningUploads--;
            _this.runningUploadsSubject.next(_this.runningUploads);
            if (callback) {
                callback(null, err);
            }
        });
    };
    ImgurApiProvider.prototype.getImage = function (img, callback) {
        var _this = this;
        if (this.localImages[img.id]) {
            callback(this.localImages[img.id], null);
            return;
        }
        this.http.get(img.url, { responseType: "blob" }).subscribe(function (data) {
            var path = _this.file.dataDirectory;
            _this.file.writeFile(path, img.id, data, { replace: true }).then(function (file) {
                // callback(normalizeURL(path + img.id), null);
                _this.base64.encodeFile(_this.file.dataDirectory + img.id).then(function (string) {
                    string = 'data:' + data.type + ';base64,' + string.split('base64,', 2)[1];
                    _this.localImages[img.id] = string;
                    // this.localImages[img.id] = this.file.dataDirectory + img.id;
                    callback(string, null);
                }, function (err) {
                    callback(null, err);
                });
            }, function (err) {
                console.log('writeFile error: ' + err);
            });
        }, function (err) {
            callback(null, err);
        });
    };
    ImgurApiProvider.prototype.getImageData = function (img, callback) {
        this.http.get(this.baseURL + '/image/' + img.id).subscribe(function (data) {
            callback(data, null);
        }, function (err) {
            callback(null, err);
        });
    };
    ImgurApiProvider.prototype.deleteImage = function (img, callback) {
        var _this = this;
        this.http.delete(this.baseURL + '/image/' + img.deletehash, { headers: this.authorizationHeader }).subscribe(function (data) {
            var hist = _this.getUploadedImages();
            hist = hist.filter(function (v, i, a) {
                return v.id != img.id;
            });
            _this.setUploadedImages(hist);
            if (callback) {
                callback(data, null);
            }
        }, function (err) {
            if (callback) {
                callback(null, err);
            }
        });
    };
    ImgurApiProvider.prototype.deleteAllImages = function (callback) {
        var uploadedImages = this.getUploadedImages();
        var imgCount = uploadedImages.length;
        if (imgCount == 0) {
            callback([]);
            return;
        }
        var r = [];
        var imgCallback = function (data, err) {
            if (data) {
                r.push(data);
            }
            else if (err) {
                r.push(err);
            }
            imgCount--;
            if (imgCount == 0 && callback != null) {
                callback(r);
            }
        };
        for (var _i = 0, _a = this.getUploadedImages(); _i < _a.length; _i++) {
            var img = _a[_i];
            this.deleteImage(img, imgCallback);
        }
    };
    ImgurApiProvider.prototype.getRunningUploads = function () {
        return this.runningUploadsSubject;
    };
    ImgurApiProvider.prototype.getUploadedImages = function () {
        var imgsString = localStorage.getItem(this.uploadedImagesKey);
        if (imgsString) {
            return JSON.parse(imgsString);
        }
        return [];
    };
    ImgurApiProvider.prototype.setUploadedImages = function (uploadedImages) {
        localStorage.setItem(this.uploadedImagesKey, JSON.stringify(uploadedImages));
    };
    ImgurApiProvider.prototype.getAccessToken = function () {
        var at = localStorage.getItem(this.accessTokenKey);
        if (at) {
            return JSON.stringify(at);
        }
        return;
    };
    ImgurApiProvider.prototype.setAccessToken = function (accessToken) {
        localStorage.setItem(this.accessTokenKey, JSON.stringify(accessToken));
    };
    ImgurApiProvider.prototype.getRefreshToken = function () {
        var rt = localStorage.getItem(this.refreshToken);
        if (rt) {
            return JSON.stringify(rt);
        }
        return 'a1fa3f5e4d16ff25fa5951451f9bd73dc12ff75d';
    };
    ImgurApiProvider.prototype.setRefreshToken = function (refreshToken) {
        localStorage.setItem(this.refreshTokenKey, JSON.stringify(refreshToken));
    };
    ImgurApiProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            Base64,
            File])
    ], ImgurApiProvider);
    return ImgurApiProvider;
}());
export { ImgurApiProvider };
//# sourceMappingURL=imgur-api.js.map