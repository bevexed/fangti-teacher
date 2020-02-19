// pages/certification/certification.js

import {ajax} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  info:{}
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
        info: res.data
      })
    }
  },


  call(e){
    console.log(e)
    const {phoneNumber} = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber:phoneNumber+'',
      complete: (res) => {},
      fail: (res) => {console.log(res)},
      success: (res) => {},
    })
  }
})