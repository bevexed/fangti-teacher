// pages/order/order.js

import {ajax} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page_size:10,
    type:1,
    page:1,
    tabBar:[{
      state:'未批改',
      type:1
    },{
      state:'已批改',
      type:2
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.setData({
    //   page: 1,
    //   list: [],
    //   type:1
    // }, async () => await this.getOrderList())
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
     this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    const {type} = this.data
    this.setData({
      page: 1,
      list: [],
      type
    })
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
    const { page } = this.data;
    const _page = page + 1;
    this.setData({
      page: _page
    }, async () => await this.getOrderList())
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  navigate(e) {
    const {
      state,id
    } = e.currentTarget.dataset
    const url = state === 1 ? ('/pages/comments/comments?id='+id) : ('/pages/order-push/order-push?uw_id='+id);
    wx.navigateTo({
      url,
    })
  },

  async getOrderList(){
    const {
      page,
      page_size,
      list,
      type
    } = this.data
    const token = wx.getStorageSync('token')
    const res = await ajax({
      url: '/my/order/list',
      method:"GET",
      data:{
        page,
        token,
        page_size,
        type
      }
    })
    if(res.code ===1){
      this.setData({
        list:[...list,...res.data.list]
      })
    }
  },

  changeBar(e){
    const {type} = e.currentTarget.dataset
    this.setData({type})
    this.setData({
      page: 1,
      list: [],
      type
    }, async () => await this.getOrderList())
  }
})