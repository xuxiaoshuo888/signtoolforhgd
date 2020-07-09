//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //TODO 后台会验证是否绑定了身份，设置accoutInfo
        
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res.authSetting['scope.userInfo']);
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
    serverPath:"http://192.168.0.20:8888",
    userInfo: null,
    token:'',
    accountInfo: null,//accoutInfo标识我们自己的后台账户，如果没有绑定则为null
    getAuthHeader: function () {
      var headers = {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/x-www-form-urlencoded"
      }
      return headers;
    },
    getHeader: function () {
      var headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      }
      return headers;
    }
  }
})