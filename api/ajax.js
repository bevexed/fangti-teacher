export const baseUrl = 'https://teacher.fangti.com/api'

export const ajax = ({
  url,
  method,
  data = {}
}) => new Promise((
  resolve, reject
) => wx.request({
  url: baseUrl + url,
  method,
  data,
  success: res => {
    console.log(res)
    if (res.data.code === -2) {
      wx.hideLoading({
        complete: (result) => {
          wx.showToast({
            icon: 'none',
            title: res.data.message,
            success() {
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 1500)
            }
          })
        },
      })
      return
    }
    resolve(res.data)
  }
}))