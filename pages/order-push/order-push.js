// pages/order/order-push/order-push.js
import {ajax} from '../../api/ajax.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0,
    marginLeft: 0,
    _marginLeft: 0,
    progressWidth: '',
    btnWidth: 0,
    Max: 0,
    time: 0,
    audio: {},
    pause: true,
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
    bg: 'pic_read@2x.png',
    ctx: {},
    editSize: 60,
    canvasWidth: 335,
    canvasHeight: 425,
    originCanvasWidth: 335,
    correct_display:false,
    c_name:'',
    l_name:'',
    nick_name:'',
    picture:'',
    comment_audio:'',
    comment_content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.getOrderDetail(options.uw_id)
    const query = wx.createSelectorQuery()
    query.select('.audio-progress').boundingClientRect()
    query.select('.btn').boundingClientRect()
    query.select('.canvas').boundingClientRect()
      .exec((res) => {
        const [{
          width: progressWidth
        }, {
          width: btnWidth
        }, {
          width: canvasWidth,
          height: canvasHeight
        }] = res
        const _width = progressWidth - btnWidth
        const Max = _width / progressWidth * 100;
        this.setData({
          btnWidth,
          progressWidth,
          Max,
          canvasWidth,
          canvasHeight
        })
      })

    const ctx = wx.createCanvasContext('canvas', this)

    const audio = wx.createInnerAudioContext()
    audio.onCanplay(e => {
      console.log(e, audio.duration)
    })
    audio.onPlay(e => {
      console.log('开始播放')
    })
    audio.onTimeUpdate(e => {
      const {
        currentTime,
        duration,
      } = audio;
      const {
        Max
      } = this.data;
      const marginLeft = currentTime / duration * Max
      const time = Math.floor(currentTime)
      this.drawBack()
      this.drawHistory(time)
      ctx.draw()
      this.setData({
        marginLeft,
        time
      })
    })

    audio.onEnded(e => {
      const {
        Max
      } = this.data;
      this.setData({
        marginLeft: Max,
        pause: true
      })
    })


    this.setData({
      audio,
    })

    /////////////////////////////// canvas
    const {
      bg,
      btnList,
    } = this.data
    const eList = [...btnList
      .map(item => item.e), bg
    ]
    wx.showLoading({
      title: '数据加载中',
    })

    let ePath = await this.downImgs(eList)
    this.setData({
      ePath,
      ctx
    }, async () => {
      await this.backImgInfo()
      await this.drawBack();
      ctx.draw()
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function() {

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

  touchStart(e) {

    const {
      pageX,
      audio
    } = e.touches[0]
    const {
      marginLeft
    } = this.data

    this.Pause()

    this.setData({
      startX: pageX,
      _marginLeft: marginLeft
    })
  },

  touchMove(e) {
    const {
      pageX
    } = e.touches[0];
    const {
      _marginLeft,
      startX,
      progressWidth,
      btnWidth,
      Max
    } = this.data;
    const _width = progressWidth - btnWidth

    const Min = 0;
    const change = pageX - startX
    let marginLeft = (_marginLeft + (change / _width * 100))

    marginLeft = marginLeft > Max ? Max : marginLeft
    marginLeft = marginLeft < Min ? Min : marginLeft
    this.setData({
      marginLeft,
      Max
    })
  },

  touchEnd() {
    const {
      audio,
      marginLeft,
      Max
    } = this.data;
    const {
      duration
    } = audio;

    const currentTime = Math.floor(duration / Max * marginLeft)
    console.log(currentTime)
    audio.seek(currentTime)
    this.play()
  },

  play() {
    const src =
      "https://fangtiyuwen.oss-cn-beijing.aliyuncs.com/admin_files/2ff0721f89347ce62da9a2a3b4493ddc.mp3";
    const {
      audio,
      comment_audio
    } = this.data;
    audio.src = comment_audio

    audio.play()

    this.setData({
      pause: false
    })
  },

  Pause() {
    const {
      audio
    } = this.data;
    audio.pause()
    this.setData({
      pause: true
    })
  },

  /////////////// canvas
  async downImgs(urls) {
    return urls.map(async(item, key) => {
      return await this.downloadFile(item.includes('https') ? item : ('https://fangti-mcdn.oss-cn-beijing.aliyuncs.com/appstatic/img/ft2/' + item))
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
      canvasWidth,
      canvasHeight,
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

    const r = canvasWidth / originCanvasWidth

    const _editSize = editSize * r / 2 ;

    x = x * r -  _editSize /2 
    y = y * r - _editSize/2

    ctx.drawImage(img, 0, 0, editSize, editSize, x , y, _editSize, _editSize)
  },



  drawHistory(curTime) {
    const {
      done
    } = this.data
    done.forEach(({
      x,
      y,
      btnIndex,
      time
    }) => {
      if (time >= curTime) return
      this.drawEditor(x, y, btnIndex)
    })
  },

  drawSteps(x, y, btnIndex) {
    this.drawBack()
    this.drawEditor(x, y, btnIndex)
    this.drawHistory()
  },

  async getOrderDetail(id) {
    const token = wx.getStorageSync('token');
    const res = await ajax({
      url: '/my/order/detail',
      method: "GET",
      data: {
        uw_id: id,
        token
      }
    })
    console.log(res)
    if (res.code === 1) {
      const {
        picture,
        correct_display,
        comment_content
      } = res.data
      this.setData({
        bg: picture,
        correct_display,
        done: JSON.parse(comment_content),
        ...res.data
      })
    }
  },

})