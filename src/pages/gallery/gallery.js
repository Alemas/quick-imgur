var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { ImgurApiProvider } from '../../providers/imgur-api/imgur-api';
import { TimeUtilityProvider } from '../../providers/time-utility/time-utility';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var GalleryPage = /** @class */ (function () {
    function GalleryPage(navCtrl, navParams, imgurProvider, timeUtility, photoViewer, sanitizer, actionSheetController, platform, browser) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.imgurProvider = imgurProvider;
        this.timeUtility = timeUtility;
        this.photoViewer = photoViewer;
        this.sanitizer = sanitizer;
        this.actionSheetController = actionSheetController;
        this.platform = platform;
        this.browser = browser;
        this.galleryType = 'grid';
        this.imageSources = {};
        this.browserOptions = {
            location: 'no',
            zoom: 'no'
        };
    }
    GalleryPage.prototype.ionViewWillEnter = function () {
        this.refreshImages();
    };
    GalleryPage.prototype.refreshImages = function () {
        var _this = this;
        this.images = this.imgurProvider.getUploadedImages();
        var _loop_1 = function (img) {
            this_1.imageSources[img.id] = '../../assets/imgs/hourglass-icon-gr.png';
            this_1.imgurProvider.getImage(img, function (base64Img, err) {
                if (base64Img) {
                    _this.imageSources[img.id] = base64Img;
                }
                if (err) {
                    console.log('gallery - errou ' + err);
                }
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = this.images; _i < _a.length; _i++) {
            var img = _a[_i];
            _loop_1(img);
        }
    };
    // private showImage(img) {
    // 	var result = '../../assets/imgs/hourglass-icon-gr.png';
    // 	this.imgurProvider.getImage(img, (data, err) => {
    // 		if (data) {
    // 			result = data;
    // 		}
    // 	})
    // 	return result;
    // }
    GalleryPage.prototype.getDate = function (timestamp) {
        return this.timeUtility.getSimpleDate(timestamp);
    };
    GalleryPage.prototype.showImageViewer = function (img) {
        this.photoViewer.show(img.url, img.title, { share: true });
    };
    GalleryPage.prototype.showWebPage = function (url) {
        url = url.replace(/\.[^/.]+$/, "");
        var webPage = this.browser.create(url, null, this.browserOptions);
        webPage.show();
    };
    GalleryPage.prototype.deleteImage = function (img) {
        var _this = this;
        this.imgurProvider.deleteImage(img, function (data, err) {
            if (err) {
                console.log(err);
            }
            else {
                _this.refreshImages();
            }
        });
    };
    GalleryPage.prototype.showMoreOptions = function (img) {
        var _this = this;
        var actionSheet = this.actionSheetController.create({
            title: "What do you want to do?",
            buttons: [
                {
                    text: 'Share',
                    icon: this.platform.is('ios') ? null : 'share',
                    handler: function () {
                        _this.deleteImage(img);
                    }
                },
                {
                    text: 'Open on imgur',
                    icon: this.platform.is('ios') ? null : 'share-alt',
                    handler: function () {
                        _this.showWebPage(img.url);
                    }
                },
                {
                    text: 'Delete',
                    icon: this.platform.is('ios') ? null : 'trash',
                    role: 'destructive',
                    handler: function () {
                        _this.deleteImage(img);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    };
    GalleryPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-gallery',
            templateUrl: 'gallery.html',
            providers: [
                PhotoViewer,
                InAppBrowser
            ]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ImgurApiProvider,
            TimeUtilityProvider,
            PhotoViewer,
            DomSanitizer,
            ActionSheetController,
            Platform,
            InAppBrowser])
    ], GalleryPage);
    return GalleryPage;
}());
export { GalleryPage };
//# sourceMappingURL=gallery.js.map