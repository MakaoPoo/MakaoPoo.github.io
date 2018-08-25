var backGraph = new Image();
backGraph.src = "resource/maki_chan/back.png";
var hairGraph = new Image();
hairGraph.src = "resource/maki_chan/hair.png";
var browGraph = new Array(4);
var eyeGraph = new Array(4);
var mouthGraph = new Array(4);
for(var i=0; i<4; i++) {
  var index = i+1;
  browGraph[i] = new Image();
  browGraph[i].src = "resource/maki_chan/brow"+ index +".png";
  eyeGraph[i] = new Image();
  eyeGraph[i].src = "resource/maki_chan/eye"+ index +".png";
  mouthGraph[i] = new Image();
  mouthGraph[i].src = "resource/maki_chan/mouth"+ index +".png";
}

var context = null;
var soundBuffList = {};
var soundSourceList = {
  vee1: "resource/maki_chan/VEE1.wav",
  vee2: "resource/maki_chan/VEE2.wav",
  bgm : "resource/maki_chan/BGM.mp3"
}

var width = 640;
var height = 480;
var sc, cx, cy;
var scale = 1;

var startFrame = -1;
var brow = 0, eye = 0, mouth = 0;
var gamePart = 0;
var count = 0;
var touch = false;

var startTime = 0;
var prevSoundTime = 0;

var onloadFlag = false;
var loadStr = ["N","o","w"," ","L","o","a","d","i","n","g"];
var loadCount = 0;
var loadY = new Array(loadStr.length);

function main(){
  var day = new Date();
  var lastFrame = day.getTime();
  var frame = (lastFrame-startFrame);
  if(frame < 0 || startFrame == -1) frame =0;
  startFrame = lastFrame;
  guruguru(frame);
  if(gamePart == 4) {
    if(getCurrentTime() > 20) {
      gamePart = 5;
      scale  = 1;
    }
    scale += frame/10000;
  }
  draw();
  setTimeout(main, 0);
}

function draw() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.fillStyle="#000000";
  ctx.fillRect(0, 0, width, height);
  if(onloadFlag) {
    if(gamePart < 5) {
      var sx, sy, sw ,sh;
      sx = cx + (-320 + 0)*scale*sc; sy = cy + (-240 + 0)*scale*sc;
      sw = 640*sc*scale; sh = 480*sc*scale;
      ctx.drawImage(backGraph,sx ,sy ,sw ,sh );
      if(brow != -1) {
        sx = cx + (-320 + 180)*scale*sc; sy = cy + (-240 + 150)*scale*sc;
        sw = 260*sc*scale; sh = 70*sc*scale;
        ctx.drawImage(browGraph[brow],sx ,sy ,sw ,sh );
      }
      if(eye != -1) {
        sx = cx + (-320 + 180)*scale*sc; sy = cy + (-240 + 190)*scale*sc;
        sw = 260*sc*scale; sh = 100*sc*scale;
        ctx.drawImage(eyeGraph[eye],sx ,sy ,sw ,sh );
      }
      if(mouth != -1) {
        sx = cx + (-320 + 270)*scale*sc; sy = cy + (-240 + 310)*scale*sc;
        sw = 90*sc*scale; sh = 50*sc*scale;
        ctx.drawImage(mouthGraph[mouth],sx ,sy ,sw ,sh );
      }
          sx = cx + (-320 + 0)*scale*sc; sy = cy + (-240 + 0)*scale*sc;
      sw = 640*sc*scale; sh = 480*sc*scale;
      ctx.drawImage(hairGraph,sx ,sy ,sw ,sh );
    } else {
      ctx.fillStyle="#ffffff";
      ctx.fillText("真姫ちゃんかわいい", cx-300*sc, cy+70*sc);
    }
  }
}

function guruguru(frame) {
  var speed = 150/frame;
  count++;
  switch(gamePart) {
  case 1:
    if(count > speed) count = 0;
    if (count == 0) {
      brow = (brow + 1) % 4;
      if(!touch) {
        playSound("vee1", 0.55);
        prevSoundTime = getCurrentTime();
      }
    }
    break;
  case 2:
    if(count > speed/2) count = 0;
    if (count == 0) {
      mouth = (mouth + 1) % 4;
      if(getCurrentTime() > 0.58 && !touch) {
        playSound("vee1", 0.16);
        prevSoundTime = getCurrentTime();
      }
    }
    break;
  case 3:
    if(count > speed/4) count = 0;
    if (count == 0) {
      eye = (eye + 1) % 4;
      if(getCurrentTime()> 0.58 && !touch) {
        playSound("vee1", 0.10);
        prevSoundTime = getCurrentTime();
      }
    }
    break;
  }
  if(touch) {
    if(gamePart < 4) {
      if(gamePart > 0) {
        playSound("vee2");
        if(gamePart == 3) {
          playSound("bgm");
        }
      }
      gamePart++;
      count = -1;
    }
    touch = false;
  }
}

$(window).resize(function() {
  width = $('body').width();
  height = $('body').height();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  cx = width/2;
  cy = height/2;
  if(height / width < 0.75) {
    ctx.font =  height/9+"px 'ＭＳ ゴシック'";
    sc = height/480;
  } else {
    ctx.font =  width/12+"px 'ＭＳ ゴシック'";
    sc = width/640;
  }

  var touchWidth = 640*sc;
  var touchHeight = 480*sc;
  $(".touch_area").width(touchWidth);
  $(".touch_area").height(touchHeight);
  $(".touch_area").css("top", cy - touchHeight/2);
  $(".touch_area").css("left", cx - touchWidth/2);

  draw();
})

$(window).on('load', function(){
  onloadFlag = true;

  var device = ["iPhone", "iPad", "iPod", "Android"];
  for(var i=0; i<device.length; i++){
    if (navigator.userAgent.indexOf(device[i])>0){
      $('.touch_area').on('touchend', function() {
        if(gamePart == 0) {
          start();
        }
      });
      $('.touch_area').on('touchstart', function() {
        touch = true;
      });
      break;
    }
    if(i == device.length-1) {
      $('.touch_area').on('mousedown', function() {
        if(gamePart == 0) {
          start();
        }
        touch = true;
      });
    }
  };

  brow = getRand(3,0);
  eye = getRand(3,0);
  mouth = getRand(3,0);
});

$(document).ready(function() {
  $(window).trigger('resize');

  initWebAPI();
  loadSound("vee1");
  loadSound("vee2");
  loadSound("bgm");

  loading();
});

function loading() {
  draw();
  
  if(onloadFlag && Object.keys(soundBuffList).length == Object.keys(soundSourceList).length) {
    return;
  }

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  var jumpSpan = 5;
  var jumpTime = 30;
  var center = jumpTime/2;

  for(var i=0; i<loadStr.length; i++) {
    if(jumpSpan*i <= loadCount && loadCount < jumpSpan*i + jumpTime) {
      var relCount = loadCount - jumpSpan*i - center;
      var jumpMax = 50;
      loadY[i] = (center*center - relCount*relCount) / (center*center) * jumpMax;
    } else {
      loadY[i] = 0;
    }
  }
  var waitTime = 50;
  loadCount = (loadCount + 1) % (jumpSpan*(loadStr.length-1) + jumpTime + waitTime);
  ctx.fillStyle="#ffffff";
  for(var i=0; i<loadStr.length; i++) {
    ctx.fillText(loadStr[i], cx+(-155 + i*27)*sc, cy+(50 - loadY[i])*sc);
  }

  setTimeout(loading, 10);
}

function start(){
  if(Object.keys(soundBuffList).length != Object.keys(soundSourceList).length) {
    return;
  }
  brow = 0;
  eye = -1;
  mouth = -1;
  main();
}

function initWebAPI() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    context = null;
    alert("このブラウザではWeb Audio APIがサポートされていません。");
  }
}

function loadSound(name){
  if (!context) { return; }
  var request = new XMLHttpRequest();
  var url = soundSourceList[name];
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(
      request.response,
      function(buffer) {
        soundBuffList[name] = buffer;
      },
      function() {
        alert("音声ファイルの読み込みに失敗しました。");
      });
  }
  request.send();
}

function playSound(name, time=-1){
  if (!soundBuffList) { return; }
  var source = context.createBufferSource();
  source.buffer = soundBuffList[name];
  source.connect(context.destination);
  if(time > 0) {
    source.start(0,0,time);
  } else {
    source.start(0);
  }
  if(name == "vee2" || name == "bgm") {
    startTime = context.currentTime
  }
}

function getCurrentTime() {
  return context.currentTime - startTime;
}

function getRand(max, min){
  var rand = Math.floor( Math.random() * (max + 1 - min) ) + min ;
  return rand;
}
