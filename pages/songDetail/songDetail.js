import moment from 'moment';
import request from "../../utils/request";
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: true,// 音乐播放状态
    song: {},// 歌曲详情对象
    musicId: '',// 音乐id
    index: 0,// 音乐所在data的下标
    recommendList: [],// 推荐列表数据
    musicLink: '',// 音乐的链接
    currentTime: '00:00',// 实时时间
    durationTime: '00:00',// 总时长
    move: 0,// 实时进度条宽度
    max: 0,// 进度条总长
    xb: -1,// 当前播放歌曲的下标
    top: 0,// 定位滚动条位置
    lyricTimeList: [],// 歌词对应的时间
    mode: '',// 音乐播放模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取recommendsong页面传的recommend、musicId、index
    let {mode, recommendList} = this.data;
    mode = appInstance.globalData.mode;
    let index = options.index;
    let musicId = options.musicId;
    this.search = options.search;// 判断歌曲是否来自search页面，search页面的歌曲资料不完整，需要每次都调用信息
    this.tosong = options.tosong;// 判断是否来自顶部跳转回songdetail
    appInstance.globalData.index = index;
    if(this.search){
      appInstance.globalData.yn = 1
    }else if(!this.tosong && !this.search){
      appInstance.globalData.yn = ''
    }else if(this.tosong && !this.search && appInstance.globalData.yn){
      this.search = 1
    };
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    const eventChannel = this.getOpenerEventChannel();
    new Promise((resolve, reject) => {
      eventChannel.on('recommendList', function(data) {
        recommendList= data;
        resolve(recommendList)
      })
    }).then((res) => {
      this.setData({
        recommendList,
        musicId,
        index,
        mode
      })
      appInstance.globalData.songList = recommendList.data;
      // 获取音乐详情
      this.getMusicInfo(musicId);
    })
    // 判断用户是否播放同一首歌，不是则停止上一首！！重新设置播放状态,重调用播放和存musicId
    if(appInstance.globalData.musicId != musicId){
      // 不是同一首歌
      this.backgroundAudioManager.stop();
      this.musicControl(this.data.isPlay, musicId);
      appInstance.globalData.musicId = musicId;
      appInstance.globalData.isMusicPlay = true;
    }else{// 是同一首歌则同步刚才放回上一级时的播放状态
      this.setData({
        isPlay: appInstance.globalData.isMusicPlay,
        musicLink: appInstance.globalData.musicLink,
      })
    };
    // 同步系统播放暂停音乐按钮的状态
    this.backgroundAudioManager.onPlay(() => {
      // 修改音乐播放状态
      appInstance.globalData.isMusicPlay = true;
      this.setData({
        isPlay: true
      })
    });
    this.backgroundAudioManager.onPause(() => {
      // 修改音乐播放状态
      appInstance.globalData.isMusicPlay = false;
      this.setData({
        isPlay: false
      })
    });
    this.backgroundAudioManager.onStop(() => {
      // 修改音乐播放状态
      appInstance.globalData.isMusicPlay = false;
      this.setData({
        isPlay: false
      })
    });

    // 监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(() => {
      // 自动切换到下一首音乐且自动播放
      if(this.data.mode == 'loop'){
        let event = {};
        event.currentTarget = {};
        event.currentTarget.id = 'next';
        // 将实时进度条长度还原成0；时间还原成0
        this.setData({
          max: 0,
          currentTime: '00:00',
          durationTime: '00:00',// 总时长
          move: 0,// 实时进度条宽度
          xb: -1,// 当前播放歌曲的下标
          top: 0,// 定位滚动条位置
          lyricTimeList: [],// 歌词对应的时间
        });
        this.handleSwitch(event)
      }else{
        // 将实时进度条长度还原成0；时间还原成0
        this.setData({
          max: 0,
          currentTime: '00:00',
          durationTime: '00:00',// 总时长
          move: 0,// 实时进度条宽度
          xb: -1,// 当前播放歌曲的下标
          top: 0,// 定位滚动条位置
          lyricTimeList: [],// 歌词对应的时间
        });
        this.handleSwitch(0)
      }
    });

    // 监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // 格式化实时播放的时间
      let lyricTime = Math.ceil(this.backgroundAudioManager.currentTime);
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      let move = this.backgroundAudioManager.currentTime;
      let max = this.backgroundAudioManager.duration;
      this.setData({
        currentTime,
        move,
        max
      });
      // 获取当前歌词
      this.timechange(lyricTime);
    })
  },

  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    // 获取音乐歌词
    this.lrcShow(musicId);
    // 直接从recommendlist找该音乐id
    // 先判断是否来自search，是则用api获取song详细信息
    let {song} = this.data;
    if(this.search == 1){
      let songData = await request('/song/detail',{ids:musicId});
      song = songData.songs[0]
    }else{// 不来自search则从recommend中直接抽取song信息，减少调用
      let {recommendList} = this.data;
      song = recommendList.data.find(item => item.id == musicId);
    };
    // 获取总时长并将毫秒转成分和秒
    let durationTime = moment(song.dt).format('mm:ss');
    this.setData({
      song,
      durationTime
    });
    appInstance.globalData.song = song.name;
    appInstance.globalData.musicId = musicId
  },

  // 点击播放/暂停的回调
  handleMusicPlay(){
    let isPlay = !this.data.isPlay;
    let {musicId, musicLink} = this.data;
    this.musicControl(isPlay, musicId, musicLink);
  },

  // 控制音乐播放/暂停的功能函数
  async musicControl(isPlay, musicId, musicLink){
    if(isPlay){// 音乐播放
      if(!musicLink){
        // 获取音乐播放链接
        let musicLinkData = await request('/song/url', {id: musicId});
        let musicLink = musicLinkData.data[0].url;
        if(musicLink === null){
          wx.showToast({
            title: '数字专辑需购买后才能播放',
            icon: 'none',
            duration: 3000
          })
          this.setData({
            isPlay: false
          })
          appInstance.globalData.isPlay = false;
          return;
        }else if(musicLinkData.data[0].freeTrialInfo !== null){
          wx.showToast({
            title: '正在试听,开通VIP畅听完整版',
            icon: 'none',
            duration: 3000
          })
        };
        appInstance.globalData.musicLink = musicLink;
        this.setData({
          musicLink
        });
        this.backgroundAudioManager.src = this.data.musicLink;
        this.backgroundAudioManager.title = this.data.song.name;
      };// 音乐播放
      this.backgroundAudioManager.play()
    }else{// 音乐暂停
      this.backgroundAudioManager.pause()
    }
  },

  // 点击切歌的回调
  handleSwitch(event){
    let {recommendList,index} = this.data;
    this.backgroundAudioManager.stop();
    if(event !== 0){
      let type = event.currentTarget.id;
      if(type === 'pre'){// 上一首
        (index == 0) && (index = recommendList.data.length);
        index--;
      }else if(type === 'next'){// 下一首
        (index == recommendList.data.length - 1) && (index = -1);
        index++
      }
    };
    let musicId = recommendList.data[index].id;
    this.setData({
      index,
      musicId,
      max: 0,
      currentTime: '00:00',
      durationTime: '00:00',// 总时长
      move: 0,// 实时进度条宽度
      xb: -1,// 当前播放歌曲的下标
      top: 0,// 定位滚动条位置
      lyricTimeList: [],// 歌词对应的时间
    });
    // 获取音乐信息
    this.getMusicInfo(musicId);
    // 控制播放
    this.musicControl(true, musicId);
    appInstance.globalData.index = index
  },

  // 歌词显示方法
  async lrcShow(musicId){
    let lrcData = await request('/lyric?id=' + musicId);
    let lyric = lrcData.lrc.lyric;
    // 处理字符串，才分成一句一句，数据剔除，时间文本拆分再对应
    // 设定正则
    let re = /\[\d{2}:\d{2}\.\d{2,3}\]/;
    let lyricList = lyric.split("\n");
    for(let i = 0 ; i < lyricList.length ; i++){
      // 歌词拆分
      let data = lyricList[i].match(re);
      // 判断时间数组不能为空
      if(data != null){
        // 拿歌词 替换字符串
        let lyr = lyricList[i].replace(re,"");
        // 拿到时间字符串
        let timestr = data[0];
        // 判断时间字符串是否为空
        if(timestr != null){
          // 处理时间要把分钟拿到变成以秒为单位然后加上后面的秒数
          // 清除括号
          let timestr_slice = timestr.slice(1,-1);
          // 时间和秒数的拆分
          let splitlist = timestr_slice.split(":");
          let f = splitlist[0];
          let m = splitlist[1];
          // 计算秒数
          let time = parseFloat(f)*60+parseFloat(m);
          let {lyricTimeList} = this.data;
          lyricTimeList.push([time, lyr]);
          this.setData({
            lyricTimeList
          })
        }
      }
    }
  },

  // 播放进度获取歌词
  timechange(lyricTime){
    let {lyricTimeList, xb} = this.data;
    // 遍历歌词二维数组
    for(let i = 0 ; i < lyricTimeList.length-1 ; i++){
      // 每一句歌词区间判断
      if(lyricTimeList[i][0] < lyricTime && lyricTime < lyricTimeList[i+1][0]){
        if(xb !== i){
          // 拿到当前播放歌词的下标
          this.setData({
            xb:i
          });
          // 定位自动滚动
          // 拿到刚刚的xb
          let {xb} = this.data;
          if(xb > 5){
            this.setData({
              top:(xb - 5)*45
            })
          }
        }
      }
    }
  },

  // 切换音乐模式
  changemode(){
    if(this.data.mode == 'loop'){
      appInstance.globalData.mode = 'single';
      this.setData({
        mode:'single'
      })
    }else{
      appInstance.globalData.mode = 'loop';
      this.setData({
        mode: 'loop'
      })
    }
  },

  // 拖动进度条
  tuodong(e){
    this.setData({
      move: e.detail.value
    });
    this.backgroundAudioManager.seek(e.detail.value)
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