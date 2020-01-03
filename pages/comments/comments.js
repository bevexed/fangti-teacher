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
    record: {},
    btnIndex: '',
    ctx: {},
    bg: 'pic_read@2x.png',
    time: 0,
    // no_r 没录音 
    // ing_r 正在录音
    recordState: 'no_r',
    grayList: ['btn_tick_d@2x', 'btn_wrong_d@2x', 'btn_circle_d@2x', 'btn_line_d@2x', 'btn_example_d@2x'],
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
    backImgInfo: {},
    ePath: [],
    tempFilePath: '',
    duration: '',
    editSize: 60,
    canvasWidth: 335,
    canvasHeight: 425,
    originCanvasWidth: 335,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const record = wx.getRecorderManager()
    record.onStop(({
      tempFilePath,
      duration
    }) => {
      this.setData({
        tempFilePath,
        duration
      })
    })
    const ctx = wx.createCanvasContext('canvas', this)
    const query = wx.createSelectorQuery()
    query.select('.canvas').boundingClientRect()
      .exec((res) => {
        const [ {
          width: canvasWidth,
          height: canvasHeight
        }] = res
        this.setData({
          canvasWidth,
          canvasHeight,
        })
      })

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

    wx.showLoading({
      title: '数据加载中',
    })

    let ePath = await this.downImgs(eList)
    this.setData({
      ePath
    }, async() => {
      await this.backImgInfo()
      await this.drawBack();
      ctx.draw()
      wx.hideLoading()
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
      ePath,
      backImgInfo,
      canvasWidth
    } = this.data;
    const {
      width,
      height,
      _height,
      _width
    } = backImgInfo
    await ctx.drawImage(await ePath[5], 0, 0, width, height, 0, 0, canvasWidth, _height)
  },

  backImgInfo() {
    return new Promise(async(resolve) => {
      const {
        canvasWidth,
        canvasHeight,
        ePath
      } = this.data;
      wx.getImageInfo({
        src: await ePath[5],
        success: async(e) => {
          const {
            width,
            height
          } = e;

          let _width, _height;
          if (width < height) {
            _height = canvasHeight
            _width = Math.floor(width * _height / height)
          } else {
            _width = canvasWidth;
            _height = Math.floor(_width * height / width)
          }
          this.setData({
            backImgInfo: {
              width,
              height,
              _height,
              _width
            }
          })

          resolve({
            width,
            height,
            _height,
            _width
          })
        }
      })
    })
  },
  async drawEditor(x, y, btnIndex) {
    let {
      ePath,
      startX,
      startY,
      endX,
      endY,
      ctx,
      editSize,
      canvasWidth,
      originCanvasWidth
    } = this.data
    const img = await ePath[btnIndex]
    
    const r = canvasWidth/originCanvasWidth 

   let _editSize = editSize  *r;


    ctx.drawImage(img, 0, 0, editSize, editSize, x - editSize / 2, y - editSize / 2, _editSize/2, _editSize/2)
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

  drawSteps(x, y, btnIndex) {
    this.drawBack()
    this.drawEditor(x, y, btnIndex)
    this.drawHistory()
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
    const {
      record
    } = this.data;
    const open = () => {
      this.setData({
        recordState: 'ing_r',
        time: this.data.time + 1,
      })
    }
    open()
    const timer = setInterval(open, 1000)
    record.start()
    this.setData({
      timer
    })
  },
  stopRecord() {
    const {
      btnList,
      timer,
      record
    } = this.data

    record.stop()
    clearInterval(timer)
    const _btnList = btnList.map(({
      isSlected,
      ...item
    }, key) => ({
      ...item,
      isSlected: false,
    }))
    this.setData({
      recordState: 'end_r',
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
      ctx,
      btnIndex,
    } = this.data
    if (typeof btnIndex !== 'number') return (wx.showToast({
      title: '请选择先选择画笔',
      icon: 'none'
    }))

    this.drawSteps(x, y, btnIndex)
    ctx.draw()

    this.setData({
      x: Math.floor(x),
      y: Math.floor(y)
    })
  },
  touchMove(e) {
    const {
      ctx,
      btnIndex,
      canvasWidth,
      canvasHeight
    } = this.data

    let {
      x,
      y
    } = e.touches[0];
    if (x > canvasWidth) {
      x = canvasWidth
    }
    if (x < 0) {
      x = 0
    }
    if (y > canvasHeight) {
      y = canvasHeight
    }
    if (y < 0) {
      y = 0
    }

    if (typeof btnIndex !== 'number') return
    this.drawSteps(x, y, btnIndex)
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
      ctx,
      done,
      canvasWidth,
      originCanvasWidth
    } = this.data

    if (typeof btnIndex !== 'number') return
    const r = canvasWidth / originCanvasWidth 

    done.push({
      x:x/r,
      y:y/r,
      time,
      btnIndex
    })

    this.drawSteps(x, y, btnIndex)
    ctx.draw()


    this.setData({
      done
    })
  },

  cancel() {
    const {
      ctx
    } = this.data
    this.setData({
      done: [],
      x: '',
      y: '',
      btnIndex: '',
      timer: '',
      recordState: 'no_r'
    }, async() => {
      await this.drawBack()
      ctx.draw()
    })

  },
  save() {
    const {done,tempFilePath} = this.data
    wx.setStorageSync('done',done)
    wx.setStorageSync('tempFilePath', tempFilePath)
    wx.navigateTo({
      url: '/pages/order-push/order-push',
    })
  }
})