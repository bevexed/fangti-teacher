// pages/comments/comments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: '',
    y: '',
    timer: '',
    done: [],
    ctx: {},
    record: {},
    bg: 'pic_read@2x.png',
    time: 0,
    // no_r 没录音 
    // ing_r 正在录音
    recordState: 'no_r',
    grayList: ['btn_tick_d@2x', 'btn_wrong_d@2x', 'btn_circle_d@2x', 'btn_line_d@2x', 'btn_example_d@2x'],
    btnIndex: '',
    btnList: [{
      y: 'btn_tick_s@2x',
      g: 'btn_tick_n@2x',
      e: 'ico_tick_h@2x.png',
      isSlected: false,
      name: 'right'
    }, {
      y: 'btn_wrong_s@2x',
      g: 'btn_wrong_n@2x',
      e: 'ico_del_h@2x.png',
      isSlected: false,
      name: 'error'
    }, {
      y: 'btn_circle_s@2x',
      g: 'btn_circle_n@2x',
      isSlected: false,
      e: 'pic_circle_h@2x.png',
      name: 'round'
    }, {
      y: 'btn_line_s@2x',
      g: 'btn_line_n@2x',
      e: 'pic_line_h@2x.png',
      isSlected: false,
      name: 'line'
    }, {
      y: 'btn_example_s@2x',
      g: 'btn_example_n@2x',
      e: 'ico_tick_h@2x.png',
      isSlected: false,
      name: 'expm'
    }],
    ePath: []
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
  onReady: async function() {
    const {
      bg,
      btnList,
      ctx
    } = this.data
    const eList = [...btnList
      .map(item => item.e), bg
    ]

    let ePath = await this.downImgs(eList)
    this.setData({
      ePath
    }, async() => {
      await this.drawBack();
      ctx.draw()
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
  async downImgs(urls) {
    return urls.map(async(item, key) => {
      return await this.downloadFile('https://fangti-mcdn.oss-cn-beijing.aliyuncs.com/appstatic/img/ft2/' + item)
    })
  },

  async downloadFile(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success: function(res) {
          resolve(res.tempFilePath)
        },
      })
    })

  },

  async drawBack() {
    const {
      ctx,
      ePath
    } = this.data;
    ctx.drawImage(await ePath[5], 0, 0)
  },

  async drawEditor(x, y, btnIndex) {
    const {
      ePath,
      startX,
      startY,
      endX,
      endY,
      ctx
    } = this.data
    const img = await ePath[btnIndex || this.data.btnIndex]

    ctx.drawImage(img, x, y)
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

  drawHistory() {
    const {
      done
    } = this.data
    done.forEach(({
        x,
        y,
        btnIndex
      }) =>
      this.drawEditor(x, y, btnIndex)
    )
  },

  startRecord() {
    this.timer = setInterval(() => {
      this.setData({
        recordState: 'ing_r',
        time: this.data.time + 1
      })
    }, 1000)
  },
  stopRecord() {
    const {
      btnList,
      timer
    } = this.data
    clearInterval(timer)
    const _btnList = btnList.map(({
      isSlected,
      ...item
    }, key) => ({
      ...item,
      isSlected: false,
    }))
    this.setData({
      recordState: 'no_r',
      btnIndex: '',
      btnList: _btnList
    })
  },
  touchStart(e) {
    const {
      x,
      y
    } = e.touches[0];
    const {
      ctx
    } = this.data

    this.drawBack()
    this.drawEditor(x, y)
    this.drawHistory()
    ctx.draw()

    this.setData({
      x: Math.floor(x),
      y: Math.floor(y)
    })
  },
  touchMove(e) {
    const {
      ctx
    } = this.data

    let {
      x,
      y
    } = e.touches[0];
    if (x > 335) {
      x = 335
    }
    if (x < 0) {
      x = 0
    }
    if (y > 425) {
      y = 425
    }
    if (y < 0) {
      y = 0
    }
    this.drawBack()
    this.drawEditor(x, y)
    this.drawHistory()
    ctx.draw()
    this.setData({
      x: Math.floor(x),
      y: Math.floor(y)
    })


  },
  touchEnd(e) {
    const {
      x,
      y,
      time,
      btnIndex,
      done
    } = this.data
    done.push({
      x,
      y,
      time,
      btnIndex
    })
    this.setData({
      done
    }, () => console.log(this.data.done))
  }
})