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
    resolve(res.data)
  }
}))