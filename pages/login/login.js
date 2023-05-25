import request from "../../utils/request";
/**
 * 登录
 * 手机号码和邮箱登录都绕不开验证，验证需要用网易云app才能完成，决定用二维码登录
 * 1、获取key
 * 2、create二维码，展示二维码
 * 3、check状态，800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
 * 需要带上时间戳(获取key和check状态需要)
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    base64: '',// 传送base64的图像
    islogin: false, // 登陆状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登录
    let islogin = this.data.islogin;
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      islogin = false
    }else{
      islogin = true
    }
    this.setData({
      islogin
    })
  },
 
  // 二维码登录
  login: async function(){
    // 生成时间戳
    let timestamp = Date.now();
    // 获取key
    let getkey = await request('/login/qr/key?timestamp=' + timestamp);
    let key = getkey.data.unikey;
    // 获取二维码图片，base可以直接传入image的scr里能够直接出图
    let sginImageURL = await request('/login/qr/create?qrimg=true&key=' + key);
    this.setData({
      base64: sginImageURL.data.qrimg
    });
    // 每3秒查一次登陆状态
    let check = setInterval(async () => {
      let timestamp2 = new Date().getTime();
      let res = await request('/login/qr/check?key=' + key + '&timestamp=' + timestamp2);

      // 二维码失效
      if (res.code == 800) {
        wx.showToast({
          title: res.message
        });
        clearInterval(check)
      }
      // 登陆成功
      else if (res.code == 803) {
        wx.showToast({
          title: '提示',
          content: res.message
        });
        // 将cookie存入本地
        wx.setStorage({
          key: 'cookie',
          data: res.cookie
        });
        // 获取cookie，并用来拿取头像昵称等信息
        // 将用户的信息存储至本地
        let userInfo = await request('/login/status?cookie=' + res.cookie);
        wx.setStorageSync('userInfo', JSON.stringify(userInfo.data.profile));
        // 跳转至个人中心personal页面
        wx.reLaunch({
          url: '/pages/personal/personal',
        })
        clearInterval(check)
      }
    }, 3000)
  },


  // 退出登录
  async loginout(){
    await request('/logout');
    this.setData({
      islogin: false
    });
    wx.clearStorageSync();
    // 跳转至个人中心personal页面
    wx.reLaunch({
      url: '/pages/personal/personal',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})