import request from "../../utils/request";
let startY = 0; // 手指起始坐标
let moveY = 0; // 手指移动坐标
let moveDistance = 0; // 手指移动的距离
Page({
  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},// 用户信息
    recentPlayList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      // 更新userInfo的状态
      this.setData({
        userInfo: JSON.parse(userInfo)
      });

      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId)
    }
  },

  // 获取最近播放记录
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record', {uid: userId, type: 0});
    let index = 0;
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item => {
      item.id = index++;
      return item;
    });
    this.setData({
      recentPlayList
    })
  },

  // 触碰开始
  handleTouchStart(event){
    this.setData({
      coverTransition: ''
    })
    // 获取手指起始坐标
    startY = event.touches[0].clientY;
  },

  // 开始移动
  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;

    if(moveDistance <= 0){
      return;
    };
    if(moveDistance >= 80){
      moveDistance = 80;
    };
    // 动态更新coverTransform的状态值,`模板字符串(${变量用$包起来})`
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },

  // 触碰结束
  handleTouchEnd(){
    // 动态更新coverTransform的状态值,`模板字符串(${变量用$包起来})`
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },

  // 跳转至登录Login界面的回调
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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