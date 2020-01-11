// pages/wallet/wallet.js
import {
  ajax
} from '../../api/ajax.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {
    await this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  navigate(e) {
    const {
      url
    } = e.currentTarget.dataset
    wx.navigateTo({
      url,
    })
  },


  async getUserInfo() {
    const token = wx.getStorageSync('token');
    const res = await ajax({
      url: '/mentor',
      method: 'GET',
      data: {
        token
      }
    })
    if (res.code === 1) {
      this.setData({
        userInfo: res.data
      })
    }
  },

  bind() {
    const token = wx.getStorageSync('token');

    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            method: "GET",
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              js_code: res.code,
              appid:'wxde4e32f6d4258e2e',
              secret:'99e0caa07b1df37ea79b872696be93cb',
              grant_type:'authorization_code'
            },
            success(res){
              console.log(res)
              ajax({
                method:'POST',
                url: '/wechat/login',
                data:{
                  token,
                  open_id: res.data.openid
                }
              }).then(res=>wx.showToast({
                icon:'none',
                title: res.message,
              }))
            }
          })
        } else {
          wx.showToast({
            title: '请求失败',
            mask: true
          })
        }
      }
    })
  }
})