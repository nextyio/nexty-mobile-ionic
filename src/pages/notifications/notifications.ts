import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DetailNotiPage } from '../detail-noti/detail-noti';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  listNoti = [
    {
      "Title": "Đã có phiên bản mới",
      "content": "Đã có phiên bản mới trên CH play, bạn có thể cập nhật qua <a href='http://google.com'>",
      "icon": "mail",
      "status": true
    },
    {
      "Title": "Đã có phiên bản mới",
      "content": "Đã có phiên bản mới trên CH play, bạn có thể cập nhật qua <a href='http://google.com'>",
      "icon": "mail-open",
      "status": false
    },
    {
      "Title": "Đã có phiên bản mới",
      "content": "Đã có phiên bản mới trên CH play, bạn có thể cập nhật qua <a href='http://google.com'>",
      "icon": "mail-open",
      "status": false
    },
    {
      "Title": "Đã có phiên bản mới",
      "content": "Đã có phiên bản mới trên CH play, bạn có thể cập nhật qua <a href='http://google.com'>",
      "icon": "mail-open",
      "status": false
    },
    {
      "Title": "Đã có phiên bản mới, vui long cap nhat ngay",
      "content": "Đã có phiên bản mới trên CH play, bạn có thể cập nhật qua <a href='http://google.com'>",
      "icon": "mail-open",
      "status": false
    }
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }
  goDetail(content) {
    this.navCtrl.push(DetailNotiPage, content);
  }
}
