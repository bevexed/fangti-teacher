// pages/password/change-password.js

import {
  ajax
} from '../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    new_password: '',
    new_password_confirmation: ''
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
      type
    } = e.currentTarget.dataset
    const {
      value
    } = e.detail
    console.log(e)
    this.setData({
      [type]: value
    })
  },

  async changePassword() {
    const token = wx.getStorageSync('token')
    const {password,new_password,new_password_confirmation} = this.data
    
    const res = await ajax({
      url: '/password/edit',
      method: "POST",
      data:{
        token,
        password, 
        new_password, 
        new_password_confirmation
      }
    })

    if(res.code === 0){
      wx.showToast({
        icon:'none',
        mask:true,
        title: res.message,
      })
    }else{
      wx.showToast({
        mask: true,
        title: res.message,
        success(){
          setTimeout(()=>{
        wx.navigateBack({delta:1})
          },2000)
        }
      })
    }
  }
})