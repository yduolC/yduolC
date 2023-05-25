import request from "../../utils/request";
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [],// 推荐列表数据
    song: ''// 歌名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 跳转至登陆界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }else{
      // 更新每日推荐数据
      this.getRecommendList();
    }
  },

  // 获取每日推荐数据
  async getRecommendList(){
    let cookie = wx.getStorageSync('cookie');
    let recommendListData = await request('/recommend/songs?cookie=' + cookie);
    this.setData({
      recommendList: recommendListData.data.dailySongs
    })
  },

  // 跳转至songDetail页面
  toSongDetail(event){
    let {song, index} = event.currentTarget.dataset;
    let {recommendList} = this.data
    // 路由跳转传参，query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id + '&index=' + index,
      success: function(res) {
        res.eventChannel.emit('recommendList',
        {
          data: recommendList
        })
      }
    })
  },

  // 跳转至正在播放页面
  toSong(){
    let id = appInstance.globalData.musicId;
    let index = appInstance.globalData.index;
    let playList = appInstance.globalData.songList;
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + id + '&index=' + index + '&tosong=1',
      success: function(res) {
        res.eventChannel.emit('recommendList',
        {
          data: playList
        })
      }
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
    if(appInstance.globalData.song){
      this.setData({
        song:appInstance.globalData.song
      })
    }
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