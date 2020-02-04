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
    this.setData({
      page:1,
      orderList:[]
    }, async () => await this.getOrderList() )
   
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
    const {page} = this.data;
    const _page = page + 1;
    this.setData({
      page: _page
    }, async() =>await this.getOrderList())
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  async getOrderList() {
    const {
      page,
      page_size,
      orderList
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
        orderList: [...orderList,...res.data.list]
      })
    }
  },

  navigate(e) {
    const {
      state, id
    } = e.currentTarget.dataset
    wx.navigateTo({
      url: "/pages/order-preview/order-preview?id="+id,
    })
  },

  async takingOrder(e){
    const { uw_id} = e.currentTarget.dataset
    const token = wx.getStorageSync('token')
    const res = await ajax({
      url: '/home/order/taking',
      method: 'POST',
      data: {
        token,
        uw_id
      }
    })
    if (res.code === 0){
      wx.showToast({
        icon:"none",
        title: res.message,
        mask:true
      })
    }else{
      wx.showToast({
        title: res.message,
        mask: true
      })
      this.setData({
        page: 1,
        orderList: []
      }, async () => await this.getOrderList())
    }
  }
})