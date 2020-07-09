// pages/bind/bind.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    password: "",
    pwdFocus: false,
    userFocus: true,
    opneId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.openId) {
      this.setData({
        opneId: app.globalData.openId
      })
    } else {
      let o = wx.getStorageSync('openId')
      this.setData({
        opneId: o
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setUsername: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  setPassword: function (e) {
    this.setData({
      password: e.detail.value
    });
  },
  handleConfirmUser: function (e) {
    this.setData({
      userFocus: false
    });
    this.setData({
      pwdFocus: true
    });
  },
  handleConfirmPwd: function (e) {
    this.setData({
      pwdFocus: false
    });
    this.bindAccount();
  },
  /**
   * 绑定账户，成功后进入写入信息并跳转到index，失败了弹出提示停留在本页面
   */
  bindAccount:function(e){
    if (!this.data.username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        mask: true
      })
      this.setData({
        userFocus: true
      });
      return;
    }
    if (!this.data.password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        mask: true
      })
      this.setData({
        pwdFocus: true
      });
      return;
    }
    let _this = this;
    wx.showLoading({
      title: '登录中，请稍候...',
      mask: true
    })
    wx.request({
      url: `${app.globalData.serverPath}/xcx/bind`,
      method: 'POST',
      header: app.globalData.getHeader(),
      data: {
        username: _this.data.username,
        password: _this.data.password,
        openid: _this.data.opneId
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.errcode == '0') {//登录成功-home
          app.globalData.token = res.data.token
          app.globalData.accountInfo = res.data.account;
          wx.navigateTo({
            url: '/pages/index/index',
          })
        } else {//提示错误信息
          wx.showToast({
            icon:'none',
            title: res.data.errmsg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: JSON.stringify(res)
        })
      }
    })
  /*    app.globalData.accountInfo = {}
      wx.navigateTo({
        url: '/pages/index/index',
      })
      */
  }

})