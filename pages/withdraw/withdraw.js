// pages/withdraw/withdraw.js

import {
  ajax
} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: ''
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
  onShow: function() {

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

  input(e) {
    const {
      value
    } = e.detail
    this.setData({
      total: value
    })
  },

  async apply() {
    const token = wx.getStorageSync('token')
    const {
      total
    } = this.data
    const res = await ajax({
      url: '/withdrawal/apply',
      method: 'POST',
      data: {
        token,
        total
      }
    })
    if (res.code === 1) {
      wx.showToast({
        title: '提现成功',
      })
    } else {
      wx.showToast({
        icon:'none',
        title: res.message,
      })
    }
  }
})