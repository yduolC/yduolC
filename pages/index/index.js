// pages/index/index.js
import request from "../../utils/request";
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],// 轮播图数据
    recommendList: [],// 推荐歌单
    topList: [],// 排行榜数据
    altopList: [],// 全排行榜数据
    song: '',// 歌名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 轮播图数据
    let bannerListData = await request('/banner', {type: 2});
    this.setData({
      bannerList: bannerListData.banners
    });

    // 获取推荐歌单数据
    let recommendListData = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListData.result
    });

    // 获取排行榜数据
    /**
     * 原本直接得到palylist的方法行不通
     * 现通过topList获取排行榜的id，再去playlist里拿到相应排行榜的歌曲信息和图片
     */
    let resultAll = [];
    let resultArr = [];
    // 获取整个toplist数据
    let topListGetid = await request('/toplist');
    // 循环取出排行榜对应id
    let i = 0;
    while (i < 4){
      let topListId = topListGetid.list[i].id;
      // 按着id去playlist找对应的榜单名称和歌曲信息
      let topListData = await request('/playlist/detail', {id: topListId});
      // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
      let topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3), id:topListData.playlist.id};
      let altopList = topListData.playlist.tracks.slice(0, 20);
      resultAll.push(altopList);
      resultArr.push(topListItem);
      // 不需要等待五次请求全部结束才更新，但是渲染次数会多一些
      this.setData({
        topList: resultArr,
        altopList: resultAll
      });
      i++
    }
  },

  // 跳转至RecommendSong页面的回调
  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  // 跳转至搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  // 跳转到歌单歌曲列表页面
  toPlayList(event){
    wx.navigateTo({
      url: '/pages/playlist/playlist?id=' + event.currentTarget.id,
    })
  },

  // 跳转至排行榜歌曲播放页面
  toSongDetail(event){
    let {song, index, songindex} = event.currentTarget.dataset;
    let altopList = this.data.altopList;
    let List = altopList[songindex];
    let id = song[index].id;
    // 路由跳转传参，query参数
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + id + '&index=' + index,
      success: function(res) {
        res.eventChannel.emit('recommendList',
        {
          data: List
        })
      }
    })
  },

  // 跳转到当前播放歌曲的播放页面
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
    // 获取当前播放歌曲信息
    if(appInstance.globalData.song){
      this.setData({
        song: appInstance.globalData.song
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