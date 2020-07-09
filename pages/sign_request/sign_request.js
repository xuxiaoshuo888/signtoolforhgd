// pages/sign_request/sign_reqeust.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canISign:false,//是否可以签名
    lastSignId:'',
    signNotice:'',//如果不可签名，提示信息
    list:[],
    sign_request: {
      id:"",
      describe: "",
      system: "",
      time: ""
    }
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
    this.refreshSignRequest()
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

  /**
   * 刷新签名请求数据
   */
  refreshSignRequest: function(){
    let _this = this;
    console.log(app.globalData.token);
    //请求签名服务，如果获取到值则对sign_request进行赋值
    console.log(`${app.globalData.serverPath}/xcx/sign/query`)
    wx.request({
      url: `${app.globalData.serverPath}/xcx/sign/query`,
      header: app.globalData.getAuthHeader(),
      success(res) {
        console.log(res.data)
        if (res.data.errcode === '0') {//已绑定，直接进入主界面
          if(res.data.data){//有签名
            _this.setData({
              list:res.data.data,
              // sign_request:{
              //   id:res.data.data.id,
              //   describe: res.data.data.desc,
              //   system: res.data.data.app,
              //   time: res.data.data.whenCreated
              // },
              canISign:true,
              // lastSignId:res.data.lastSignId
            })
          }else{//没签名数据
            wx.showToast({
              icon: 'none',
              title: res.data.errmsg,
            })
            _this.setData({
              canISign:false,
              signNotice:res.data.errmsg,
            })
          }
        } else {
          _this.setData({
            canISign:false,
            signNotice:res.data.errmsg,
          })
          wx.showToast({
            icon: 'none',
            title: res.data.errmsg,
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: JSON.stringify(res)
        })
      }
    })
  },

  toSignPage: function(){
    wx.navigateTo({
      url: '/pages/sign/sign',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toSign(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/sign/sign?id=' + id
    })
  },
  useLastSign:function(){
    let _this = this;
    console.log(app.globalData.token);
    //使用上次的签名
    wx.request({
      url: `${app.globalData.serverPath}/xcx/sign/saveByLast`,
      header: app.globalData.getAuthHeader(),
      success(res) {
        console.log(res.data)
        if (res.data.errcode === '0') {//已绑定，直接进入主界面
          wx.showToast({
            icon: 'none',
            duration:5000,
            title: '使用上次签名成功，\r\n请在PC端点击“我已完成签名”',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.errmsg,
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: JSON.stringify(res)
        })
      }
    })
  }
    
})