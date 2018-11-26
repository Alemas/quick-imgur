import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { ImgurApiProvider } from '../../providers/imgur-api/imgur-api';
import { TimeUtilityProvider } from '../../providers/time-utility/time-utility';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the GalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-gallery',
 	templateUrl: 'gallery.html',
 	providers: [
 	PhotoViewer,
 	InAppBrowser,
 	SocialSharing
 	]
 })
 export class GalleryPage {

 	private galleryType: string = 'grid';
 	private images:Array<any>;
 	private placeholderImage = '../../assets/imgs/hourglass-icon-gr.png';
 	private imageSources: {[id: string]: string} = {};
 	private browserOptions: InAppBrowserOptions = {
 		location: 'no',
 		zoom: 'no'
 	};

 	constructor(public navCtrl: NavController,
 		public navParams: NavParams,
 		private imgurProvider: ImgurApiProvider,
 		private timeUtility: TimeUtilityProvider,
 		private photoViewer: PhotoViewer,
 		private sanitizer: DomSanitizer,
 		private actionSheetController: ActionSheetController,
 		private platform: Platform,
 		private browser: InAppBrowser,
 		private socialSharing: SocialSharing) {
 	}

 	ionViewWillEnter() {
 		this.refreshImages();
 	}

 	private refreshImages() {
 		this.images = this.imgurProvider.getUploadedImages();
 		for (let img of this.images) {
 			this.imageSources[img.id] =  this.placeholderImage;
 			this.imgurProvider.getImage(img, (base64Img, err) => {
 				if (base64Img) {
 					this.imageSources[img.id] = base64Img;
 				} 
 				if (err) {
 					console.log('gallery - errou ' + err);
 				}
 			});
 		}
 	}

 	private getDate(timestamp: number):string {
 		return this.timeUtility.getSimpleDate(timestamp);
 	}

 	private showImageViewer(img) {
 		if (this.imageSources[img.id] != this.placeholderImage) {
 			this.photoViewer.show(this.imageSources[img.id], img.title, {share: true});
 		}
 	}

 	private showWebPage(url:string) {
 		url = url.replace(/\.[^/.]+$/, "");
 		let webPage = this.browser.create(url, null, this.browserOptions);
 		webPage.show();
 	}

 	private deleteImage(img:any) {
 		this.imgurProvider.deleteImage(img, (data, err) => {
 			if (err) {
 				console.log(err);
 			} else {
 				this.refreshImages();
 			}
 		})
 	}

 	private showMoreOptions(img) {
 		if (this.imageSources[img.id] == this.placeholderImage) { return; }

 		let actionSheet = this.actionSheetController.create({
 			title: "What do you want to do?",
 			buttons: [
 			{
 				text: 'Share',
 				icon: this.platform.is('ios') ? null : 'share',
 				handler: () => {
 					this.socialSharing.share(null, null, this.imageSources[img.id], null);
 				}
 			},
 			{
 				text: 'Open on imgur',
 				icon: this.platform.is('ios') ? null : 'share-alt',
 				handler: () => {
 					this.showWebPage(img.url);
 				}
 			},
 			{
 				text: 'Delete',
 				icon: this.platform.is('ios') ? null : 'trash',
 				role: 'destructive',
 				handler: () => {
 					this.deleteImage(img);
 				}
 			},
 			{
 				text: 'Cancel',
 				role: 'cancel'
 			}
 			]
 		});

 		actionSheet.present();
 	}

 }