import { Component } from '@angular/core';
import { NavController, ActionSheetController, Platform, LoadingController, LoadingOptions } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImgurApiProvider } from '../../providers/imgur-api/imgur-api';
import { ImageUploadPage } from '../image-upload/image-upload';
import { GalleryPage } from '../gallery/gallery';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [
	Camera, 
	InAppBrowser
	]
})
export class HomePage {

	private img:string;
	private history: Array<any>;
	private runningOperationsInfo: string;
	private browserOptions: InAppBrowserOptions = {
		location: 'no',
		zoom: 'no'
	};
	private loader;

	constructor(public navCtrl: NavController,
		public actionSCtrl: ActionSheetController,
		public camera: Camera,
		public browser: InAppBrowser,
		private imgurProvider: ImgurApiProvider,
		private platform: Platform,
		private loadingCtrl: LoadingController) {

		imgurProvider.getRunningUploads().subscribe(data => {
			if (data <= 0){
				this.runningOperationsInfo = null;
			} else if (data == 1) {
				this.runningOperationsInfo = '1 upload in progress';
			} else if (data > 1) {
				this.runningOperationsInfo = data + ' uploads in progress';
			}
		})
	}

	private showGallery() {
		this.navCtrl.push(GalleryPage);
	}

	private takePhoto(callback:(base64Img: string) => void) {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
			callback(imageData);
		}, (err) => {
			this.loader.dismiss();
			console.log(err);
			this.navCtrl.push(ImageUploadPage, {"base64Img" : "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"});
		});
	}

	private selectImageFromGallery(callback:(base64Img: string) => void) {
		const options: CameraOptions = {
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			destinationType: this.camera.DestinationType.DATA_URL,
			quality: 100,
			targetWidth: 1000,
			targetHeight: 1000,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then(imageData => {
			callback(imageData);
		}, err => {
			this.loader.dismiss();
			console.log(err);
		})
	}

	didPressTakePhoto() {
		this.loader = this.loadingCtrl.create({
			spinner: 'crescent'
		});
		this.loader.present();
		this.takePhoto(img => {
			this.loader.dismiss();
			this.navCtrl.push(ImageUploadPage, {"base64Img" : img});
		});
	}

	didPressUploadImage() {
		this.loader = this.loadingCtrl.create({
			spinner: 'crescent'
		});
		this.loader.present();
		this.selectImageFromGallery(img => {
			this.loader.dismiss();
			this.navCtrl.push(ImageUploadPage, {"base64Img" : img});
		})
	}

}