// pages/safe/safe.js

import {
  ajax
} from '../../api/ajax'

Page({

  /**
   * 页面的初始数据
   */
  data: {
     userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
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

  navigate(e) {
    const {
      url
    } = e.currentTarget.dataset
    wx.navigateTo({
      url,
    })
  },

  connect() {
    const {customer_service_phone} = this.data.userInfo
     wx.makePhoneCall({
       phoneNumber: customer_service_phone + '',
       fail(e){
         console.log(e)
       }
     })
  },

  loginOut(){
    wx.clearStorage({
      complete: (res) => {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      },
    })
  }


})