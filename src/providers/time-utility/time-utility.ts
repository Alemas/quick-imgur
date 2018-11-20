import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the TimeUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */


  enum DateType {
  	second = 'sec',
  	minute = 'min',
  	hour = 'hour',
  	day = 'day', 
  	month = 'month',
  	year = 'year'
  }

  @Injectable()
  export class TimeUtilityProvider {

  	constructor(public http: HttpClient) {
  		console.log('Hello TimeUtilityProvider Provider');
  	}

  	private getDate(timestamp: number, model: Array<string>) {
  		var a = new Date(timestamp * 1000);
  		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  		var dateString = '';
  		for (let string of model) {
  			switch (string) {
  				case DateType.second: dateString += a.getSeconds();
  				break;
  				case DateType.minute: dateString += a.getMinutes();
  				break;
  				case DateType.hour: dateString += a.getHours();
  				break;
  				case DateType.day: dateString += a.getDate();
  				break;
  				case DateType.month: dateString += months[a.getMonth()];
  				break;
  				case DateType.year: dateString += a.getFullYear();
  				break;
  				default: dateString += string;
  				break;
  			}
  		}
  		return dateString;
  	}

  	getCompleteDate(timestamp){
  		// var a = new Date(timestamp * 1000);
  		// var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  		// var year = a.getFullYear();
  		// var month = months[a.getMonth()];
  		// var date = a.getDate();
  		// var hour = a.getHours();
  		// var min = a.getMinutes();
  		// var sec = a.getSeconds();
  		// var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  		// return time;
  		return this.getDate(timestamp, [DateType.day, ' ', DateType.month, ' ', DateType.year, ' ', DateType.hour, ':', DateType.minute, ':', DateType.second]);
  	}

  	getSimpleDate(timestamp: number): string {
  		return this.getDate(timestamp, [DateType.day, ' ', DateType.month, ' ', DateType.year]);
  	}

  }
