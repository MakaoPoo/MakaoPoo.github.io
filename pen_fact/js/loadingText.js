var loadingTextStr = ["N","o","w"," ","L","o","a","d","i","n","g"];
var loadingTextCount = 0;
var loadingTextFlag = false;

var loadingTextScale = 1.0;
var textJumpSpan = 5;
var textJumpTime = 30;
var textJumpMax = 50;
var textJumpWait = 50;

function setLoadingTextState(span, time, max, wait) {
  textJumpSpan = span;
  textJumpTime = time;
  textJumpMax = max;
  textJumpWait = wait;
}

function setLoadingTextScale() {
  var width = $('body').width();
  var height = $('body').height();

  if(height / width < 0.75) {
    loadingTextScale = height/480;
  } else {
    loadingTextScale = width/640;
  }

  var canvas = document.getElementById("loadingText");
  var ctx = canvas.getContext('2d');
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
}

function LoadingTextStart() {
  loadingTextFlag = false;
  LoadingTextDraw();
}

function LoadingTextEnd() {
  loadingTextFlag = true;
  var canvas = document.getElementById("loadingText");
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width,  canvas.height);
}

function LoadingTextDraw() {
  if(loadingTextFlag) {
    return;
  }

  var width = $('body').width();
  var height = $('body').height();

  var canvas = document.getElementById("loadingText");
  var ctx = canvas.getContext('2d');
  ctx.font =  640*loadingTextScale/12+"px 'ＭＳ ゴシック'";
  ctx.fillStyle="#ffffff";
  ctx.clearRect(0, 0, width, height);
  var loadY = new Array(loadingTextStr.length);

  var cx = width/2;
  var cy = height/2;
  var center = textJumpTime/2;

  for(var i=0; i<loadingTextStr.length; i++) {
    if(textJumpSpan*i <= loadingTextCount && loadingTextCount < textJumpSpan*i + textJumpTime) {
      var relCount = loadingTextCount - textJumpSpan*i - center;
      loadY[i] = (center*center - relCount*relCount) / (center*center) * textJumpMax;
    } else {
      loadY[i] = 0;
    }
  }
  loadingTextCount = (loadingTextCount + 1) % (textJumpSpan*(loadingTextStr.length-1) + textJumpTime + textJumpWait);
  for(var i=0; i<loadingTextStr.length; i++) {
    ctx.fillText(loadingTextStr[i], cx+(-155 + i*27)*loadingTextScale, cy+(50 - loadY[i])*loadingTextScale);
  }

  setTimeout(LoadingTextDraw, 10);
}
