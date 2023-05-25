// 发送ajax请求
// 封装功能函数

import config from "./config";
export default (url,data={},method='GET') => {
    return new Promise((resolve,reject) => {
        wx.request({
            url:config.host + url,
            data,
            method,
            success: (res) => {
                resolve(res.data);// 修改promise为成功状态resolve
            },
            fail: (err) => {
                reject(err);
            }
    
        })
    })

}