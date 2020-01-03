// pages/index/index.js

import {
  ajax
} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    page_size: 10,
    orderList: []
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    await this.getOrderList()
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


  async getOrderList() {
    const {
      page,
      page_size
    } = this.data
    const token = wx.getStorageSync('token')
    const res = await ajax({
      url: '/home/order/list',
      method:'GET',
      data: {
        token,
        page_size,
        page
      }
    })


    if (res.code === 1) {
      this.setData({
        orderList: res.data.list
      })
    }
  }
})