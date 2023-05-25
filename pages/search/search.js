import request from "../../utils/request";
const appInstance = getApp();
let isSend = '';// 函数防抖使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',// placeholder的内容
    hotList: [],// 热搜榜数据
    searchContent: '',// 用户输入的表单项数据
    searchList: [],// 关键字模糊匹配的数据
    historyList: [],// 搜索史记录
    song: ''// 歌名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData();
    // 获取搜索历史记录
    this.getSearchHistory();
  },

  // 获取初始化的数据
  async getInitData(){
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  // 获取本地历史记录的功能函数
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory');
    if(historyList){
      this.setData({
        historyList
      })
    }
  },

  // 表单项内容发生改变的回调
  handleInputChange(event){
    this.setData({
      searchContent: event.detail.value.trim()
    });
    // 函数防抖
    if(isSend){
      clearTimeout(isSend)
    };
    isSend = setTimeout(() => {
      this.getSearchList();
    }, 300);
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    // 发请求获取关键字模糊匹配数据
    let {searchContent, historyList} = this.data;
    if(!searchContent){
      this.setData({
        searchList: []
      })
      return;
    };
    let searchListData = await request('/search', {keywords: searchContent, limit: 10});
    this.setData({
      searchList: searchListData.result.songs
    });

    // 将搜索关键字添加到搜索历史记录中
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    };
    historyList.unshift(searchContent);
    this.setData({
      historyList
    });
    wx.setStorageSync('searchHistory', historyList)
  },

  // 清空搜索内容
  handleClear(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除搜索历史记录
  handleDelete(){
    wx.showModal({
      content: '确认删除搜索历史记录吗?',
      success:(res) => {
        if(res.confirm){
          // 清空data的historyList
          this.setData({
            historyList: []
          });
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory')
        }
      }
    })

  },

  // 点击热搜榜进行搜索
  searchHotSong(event){
    this.setData({
      searchContent: event.currentTarget.dataset.hotwords
    });
    // 发请求获取搜索匹配到的数据
    this.getSearchList();
  },

  // 点击历史记录进行搜索
  searchHistory(event){
    this.setData({
      searchContent: event.currentTarget.dataset.historyword
    });
    this.getSearchList();
  },

  //跳转到歌曲详情页面
  toSongDetail(event){
    let {searchList} = this.data;
    let id = event.currentTarget.id;
    let index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + id + '&index=' + index + '&search=1',
      success: function(res) {
        res.eventChannel.emit('recommendList',
        {
          data: searchList
        })
      }
    })
    
  },

  // 跳转至当前播放页面
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