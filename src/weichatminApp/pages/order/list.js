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
    loadModal:false,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    date: dayjs().format('YYYY-MM-DD'),
    picker: ['ALL','海运进口-整箱', '海运进口-散箱', '海运出口-整箱', '海运出口-散箱'],
    total: 0,
    rows: [],
    allrows:[]
  },
  onLoad: function(option) {
    //console.log(option.status)
    this.loadModal();
    http.get('TmOrders/GetPageData').then(res => {
      //console.log(res);
      this.setData({
        total: res.data.total,
      });
      let rows = [];
      res.data.rows.forEach((item, index) => {
        //console.log(item);
        let str = `rows[${index}]`;
        let row = {};
        row.TRQ_ID = item.TRQ_ID;
        row.TURES_ID = item.TURES_ID;
        row.TURES_TCO = item.TURES_TCO;
        row.ZZT = item.ZZT;
        row.Id = item.Id;
        row.ZCZLX = item.ZCZLX;
        row.TRQ_TYPE = item.TRQ_TYPE;
        switch (item.ZCZLX) {
          case 'C':
            row.ZCZLXN = '提箱';
            break;
          case 'S':
            row.ZCZLXN = '拆箱';
            break;
          case 'R':
            row.ZCZLXN = '还箱';
            break;
          case 'L':
            row.ZCZLXN = '装箱';
            break;
          case 'D':
            row.ZCZLXN = '落箱';
            break;
          case 'T':
            row.ZCZLXN = '拖箱';
            break;
          case 'C':
            row.ZCZLXN = '提箱';
            break;
          case 'J':
            row.ZCZLXN ='进港';
        }
        switch (item.TRQ_TYPE) {
          case 'OI01':
            row.TRQ_TYPEN = '海运进口整箱';
            break;
          case 'OI02':
            row.TRQ_TYPEN = '海运进口散箱';
            break;
          case 'OE01':
            row.TRQ_TYPEN = '海运出口整箱';
            break;
          case 'OE02':
            row.TRQ_TYPEN = '海运出口散箱';
            break;
          
        }
        switch (item.ZZT) {
          case '0':
            row.ZZTN = '新增';
            break;
          case '1':
            row.ZZTN = '派车';
            break;
          case '2':
            row.ZZTN = '在途';
            break;
          case '3':
            row.ZZTN = '完成';
            break;
          case '4':
            row.ZZTN = '关闭';
            break;
          case '5':
            row.ZZTN = '取消';
            break;
          case '6':
            row.ZZTN = '甩板';
            break;
          case '7':
            row.ZZTN = '异常';
            break;
        }
          
     
        row.ZJDRQ = dayjs(item.ZJDRQ).format('MM-DD');
        rows.push(row);


      });
      this.setData({
        rows: rows,
        allrows:rows
      });
      this.completedLoading();
    })
  },
  showModal: function(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  loadModal:function() {
    this.setData({
      loadModal: true
    }) 
  },
  completedLoading:function(){
    this.setData({
      loadModal: false
    })
  },
  hideModal: function(e) {
    this.setData({
      modalName: null
    })
  },
  PickerChange: function(e) {
    console.log(e.detail.value);
    if (e.detail.value == 0) {
      //ALL
      let rows = this.data.allrows ;
      this.setData({
        rows: rows
      });
    }else    if(e.detail.value==1){
      //海运进口整箱
      let rows=this.data.allrows.filter(item=>{
         return item.TRQ_TYPE=='OI01'
      });
      this.setData({
          rows:rows
      });
    } else if (e.detail.value == 2){
      //海运进口散箱
      let rows = this.data.allrows.filter(item => {
        return item.TRQ_TYPE == 'OI02'
      });
      this.setData({
        rows: rows
      });
    }
    else if (e.detail.value == 3) {
      //海运出口整箱
      let rows = this.data.allrows.filter(item => {
        return item.TRQ_TYPE == 'OE01'
      });
      this.setData({
        rows: rows
      });
    }
    else if (e.detail.value == 4) {
      //海运出口散箱
      let rows = this.data.allrows.filter(item => {
        return item.TRQ_TYPE == 'OE02'
      });
      this.setData({
        rows: rows
      });
    }
    this.setData({
      index: e.detail.value
    })
  },
  DateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  todetail: function(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/order/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  }
})