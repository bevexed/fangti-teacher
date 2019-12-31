// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#00BD81",
    "list": [{
      "pagePath": "/pages/index/index",
      "text": "首页",
      "iconPath": "/static/img/tab_ico_home_n@2x.png",
      "selectedIconPath": "/static/img/tab_ico_home_s@2x.png"
    }, {
      "pagePath": "/pages/person/person",
      "text": "个人中心",
      "iconPath": "/static/img/tab_ico_mine_n.png",
      "selectedIconPath": "/static/img/tab_ico_mine_n@2x.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url,
        complete(e) {
          console.log(e)
        }
      })
      this.setData({
        selected: data.index
      })
    }
  }
})