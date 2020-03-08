// pages/login/login.js

import {
  ajax
} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: ''
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

  async login() {
    const data = this.data
    const res = await ajax({
      url: '/login',
      method: 'POST',
      data
    })

    if(res.code === 1){
      wx.setStorageSync('userInfo', res.data)
      wx.setStorageSync('token', res.data.token)
      wx.switchTab({
        url: '/pages/index/index',
      })
    }else{
      wx.showToast({
        icon:'none',
        title: res.message,
      })
    }
  },

  input(e) {
    const {
      detail: {
        value
      },
      currentTarget: {
        dataset: {
          label
        }
      }
    } = e
    this.setData({
      [label]: value
    })
  },

  call(){
    wx.makePhoneCall({
      phoneNumber: '010-53360223',
    })
  }
})