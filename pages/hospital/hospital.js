var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    // goodsCount: 0,
    scrollHeight: 0,
    showClient: false
  },
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    util.request(api.CatalogList).then(function (res) {
        that.setData({
          navList: res.data.categoryList,
          currentCategory: res.data.currentCategory
        });
        wx.hideLoading();
      });
    util.request(api.GoodsCount).then(function (res) {
      that.setData({
        goodsCount: res.data.goodsCount
      });
    });
    util.request(api.ShowClient).then(function (res) {
      that.setData({
        showClient: res
      });
    });

  },
  getCurrentCategory: function (id) {
    let that = this;
    util.request(api.CatalogCurrent, { id: id })
      .then(function (res) {
        that.setData({
          currentCategory: res.data.currentCategory
        });
      });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.data.currentTab = getApp().globalData.homeCurrentTab;
    if (this.data.currentTab) {
      console.log("switch", this.data.currentTab)
      this.data.currentCategory.id = this.data.currentTab;
      var self = this
      // self.setData({
      //   currentCategory.id: this.data.currentTab
      // });
      this.getCurrentCategory(this.data.currentTab);
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getList: function () {
    var that = this;
    util.request(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
      .then(function (res) {
        that.setData({
          categoryList: res.data,
        });
      });
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  },

  //向服务请求支付参数
  payOrder(event){
    // wx.redirectTo({
    //   url: '/pages/pay/pay?orderId=123456&actualPrice=0.01&type=1',
    // })
    let that = this;
    // 直接购买商品
    util.request(api.BuyAdd, {
      goodsId: 100001,
      number: 1,
      productId: 1}, "POST")
      .then(function(res) {
        wx.hideLoading();
        let _res = res;
        if (_res.errno == 0) {
          // 提交订单
          var param={}
          param.addressId = null
          param.promoterId = 0
          param.couponId = null
          param.type = "customerService"
          param.payType = null
          param.groupBuyingId = null
          console.log("{{}}}}}+++++======:", JSON.stringify(param))
          util.request(api.OrderSubmit, param, 'POST').then(res => {
            wx.hideLoading()
            if (res.errno === 0) {
              const orderId = res.data.orderInfo.id;
              const price = res.data.orderInfo.actual_price;
              wx.redirectTo({
                url: '/pages/pay/pay?orderId=' + orderId + '&actualPrice=' + price + '&type=1',
              })
              // pay.payOrder(parseInt(orderId)).then(res => {
              //   wx.redirectTo({
              //     url: '/pages/payResult/payResult?status=1&orderId=' + orderId
              //   });
              // }).catch(res => {
              //   wx.redirectTo({
              //     url: '/pages/payResult/payResult?status=0&orderId=' + orderId
              //   });
              // });
            } else {
              util.showErrorToast('下单失败');
            }
          });
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }
      }); 
  }
})