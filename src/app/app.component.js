var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ImgurApiProvider } from '../providers/imgur-api/imgur-api';
import { HomePage } from '../pages/home/home';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, imgurProvider, loadingCtrl, alertCtrl) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.imgurProvider = imgurProvider;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.rootPage = HomePage;
        this.renewingToken = false;
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: HomePage }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.deleteAllImages = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: "Delete all images?",
            subTitle: "This action cannot be undone",
            buttons: [
                {
                    text: "  No  "
                },
                {
                    text: "  Yes  ",
                    handler: function () {
                        _this.loader = _this.loadingCtrl.create({
                            spinner: 'crescent'
                        });
                        _this.loader.present();
                        _this.imgurProvider.deleteAllImages(function (results) {
                            _this.loader.dismiss();
                            console.log(results);
                        });
                    }
                }
            ]
        });
        alert.present();
    };
    MyApp.prototype.renewAccessToken = function () {
        var _this = this;
        var btn = document.getElementById('renewTokenBtn');
        btn.disabled = true;
        btn.textContent = 'Renewing token... ';
        this.renewingToken = true;
        this.imgurProvider.renewAccessToken(function (data, err) {
            btn.disabled = false;
            btn.textContent = 'Renew token';
            _this.renewingToken = false;
        });
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            SplashScreen,
            ImgurApiProvider,
            LoadingController,
            AlertController])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map