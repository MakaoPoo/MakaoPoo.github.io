class LoadingText {
  constructor(span, time, max, wait) {
    this.loadStr = ["N","o","w"," ","L","o","a","d","i","n","g"];
    this.loadCount = 0;
    this.onloadFlag = false;

    this.scale = scale;
    this.jumpSpan = span;
    this.jumpTime = time;
    this.jumpMax = max;
    this.waitTime = wait;
  }

  set scale(scale) {
    this.scale = scale;
  }

  draw(domId) {
    if(this.onloadFlag) {
      return;
    }

    var canvas = document.getElementById(domId);
    var ctx = canvas.getContext('2d');
    ctx.font =  640*scale/12+"px 'ＭＳ ゴシック'";
    ctx.fillStyle="#ffffff";
    var loadY = new Array(loadStr.length);

    var cx = canvas.width();
    var cy = canvas.height();
    var center = this.jumpTime/2;

    for(var i=0; i<loadStr.length; i++) {
      if(this.jumpSpan*i <= loadCount && loadCount < this.jumpSpan*i + this.jumpTime) {
        var relCount = loadCount - this.jumpSpan*i - center;
        loadY[i] = (center*center - relCount*relCount) / (center*center) * this.jumpMax;
      } else {
        loadY[i] = 0;
      }
    }
    loadCount = (loadCount + 1) % (this.jumpSpan*(loadStr.length-1) + this.jumpTime + this.waitTime);
    for(var i=0; i<loadStr.length; i++) {
      ctx.fillText(loadStr[i], cx+(-155 + i*27)*this.scale, cy+(50 - loadY[i])*this.scale);
    }

    setTimeout(loading, 10);
  }
}
