import request from "../../utils/request";
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],// 导航标签数据
    navId: '',// 导航标识
    videoList: [],// 视频列表数据
    videoId: '',// 视频的id标识
    videoUpdataTime: [],// 记录video播放的时长
    time: 0,// 播放时间
    isTriggered: false,// 标志下拉刷新是否被触发
    timestamp: '',
    offset: 0,// 页面参数
    toast: false,// 判断提示窗
    song: ''// 歌名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
      // 获取导航数据
      this.getVideoGroupListData()
    }
  },

  // 获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    })
    // 获取视频列表数据
    this.getVideoList(this.data.navId)
  },

  // 获取视频列表数据
  async getVideoList(navId){
    // 从本地获取cookie
    let cookie = wx.getStorageSync('cookie');
    // 获取时带上的时间戳和页码
    let videoListData = await request('/video/group?id=' + navId + '&cookie=' + cookie + this.data.timestamp + this.data.offset);
    // 关闭提示框
    if (this.data.toast == true){
      wx.hideLoading();
    };
    let index = 0;
    let videoListNew = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    });
    // 因为视频url接口里没了，所以重新获取视频url，并存入获取到的videoList里
    let i = 0;
    while(i < 8){
      let vid = videoListNew[i].data.vid;
      let urlInfo = await request('/video/url?id='+vid);
      videoListNew[i].data.urlInfo = urlInfo.urls[0];
      i++;
    };
    if(this.data.offset == 0){
      this.setData({
        // 更新数据
        videoList: videoListNew,
        // 关闭下拉刷新
        isTriggered: false    
      })
    }else{// 上拉加载时，将新得到的videolist数据push到data里
      this.setData({
        videoList: [...this.data.videoList,...videoListNew]
      })
    }
  },

  // 点击切换导航的回调
  changeNav(event){
    if(this.data.navId !== event.currentTarget.id){
      let navId = event.currentTarget.id;
      this.setData({
        navId: navId*1,// 新的id即切换导航栏
        videoList: [],
        offset: 0// 切换页面参数置零，以免页面参数导致切换导航栏时候导致页面url变化而更新页面，但是切换回页面的时候数据会从第一页开始
        // 删掉可以实现回到某个导航栏实现内容刷新，但是每次跳转导航栏都会更新全部数据，不删则回到页面不会导致页面刷新，但是多页面加载后切换导航栏仍回到第一页
      });
      // 显示正在加载
      wx.showLoading({
        title: '正在加载',
      });
      this.setData({
        toast: true
      });
      // 动态获取导航对应的视频数据
      this.getVideoList(this.data.navId);
    }
  },

  // 点击播放/继续播放
  handlePlay(event){
    let time = 0;
    let vid = event.currentTarget.id;
    // 判断之前是否有过播放时长
    let {videoUpdataTime} = this.data;
    let videoItem = videoUpdataTime.find(item => item.vid === vid);
    if(videoItem){
      time=videoItem.currentTime
    };
    this.setData({
       videoId: vid,
       time
    })
  },

  // 监听视频播放进度回调
  handleTimeUpdate(event){
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdataTime} = this.data;
    // 判断记录播放时长的数组中是否有该视频播放记录
    let videoItem = videoUpdataTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){
      // 之前有
      videoItem.currentTime = event .detail.currentTime;
    }else{
      // 之前没有
      videoUpdataTime.push(videoTimeObj);
    };
    // 更新videoUpdataTime状态
    this.setData({
      videoUpdataTime
    })
  },

  // 视频播放结束调用
  handleEnded(event){
    // 移除播放记录时长的该视频记录
    let {videoUpdataTime} = this.data;
    videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id),1);
    this.setData({
      videoUpdataTime
    })
  },

  // 自定义下拉刷新回调
  handleRefresher(){
    //生成时间戳
    let timestamp = Date.now();
    this.setData({
      timestamp,// 更新时间戳
      offset: 0,// 刷新页面将页码清零
    });
    // 再次发请求获取最新视频数据
    this.getVideoList(this.data.navId);

  },

  // 自定义上拉触底的回调
  handleToLower(){
    // 数据分页offset上拉触底后加一即访问下一页
    // offset+1
    this.setData({
      offset: this.data.offset+1
    });
    // 发送请求获取下一页视频数据
    this.getVideoList(this.data.navId)
  },

  // 跳转至正在播放页面
  toSong(){
    let id = appInstance.globalData.musicId;
    let index = appInstance.globalData.index;
    let playList = appInstance.globalData.songList;
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + id + '&index=' + index,
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
  onShareAppMessage(from) {
    return{
      title: '转发 ',
      page: '/pages/video/video'
    }
  }
})