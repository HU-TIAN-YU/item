module.exports = {
  // 免密登录保持时间, 单位: 秒(s)
  tokenKeep: 60 * 60,
  // token 的签证字符串, 可以自主更改
  tokenSignkey: 'guoxiang',
  // 用户名的正则, 可以自主更改
  username: /^\w{5,10}$/,
  // 密码的正则, 可以自主更改
  password: /^[\w\-]{6,18}$/,
  //姓名的正则
  nickname: /^[\u4E00-\u9FA5\w]{3,8}$/,
  // 重启服务器是否保持登录状态
  keep: false
}
