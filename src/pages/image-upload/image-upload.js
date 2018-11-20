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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImgurApiProvider } from '../../providers/imgur-api/imgur-api';
import { Base64 } from '@ionic-native/base64';
/**
 * Generated class for the ImageUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ImageUploadPage = /** @class */ (function () {
    function ImageUploadPage(navCtrl, navParams, imgurProvider, base64Encoder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.imgurProvider = imgurProvider;
        this.base64Encoder = base64Encoder;
    }
    ImageUploadPage.prototype.ionViewDidLoad = function () {
        this.img = this.navParams.get("base64Img");
    };
    ImageUploadPage.prototype.getImg = function () {
        return 'data:image/jpeg;base64,' + this.img;
    };
    ImageUploadPage.prototype.returnToPreviousScreen = function () {
        this.navCtrl.pop();
    };
    ImageUploadPage.prototype.uploadImage = function () {
        this.imgurProvider.uploadImage(this.img, this.title, this.description, function (data, err) {
            if (err) {
                console.log(err);
            }
            else {
                var result = data;
            }
        });
        this.returnToPreviousScreen();
    };
    ImageUploadPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-image-upload',
            templateUrl: 'image-upload.html',
            providers: [
                Base64
            ]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ImgurApiProvider,
            Base64])
    ], ImageUploadPage);
    return ImageUploadPage;
}());
export { ImageUploadPage };
//# sourceMappingURL=image-upload.js.map