var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data:{
    doctorList:[]
  },
  onLoad:function(options){ 
    // this.getOrderList();
    this.getDoctorList();
  },

  call(e) {
    let phoneNumber = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  getDoctorList(){
    let that = this;

    util.request(api.DoctorList).then(function (res) {
      if (res.errno === 0) {
        console.log('============' + res.data)
        that.setData({
          doctorList: res.data
        });
        wx.hideLoading();
      }
    });
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){

  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})