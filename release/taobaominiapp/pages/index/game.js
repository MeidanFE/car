
var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
var shareInfoList = [];
Page({
  onReady(){
  },
  onLoad(query){
  },
  onTouchStart(e){
    touchstartCB&&touchstartCB(e)
  },
  onTouchCancel(e){
    touchcancelCB&&touchcancelCB(e)
  },
  onTouchEnd(e){
    touchendCB&&touchendCB(e)
  },
  onTouchMove(e){
    touchmoveCB&&touchmoveCB(e)
  },
  onShareAppMessage(){
    let sharedInfo = shareInfoList.shift();
    if (!sharedInfo) {
      sharedInfo = {
        title:'快乐集结 动手吧!',
        desc: '集颗粒赢乐高®玩具爆款新品!',
        imageUrl:"https://layabox.oss-accelerate.aliyuncs.com/16/share/img_share_1.png"
      };
    }
    return sharedInfo;
  },
  canvasOnReady(){
    my.onTouchStart = function(cb){
      touchstartCB = cb;
    };
    my.onTouchCancel = function(cb){
      touchcancelCB = cb;
    }
    my.onTouchEnd = function(cb){
      touchendCB = cb;
    }
    my.onTouchMove = function(cb){
      touchmoveCB = cb;
    }

    delete require.cache[require.resolve("layaengine/adapter.js")];
    require("layaengine/adapter.js");
    $global.window.pushSharedInfo = function(obj){
      shareInfoList.push(obj);
    };
    delete require.cache[require.resolve("layaengine/libs/min/laya.tbmini.min.js")];
    require("layaengine/libs/min/laya.tbmini.min.js");
    delete require.cache[require.resolve("./index.js")];
    require("./index.js");
  },
  onUnload(){
    $global.window.cancelAnimationFrame();
    $global.$isAdapterInjected = false;
    $global.window = null;
  }
});
