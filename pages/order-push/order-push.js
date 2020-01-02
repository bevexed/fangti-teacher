// pages/order/order-push/order-push.js
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
    time:0,
    audio: {},
    pause: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const query = wx.createSelectorQuery()
    query.select('.audio-progress').boundingClientRect()
    query.select('.btn').boundingClientRect()
      .exec((res) => {
        const [{
          width: progressWidth
        }, {
          width: btnWidth
        }] = res
        const _width = progressWidth - btnWidth
        const Max = _width / progressWidth * 100;
        this.setData({
          btnWidth,
          progressWidth,
          Max
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
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
      this.setData({
        marginLeft,
        time: Math.floor(currentTime)
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

    const currentTime = Math.floor(duration/Max*marginLeft)
    console.log(currentTime)
    audio.seek(currentTime)
    this.play()
  },

  play() {
    const src = 'https://fangtiyuwen.oss-cn-beijing.aliyuncs.com/admin_files/1563837c6f116e91c136e80c397f8303.mp3'

    const {
      audio
    } = this.data;
    audio.src = src

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
  }
})