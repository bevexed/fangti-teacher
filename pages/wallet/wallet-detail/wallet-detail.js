// pages/wallet/wallet-detail/wallet-detail.js

import {
  ajax
} from '../../../api/ajax.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cur: 0,

    barList: [{
        label: '收益明细'
      },
      {
        label: '提现明细'
      }
    ],

    WithDrawlList: [],
    IncomeList: []
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
    this.changeBar({currentTarget:{dataset:{index:0}}})
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

  async changeBar(e) {
    const {
      index
    } = e.currentTarget.dataset
    if (index === 0) {
      await this.getInComeList()

    } else {
      await this.getWithDrawlList()

    }

    this.setData({
      cur: index
    })
  },
  async getInComeList() {
    const token = wx.getStorageSync('token')
    const res = await ajax({
      url: '/my/income/list',
      method: 'GET',
      data: {
        token,
        page_size: 1000
      }
    })

    if (res.code === 1) {
      this.setData({
        IncomeList: res.data.list
      })
    }
  },


  async getWithDrawlList() {
    const token = wx.getStorageSync('token')
    const res = await ajax({
      url: '/withdrawal/lists',
      method: 'GET',
      data: {
        token,
        page_size: 1000
      }
    })

    if (res.code === 1) {
      this.setData({
        WithDrawlList: res.data.list
      })
    }
  }
})