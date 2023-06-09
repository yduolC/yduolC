# 微信小程序——仿网易云音乐小程序
此小程序以Node.js为后端，调用网易云音乐API接口
## 实现内容
### 登录页面
1)二维码登录  
2)登出
### 个人页面
1)最近播放歌单样式  
2)点击头像跳转至登陆页面
### 视频页面
1)导航栏切换分区  
2)切换视频自动跳转至上次播放处  
3)上拉加载更多  
4)下拉刷新视频
### 首页
1)搜索  
2)广告轮播图  
3)每日推荐  
4)推荐歌单  
5)排行榜
### 搜索页面
1)搜索历史  
2)热搜榜  
3)模糊搜索  
4)歌曲或人名搜索  
5)点击歌曲跳转至播放页面
### 歌单页面
1)每日推荐歌单列表  
2)推荐歌单列表  
3)排行榜歌单列表
### 播放页面
1)歌曲播放暂停  
2)切歌上一首或下一首  
3)进度条实时滚动可拖动  
4)随机播放或顺序播放  
5)唱片滚动停止和唱针落下升起  
6)歌词实时滚动
## 相关参考
### 代码
尚硅谷、无敌编程、[gitee-@manster1231](https://gitee.com/manster1231/master-cloud-music)
### 网易云API
[网易云音乐 NodeJS 版 API](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e7%83%ad%e9%97%a8%e6%ad%8c%e5%8d%95%e5%88%86%e7%b1%bb)
## 使用说明
1)API安装请自行查看上方网易云API链接  
2)小程序中大部分图标为本人iconfont中的图标，请自行替换  
3)node.js开启服务后才可运行本程序  
4)运行程序需将/pages/utils/config.js中的host改为自己本地IPv4地址  
5)win+R输入cmd，命令提示符中输入ipconfig即可知道本地的IPv4地址  
6)由于密码登录和邮箱登录跳不过验证故采样二维码登录  
7)二维码登录需要用网易云账号的扫描，意味着手机预览或真机调试时需要两部手机  
8)真机调试时需要连同一网络或者连手机热点，注意更改IPv4，连接电脑热点不行  
9)真机调试1.0无法做到进度条和歌词实时更新，请用真机调试2.0，无需局域网模式  
10)下方真机调试的报错我也不会处理，可以无视它程序照常运行，如果能解决请私信我，谢谢!  
11)VM79:510 error occurs:no such file or directory, access 'wxfile://usr/miniprogramLog/log2'  
12)模拟机上的报错通常重新编译可以解决，通常是访问端口过于缓慢
### 此项目仅限于微信小程序学习，禁止用于商业与非法以及非法用途
## 具体运行界面
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144520.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144532.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144543.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144553.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144601.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144620.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144635.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144648.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144704.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144716.png)  
![image](https://github.com/yduolC/yduolC/blob/master/picture/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202023-05-25%20144744.png)
    
