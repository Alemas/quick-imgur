import { normalizeURL } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Base64 } from '@ionic-native/base64';
import { File } from '@ionic-native/file';
import { AlertController} from 'ionic-angular';

/*
  Generated class for the ImgurApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */

  @Injectable()
  export class ImgurApiProvider {

  	private localImages: {[id: string]: string} = {};
  	private uploadedImagesKey: string = "uploadedImages";
  	private accessTokenKey: string = "accessToken";
  	private refreshTokenKey: string = "refreshToken";
  	private baseURL: string = "https://api.imgur.com/3";

  	private refreshToken: string = 'a1fa3f5e4d16ff25fa5951451f9bd73dc12ff75d';
  	private client_id: string = 'a99f12969fe4e4b';
  	private client_secret: string = 'd3798cf86b3c677a8ef30d0a1a9fbbea1e317a66';
  	private accessToken: string = '260d7c250016675e3fe985db0adf7405a321075a';
  	private runningUploads: number = 0;
  	private runningUploadsSubject = new Subject<number>();
  	private debug = true;

  	constructor(public http: HttpClient,
  		public base64: Base64,
  		private file: File,
  		private alertCtrl: AlertController) {

  		this.refreshToken = this.getRefreshToken();
  		this.accessToken = this.getAccessToken();

  		this.renewAccessToken();
  	}

  	renewAccessToken(callback?:(data: any, err: Error) => void) {

  		let body = {
  			refresh_token: this.refreshToken,
  			client_id: this.client_id,
  			client_secret: this.client_secret,
  			grant_type: 'refresh_token'
  		}

  		console.log(body);

  		this.http.post("https://api.imgur.com/oauth2/token", body).subscribe(data => {
  			
  			this.accessToken = (data as any).access_token;
  			this.refreshToken = (data as any).refresh_token;
  			this.setAccessToken(this.accessToken);
  			this.setRefreshToken(this.refreshToken);

  			if (callback) { callback(data, null); }
  		}, err => {
  			if (callback) { callback(null, err); }
  		});

  	}

  	uploadImage(base64Img: string, title?:string, description?:string, callback?: ((any, Error) => void)) {

  		let body = {
  			image: base64Img,
  			title: title,
  			description: description
  		};

  		this.runningUploads++;
  		this.runningUploadsSubject.next(this.runningUploads);

  		this.http.post(this.baseURL + "/image", body, {headers: this.getAuthorizationHeader()}).subscribe(data => {
  			const result = (data as any);
  			console.log(result);
  			var uploadedImagesString = localStorage.getItem(this.uploadedImagesKey);
  			var uploadedImages: Array<any>;

  			if (uploadedImagesString) {
  				uploadedImages = JSON.parse(uploadedImagesString);
  			} else {
  				uploadedImages = [];
  			}
  			let img = {
  				url: result.data.link, 
  				timestamp: result.data.datetime, 
  				id:result.data.id,
  				deletehash: result.data.deletehash,
  				title: result.data.title
  			};

  			uploadedImages.unshift(img);

  			localStorage.setItem(this.uploadedImagesKey, JSON.stringify(uploadedImages));
  			this.runningUploads--;
  			this.runningUploadsSubject.next(this.runningUploads);
  			if (callback) { callback(data, null); }

  		}, err => {
  			this.runningUploads--;
  			this.runningUploadsSubject.next(this.runningUploads);
  			if (this.debug) {
  				this.showAlert('Upload image error', err.error.data.error);
  			}
  			if (callback) { callback(null, err); }
  		});
  	}

  	getImage(img:any, callback: (base64Img: any, err: Error) => void) {
  		if (this.localImages[img.id]) {
  			callback(this.localImages[img.id], null);
  			return;
  		}

  		this.http.get(img.url, {responseType: "blob"}).subscribe(data => {

  			let path =  this.file.dataDirectory;

  			this.file.writeFile(path, img.id, data, {replace: true}).then(file => {
  				// callback(normalizeURL(path + img.id), null);
  				this.base64.encodeFile(this.file.dataDirectory + img.id).then(string => {
  					string = 'data:' + (data as Blob).type + ';base64,' +  string.split('base64,',2)[1];
  					this.localImages[img.id] = string;
  					// this.localImages[img.id] = this.file.dataDirectory + img.id;
  					callback(string, null);
  				}, err => {
  					callback(null, err);
  				})
  			}, err => {
  				console.log('writeFile error: '+ err);
  			});

  		}, err => {
  			callback(null, err);
  		});
  	}

  	getImageData(img:any, callback: (data: any, err: Error) => void) {
  		this.http.get(this.baseURL + '/image/' + img.id).subscribe(data => {
  			callback(data, null);
  		}, err => {
  			callback(null, err);
  		});
  	}

  	deleteImage(img:any, callback?: (data: any, err: Error) => void) {
  		this.http.delete(this.baseURL + '/image/' + img.deletehash, {headers: this.getAuthorizationHeader()}).subscribe(data => {
  			let hist = this.getUploadedImages();
  			hist = hist.filter((v, i, a) => {
  				return v.id  != img.id;
  			})
  			this.setUploadedImages(hist);
  			if (callback) { callback(data, null); }
  		}, err => {
  			if (callback) { callback(null, err); }
  		});
  	}

  	deleteAllImages(callback?:(results: Array<any>) => void) {

  		let uploadedImages = this.getUploadedImages();
  		var imgCount = uploadedImages.length;

  		if (imgCount==0) {
  			callback([]);
  			return;
  		}

  		var r = [];

  		let imgCallback = (data: any, err: Error) => {
  			if (data) { r.push(data); } else
  			if (err) { r.push(err); }
  			imgCount--;
  			if (imgCount == 0 && callback != null) { callback(r); }
  		}
  		for (let img of this.getUploadedImages()) {
  			this.deleteImage(img, imgCallback);
  		}
  	}

  	getRunningUploads(): Subject<number> {
  		return this.runningUploadsSubject;
  	}

  	getUploadedImages(): Array<any> {
  		let imgsString = localStorage.getItem(this.uploadedImagesKey);
  		if (imgsString) {
  			return (JSON.parse(imgsString) as Array<any>);
  		}
  		return [];
  	}

  	private showAlert(title:string, subTitle:string) {
  		let alert = this.alertCtrl.create({title: title, subTitle: subTitle, buttons:[{text: 'Ok'}]})
  		alert.present();
  	}

  	private setUploadedImages(uploadedImages: Array<any>) {
  		localStorage.setItem(this.uploadedImagesKey, JSON.stringify(uploadedImages));
  	}

  	private getAuthorizationHeader(): HttpHeaders {
  		return new HttpHeaders ({
  			Authorization: 'Bearer ' + this.accessToken
  		});
  	}

  	private getAccessToken(): string {
  		let at = localStorage.getItem(this.accessTokenKey)
  		if (at) {
  			return JSON.stringify(at);
  		}
  		return "260d7c250016675e3fe985db0adf7405a321075a";
  	}

  	private setAccessToken(accessToken: string) {
  		localStorage.setItem(this.accessTokenKey, JSON.stringify(accessToken));
  	}

  	private getRefreshToken(): string {
  		let rt = localStorage.getItem(this.refreshToken);
  		if (rt) {
  			return JSON.stringify(rt);
  		}
  		return 'a1fa3f5e4d16ff25fa5951451f9bd73dc12ff75d';
  	}

  	private setRefreshToken(refreshToken: string) {
  		localStorage.setItem(this.refreshTokenKey, JSON.stringify(refreshToken));
  	}

  }
