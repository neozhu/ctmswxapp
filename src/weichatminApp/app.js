//app.js
App({
  onLaunch: function() {

    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    tmsstatus: [{
      value: '0',
      text: '等待派车'
    }, 
      { value: '1', text: '派车' },
      { value: '2', text: '发运' },
      { value: '3', text: '完成' },
      { value: '4', text: '关闭' },
      { value: '5', text: '取消' },
      { value: '6', text: '甩板' },
      { value: '7', text: '异常' }
    ],
    tmczlx: [
      { value: 'C', text: '提箱' },
      { value: 'D', text: '落箱' },
      { value: 'E', text: '退关还箱' },
      { value: 'J', text: '进港' },
      { value: 'L', text: '装箱' },
      { value: 'O', text: '其它' },
      { value: 'R', text: '还箱' },
      { value: 'S', text: '拆箱' },
      { value: 'T', text: '拖箱' }
    ],
    tmxzt: [{ value: 'E', text: '空箱' }, { value: 'F', text: '重箱' }],
    tmpclx: [{ value: '0', text: '长程' }, { value: '1', text: '短驳' }],
    tmtrqtype: [{ value: 'OE01', text: '出口整箱' },
      { value: 'OE02', text: '出口拼箱' }, 
      { value: 'OI01', text: '进口整箱' },
      { value: 'OI02', text: '出口整箱' }
    ]
  }
})