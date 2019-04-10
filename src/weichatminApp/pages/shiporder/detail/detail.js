import dayjs from 'dayjs';
import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
axios.defaults.adapter = mpAdapter
const http = axios.create({
  baseURL: 'http://221.224.21.30:2021/api/'
})
const app = getApp();
Page({
  data: {
    modalName:'',
    longitude:0.00,
    latitude:0.00,
    shiporderno: '',
    shiporder: {},
    loadModal: false,
    containers:[],
    imgList1: [],
    imgList2: [],
    total:0,
    polyline: [],
    circles: [{
      latitude: '40.007153',
      longitude: '116.491081',
      color: '#FF0000DD',
      fillColor: '#7cb5ec88',
      radius: 400,
      strokeWidth: 2
    }],
    freerange:['过路过桥费','制单费','查验费','过夜费','罚款','其它'],
    freeAmount:0.00,
    exrange: ['提供错误信息', '安全异常', '提货问题', '订单异常', '意外事故', '调度异常', '信息提供不及时', '破损', '结算异常', '变形'],
    excomment:''

  },
  onLoad: function (option) {
    qqmapsdk = new QQMapWX({
      key: 'PP4BZ-5M6E4-KN3UG-X22DN-H2XXK-YNFWB'
    });
    let that=this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        //console.log(res);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function () {
        console.error('getLocation');
      },
      complete: function () {
        // complete
      }
    })
     
    this.loadModal();
    http.get('ShippingTasks/GetShippingTask/' + option.id).then(res=>{
      
      let item = res.data;
      item.ZDDPCSJ = dayjs(item.ZDDPCSJ).format('MM-DD hh:mm');
      item.ZCZT=res.data.ZCZT;
      item.ZCZTN = app.globalData.tmsstatus.filter(n => { return n.value == item.ZCZT })[0].text;
      item.ZPCLX = app.globalData.tmpclx.filter(n => { return n.value == item.ZPCLX })[0].text;
      this.setData({shiporder:item});
      //console.log(item.ZQSDMS);
      qqmapsdk.geocoder({
        address: item.ZQSDMS, 
        sig:'mloVQRt6JMLyAb92SwItYNXNmLP5zmFx',
        success: function (res1) {
          let start = res1.result.location;
          qqmapsdk.geocoder({
            address: item.ZMDDMS,
            sig: 'mloVQRt6JMLyAb92SwItYNXNmLP5zmFx',
            success: function (res2) {
              let end=res2.result.location;
              console.log(start,end);
              qqmapsdk.direction({
                sig: 'mloVQRt6JMLyAb92SwItYNXNmLP5zmFx',
                mode: 'driving',
                from: {
                  latitude: start.lat,
                  longitude: start.lng
                },
                to: {
                  latitude: end.lat,
                  longitude: end.lng
                },
                success: function (route) {
                  console.log(route);
                  var ret = route.result.routes[0];
                  var coors = route.result.routes[0].polyline, pl = [];
                  //坐标解压（返回的点串坐标，通过前向差分进行压缩）
                  var kr = 1000000;
                  for (var i = 2; i < coors.length; i++) {
                    coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
                  }
                  //将解压后的坐标放入点串数组pl中
                  for (var i = 0; i < coors.length; i += 2) {
                    pl.push({ latitude: coors[i], longitude: coors[i + 1] })
                  }
                  console.log(coors,pl);
                  //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
                  that.setData({
                    polyline: [{
                      points: pl,
                      color: '#1E88E5',
                      width: 6,
                      arrowLine:true,
                      borderColor:'#42A5F5'
                    }]
                  })
                  console.log(that.data.polyline);
                }
              });
            }
          });

        },
        fail:function(err){
          console.error(err);
        }
      }
      );

      this.completedLoading();
    });
    http.get('ShippingTaskItems/GetDataByShipOrderNo?shiporderno=' + option.id).then(res=>{
      //console.log(res);
      if(res.data){
        this.setData({total:res.data.total,
          containers:res.data.rows
        });
      }
    });

  },
  docompleted:function(){
    console.log('post completed');
    this.setData({
      'shiporder.ZCZT': '3',
      'shiporder.ZCZTN': '完成',
    });
    wx.showToast({
      title: '运输完成',
    })
  },
  doprint:function(){
    //发运
    console.log('post print');
    this.setData({
      'shiporder.ZCZT':'2',
      'shiporder.ZCZTN': '发运',
    });
    wx.showToast({
      title: '接单成功',
    })
  },
  uppod:function(){
    this.setData({
      'shiporder.ZCZT': '4',
      'shiporder.ZCZTN': '关闭',
    });
    wx.showToast({
      title: '运单关闭',
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  confirmModal1:function(e){
    this.setData({
      modalName: null
    });
    wx.showToast({
      title: '费用上传成功',
    })
  },
  confirmModal2: function (e) {
    this.setData({
      modalName: null
    });
    wx.showToast({
      title: '异常登记完成',
    })
  },
  ChooseImage1:function() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList1.length != 0) {
          this.setData({
            imgList1: this.data.imgList1.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList1: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage1:function(e) {
    wx.previewImage({
      urls: this.data.imgList1,
      current: e.currentTarget.dataset.url
    });
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
})