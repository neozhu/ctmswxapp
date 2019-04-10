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
    loadModal: false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    date: dayjs().format('YYYY-MM-DD'),
    picker: ['ALL','长程', '短驳'],
    statuspicker:['ALL','派车','发运','完成','异常','甩板'],
    total: 0,
    rows: [],
    allrows: []
  },
  onLoad: function (option) {
    //console.log(option.status)
    this.loadModal();
    http.get('ShippingTasks/GetPageData').then(res=>{
      console.log(res);
      let rows=res.data.rows.map((item)=>{
        let n0 = app.globalData.tmpclx.filter(n => { return n.value == item.ZPCLX })[0].text;
        let n1 = app.globalData.tmsstatus.filter(n => { return n.value == item.ZCZT })[0].text;
        return {
        ShipOrderNo: item.ShipOrderNo,
        ZCBH: item.ZCBH,
        ZCPH: item.ZCPH,
        ZDDPCSJ: dayjs(item.ZDDPCSJ).format("MM-DD hh:mm"),
        ZMDDMS: item.ZMDDMS,
        ZQSDMS: item.ZQSDMS,
        ZPCLX: item.ZPCLX,
        ZPCLXN: n0,
        ZCZT: item.ZCZT,
        ZCZTN: n1
      }
      });
      this.setData({
        total:res.data.total,
        allrows: rows,
        rows: rows
      });
      this.completedLoading();
    });
  },
  showModal: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal: function (e) {
    this.setData({
      modalName: null
    })
  },
  PickerChange: function (e) {
    if (e.detail.value == 0) {
      //ALL
      let rows = this.data.allrows;
      this.setData({
        rows: rows
      });
    } else if (e.detail.value == 1) {
      let rows = this.data.allrows.filter(item => {
        return item.ZPCLX == '0'
      });
      this.setData({
        rows: rows
      });
    } else if (e.detail.value == 2) {
      let rows = this.data.allrows.filter(item => {
        return item.ZPCLX == '1'
      });
      this.setData({
        rows: rows
      });
    }
  },
  StatusPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  DateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  loadModal: function () {
    this.setData({
      loadModal: true
    })
  },
  completedLoading: function () {
    this.setData({
      loadModal: false
    })
  },
  todetail: function (e) {
    //console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/shiporder/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }
})