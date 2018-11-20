import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ImgurApiProvider } from '../providers/imgur-api/imgur-api';

import { HomePage } from '../pages/home/home';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = HomePage;
	pages: Array<{title: string, component: any}>;
	private loader;
	private renewingToken = false;

	constructor(public platform: Platform,
		public statusBar: StatusBar, 
		public splashScreen: SplashScreen,
		private imgurProvider: ImgurApiProvider,
		private loadingCtrl: LoadingController,
		private alertCtrl: AlertController) {
		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
		{ title: 'Home', component: HomePage }
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	private deleteAllImages() {
		let alert = this.alertCtrl.create({
			title: "Delete all images?",
			subTitle: "This action cannot be undone",
			buttons: [
			{
				text: "  No  "
			},
			{
				text: "  Yes  ",
				handler: () => {
					this.loader = this.loadingCtrl.create({
						spinner: 'crescent'
					});
					this.loader.present();
					this.imgurProvider.deleteAllImages(results => {
						this.loader.dismiss();
						console.log(results);
					});
				}
			}]
		})

		alert.present();
	}

	private renewAccessToken() {
		let btn = (document.getElementById('renewTokenBtn') as HTMLButtonElement)
		btn.disabled = true;
		btn.textContent = 'Renewing token... ';
		this.renewingToken = true;

		this.imgurProvider.renewAccessToken((data, err: Error) => {
			btn.disabled = false;
			btn.textContent = 'Renew token';
			this.renewingToken = false;
		})
	}
}
