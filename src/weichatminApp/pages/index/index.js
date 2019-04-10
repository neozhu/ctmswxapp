import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

axios.defaults.adapter = mpAdapter

const app = getApp()
const http = axios.create({
  baseURL: 'http://221.224.21.30:2021/api/'
})
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    completedTotal: 0,
    exTotal: 0,
    taskTotal: 0,
    gridCol: 3,
    skin: false,
    iconList: [{
      icon: 'text',
      color: 'olive',
      badge: 0,
      name: '订单',
      status:0
    }, {
      icon: 'pick',
      color: 'orange',
      badge: 0,
      name: '指派',
      status:1
    },
    {
        icon: 'deliver',
        color: 'orange',
        badge: 0,
        name: '发运',
        status:2
      }, {
      icon: 'squarecheck',
      color: 'orange',
      badge: 0,
      name: '完成',
      status:3
    }, {
      icon: 'tag',
      color: 'orange',
      badge: 0,
      name: '甩板',
      status:-1
    }, {
      icon: 'warn',
      color: 'red',
      badge: 0,
      name: '异常',
      status:'7'
    }],
  },
  tolist:function(e){
    console.log(e.currentTarget.dataset.status);
    const status = e.currentTarget.dataset.status;
    if(status==0){
      wx.navigateTo({ url: '/pages/order/list?status=0' });
    }else{
      wx.navigateTo({ url: '/pages/shiporder/list' });
    }
  },
 onLoad:function(e){
   console.log('....onload')
    
   
   http.get('TmOrders/GetCount').then(res=>{
     let count= res.data.filter(item=>{return item.Key=='0'}).map(item=>item.Count);
     if (count){
       this.setData({
         'iconList[0].badge': count[0]
       })
     }
   });
   http.get('ShippingTasks/GetCount').then(res=>{
     let taskcount=0;
     let completecount=0;
     let doingcount=0;
     let shippingcount=0;
     let excount=0;
     res.data.forEach(item=>{
       if(item.Key==1){
         taskcount += item.Count;
         this.setData({
           'iconList[1].badge': item.Count
         });
       } else if (item.Key == 2){
         taskcount += item.Count;
         this.setData({
           'iconList[2].badge': item.Count
         });
       } else if (item.Key == 3) {
         completecount=item.Count;
         this.setData({
           'iconList[3].badge': item.Count
         });
       }
       else if (item.Key == 6) {
         taskcount += item.Count;
         this.setData({
           'iconList[4].badge': item.Count
         });
       }
     });

     this.setData({
       taskTotal: taskcount,
       completedTotal: completecount
     });
     http.get('TmOrderExceptions/GetCount').then(res => {
   
       this.setData({
         exTotal: res.data,
         'iconList[5].badge': res.data
       });
     });

   });

 }
})
