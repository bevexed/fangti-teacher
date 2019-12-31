// pages/comments/comments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx: {},
    record: {},
    bg: '',
    // no_r 没录音 
    // ing_r 正在录音
    recordState: 'no_r',
    grayList: ['btn_tick_d@2x', 'btn_wrong_d@2x', 'btn_circle_d@2x', 'btn_line_d@2x', 'btn_example_d@2x'],
    btnIndex: '',
    btnList: [{
      y: 'btn_tick_s@2x',
      g: 'btn_tick_n@2x',
      isSlected: false,
      name: 'right'
    }, {
      y: 'btn_wrong_s@2x',
      g: 'btn_wrong_n@2x',
      isSlected: false,
      name: 'error'
    }, {
      y: 'btn_circle_s@2x',
      g: 'btn_circle_n@2x',
      isSlected: false,
      name: 'round'
    }, {
      y: 'btn_line_s@2x',
      g: 'btn_line_n@2x',
      isSlected: false,
      name: 'line'
    }, {
      y: 'btn_example_s@2x',
      g: 'btn_example_n@2x',
      isSlected: false,
      name: 'expm'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const record = wx.getRecorderManager()
    const ctx = wx.createCanvasContext('canvas', this)
    this.setData({
      record,
      ctx
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.downloadFile({
      url: 'https://fangti-mcdn.oss-cn-beijing.aliyuncs.com/appstatic/img/ft2/pic_read@2x.png',
      success: (e) => {
        this.setData({
          bg: e.tempFilePath
        }, () => {
          const { ctx } = this.data
          ctx.drawImage(e.tempFilePath, 0, 0)
          ctx.draw()
        })

      }
    })
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
    this.data.audio.destroy()
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

  selectEdit(e) {
    const {
      index,
    } = e.currentTarget.dataset;
    const {
      btnList,
      btnIndex
    } = this.data
    const _btnList = btnList.map(({
      isSlected,
      ...item
    }, key) => ({
      ...item,
      isSlected: false,
    }))
    if (index === btnIndex) {
      return this.setData({
        btnList: _btnList,
        btnIndex: ''
      })
    }
    _btnList[index].isSlected = true
    this.setData({
      btnList: _btnList,
      btnIndex: index
    })
  },

  startRecord() {
    this.setData({
      recordState: 'ing_r'
    })
  },
  stopRecord() {
    const {
      btnList,
    } = this.data
    const _btnList = btnList.map(({
      isSlected,
      ...item
    }, key) => ({
      ...item,
      isSlected: false,
    }))
    this.setData({
      recordState: 'no_r',
      btnIndex:'',
      btnList:_btnList
    })
  }
})