// pages/playlist/playlist.js
import request from '../../utils/request';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listid: '',// 歌单id
    playList: [],// 歌曲对象
    listImg: '',// 歌单图片
    discribe: '',// 歌单描述
    song: ''// 歌名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取歌单id
    let listid = options.id;
    this.setData({
      listid: listid
    });
    // 获取歌单歌曲
    this.getPlayList(listid);
  },

  // 获取歌单所对应的歌曲
  async getPlayList(listid){
    let playListData = await request("/playlist/detail?id=", {id: listid});
    let a = playListData.playlist.tracks;
    if(a.length < 21){
      this.setData({
        playList: playListData.playlist.tracks.slice(0, 20),
        listImg: playListData.playlist.coverImgUrl,
        discribe: playListData.playlist.name
      })
    }else{
      this.setData({
        playList: playListData.playlist.tracks.slice(0, 20),
        listImg: playListData.playlist.coverImgUrl,
      })
    }

  },

  // 跳转至songDetail页面
  toSongDetail(event){
    let {song, index} = event.currentTarget.dataset;
    let playList = this.data.playList;
    // 路由跳转传参，query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id + '&index=' + index,
      success: function(res) {
        res.eventChannel.emit('recommendList',
        {
          data: playList
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(appInstance.globalData.song){
      this.setData({
        song:appInstance.globalData.song
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})