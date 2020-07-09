//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    hasAccountInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    accountInfo:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let _this = this;
    //获取登录信息
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
      let code = res.code;
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      console.log(`${app.globalData.serverPath}/xcx/login`);//原始登录接口
      //https://xg.hzau.edu.cn/xg/login   //测试用登录接口
        wx.request({
          url: `${app.globalData.serverPath}/xcx/login`,
          method: 'POST',
          data:{code:code},
          header:app.globalData.getHeader(),
          dataType: 'json',
          success: function (res) {
            console.log(res.data);
            wx.hideLoading();
            if(res.data.errcode == '0'){//已绑定，获得token、accountInfo
              console.log(res.data);
              app.globalData.token = res.data.token;
              app.globalData.accountInfo = res.data.account;
              //app.hasAccountInfo = true;
              _this.setData({
                hasAccountInfo:true,
                accountInfo:res.data.account
              })
            }else if(res.data.errcode == '20001'){//未绑定，获得单点登录地址,并跳转到单点登录页
              wx.setStorage({
                key: "openId",
                data: res.data.openid
              })
              app.globalData.openid = res.data.openid
              if(res.data.url){//如果有单点登陆地址就打开web-view
                wx.setStorage({
                  key: "web-view-url",
                  data: res.data.url
                })
                wx.navigateTo({
                  url: '../bind/webLogin',
                })
              }
            }else{//提示错误信息
              wx.showToast({
                title: res.data.errmsg,
                icon:'none',
                mask: true
              })
            }
          },
          fail: function (res) {
            console.log(res);
            wx.hideLoading();            
            wx.showToast({
              title: res.errMsg,
              icon:'none',
              mask: true
            })
           }
        })
      }
    })


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function(){
    //显示的时候需要刷新身份状态，因为可能是绑定身份后再次呈现本页面
    if (app.globalData.accountInfo) {
      console.log("set the hasAccountInfo values true!!!");
      this.setData({
        hasAccountInfo:true
      })
    }
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toBindAccount:function(e){
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
  },
  toSign: function(e){
    wx.navigateTo({
      url: '/pages/sign_request/sign_request',
    })
  }
})
