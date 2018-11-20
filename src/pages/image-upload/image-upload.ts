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

 @IonicPage()
 @Component({
 	selector: 'page-image-upload',
 	templateUrl: 'image-upload.html',
 	providers: [
 	Base64
 	]
 })
 export class ImageUploadPage {

 	private img: string;
 	private title: string;
 	private description: string;

 	constructor(public navCtrl: NavController,
 		public navParams: NavParams,
 		public imgurProvider: ImgurApiProvider,
 		private base64Encoder: Base64) {
 	}

 	ionViewDidLoad() {

 		this.img = this.navParams.get("base64Img");

 	}

 	getImg(): string {
 		return 'data:image/jpeg;base64,' + this.img;
 	}

 	returnToPreviousScreen() {
 		this.navCtrl.pop();
 	}

 	uploadImage() {

 		this.imgurProvider.uploadImage(this.img, this.title, this.description, (data: any, err: Error) => {
 			if (err) {
 				console.log(err);
 			} else {
 				const result = (data as any);
 			}
 		});
 		
 		this.returnToPreviousScreen();
 	}

 }
