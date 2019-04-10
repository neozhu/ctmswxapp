import dayjs from 'dayjs';
import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter
const http = axios.create({
  baseURL: 'http://221.224.21.30:2021/api/'
})
const app = getApp();
Page({
  data: {
    orderno: '',
    order: {},
    loadModal: false
  },
  loadModal: function() {
    this.setData({
      loadModal: true
    })
  },
  completedLoading: function() {
    this.setData({
      loadModal: false
    })
  },
  onLoad: function (option) {
    //console.log(option.id)
    this.loadModal();
    http.get('TmOrders/GetTmOrder/' + option.id).then(res=>{
      console.log(res)
      let item = res.data;
      //console.log(app.globalData.tmtrqtype);
      item.TRQ_TYPE = app.globalData.tmtrqtype.filter(n => { return n.value == item.TRQ_TYPE})[0].text;
      item.ZCZLX = app.globalData.tmczlx.filter(n => { return n.value == item.ZCZLX })[0].text;
      item.ZZT = app.globalData.tmsstatus.filter(n => { return n.value == item.ZZT })[0].text;
      item.ZXZT = app.globalData.tmxzt.filter(n => { return n.value == item.ZXZT })[0].text;
      item.ZJDRQ = dayjs(item.ZJDRQ).format('MM-DD');
      item.ZFOJHTHRQZGRQS = dayjs(item.ZFOJHTHRQZGRQS).format('MM-DD hh:mm');
      item.ZJHSHRQ = dayjs(item.ZJHSHRQ).format('MM-DD hh:mm');
      this.setData({
        orderno: item.TRQ_ID,
        order: item
      });
      this.completedLoading();
    })
  }
})