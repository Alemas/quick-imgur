var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Generated class for the TimeUtilityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
var DateType;
(function (DateType) {
    DateType["second"] = "sec";
    DateType["minute"] = "min";
    DateType["hour"] = "hour";
    DateType["day"] = "day";
    DateType["month"] = "month";
    DateType["year"] = "year";
})(DateType || (DateType = {}));
var TimeUtilityProvider = /** @class */ (function () {
    function TimeUtilityProvider(http) {
        this.http = http;
        console.log('Hello TimeUtilityProvider Provider');
    }
    TimeUtilityProvider.prototype.getDate = function (timestamp, model) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dateString = '';
        for (var _i = 0, model_1 = model; _i < model_1.length; _i++) {
            var string = model_1[_i];
            switch (string) {
                case DateType.second:
                    dateString += a.getSeconds();
                    break;
                case DateType.minute:
                    dateString += a.getMinutes();
                    break;
                case DateType.hour:
                    dateString += a.getHours();
                    break;
                case DateType.day:
                    dateString += a.getDate();
                    break;
                case DateType.month:
                    dateString += months[a.getMonth()];
                    break;
                case DateType.year:
                    dateString += a.getFullYear();
                    break;
                default:
                    dateString += string;
                    break;
            }
        }
        return dateString;
    };
    TimeUtilityProvider.prototype.getCompleteDate = function (timestamp) {
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
    };
    TimeUtilityProvider.prototype.getSimpleDate = function (timestamp) {
        return this.getDate(timestamp, [DateType.day, ' ', DateType.month, ' ', DateType.year]);
    };
    TimeUtilityProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], TimeUtilityProvider);
    return TimeUtilityProvider;
}());
export { TimeUtilityProvider };
//# sourceMappingURL=time-utility.js.map