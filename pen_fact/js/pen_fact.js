let PI = 3.141592;
var width, height;

var renderer;
var scene;
var camera;

var penObj = new Array(4);
var capObj = new Array(3);
var objSourceList = ["pen", "cap"];

var penDir = new Array(penObj.length);
var isCapSet =  new Array(capObj.length);
let penSpan = 100;
var movingCount = penSpan;
var rotateCount = 180;
var score = 0;
var miss = 0;

var touchStartX;
var touchStartY;
var touchEndX;
var touchEndY;

var leftSwipe = false;
var upSwipe = false;
var downSwipe = false;
var oneTap = false;

var touchstartTime;

$(document).ready(function() {
  if(!isNaN($.cookie('score'))) {
    score = $.cookie('score');
  }
  if(!isNaN($.cookie('miss'))) {
    miss = $.cookie('miss');
  }
  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('WebGL'),
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);

  $(window).trigger('resize');

  // シーンを作成
  scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0.0);

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 10000);
  // camera.position.set(0, 0, +250);
  camera.position.set(0, 32, +300);

  addLight();

  loadObj(0);

  LoadingTextStart();
});

function addLight() {
  // 平行光源
  const directionalLight1 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight1.position.set(-50, 100, -50);
  const directionalLight2 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight2.position.set(50, 100, -50);
  const directionalLight3 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight3.position.set(150, 100, -50);

  const directionalLight4 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight4.position.set(-50, 100, -50);
  const directionalLight5 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight5.position.set(50, 100, -50);
  const directionalLight6 = new THREE.PointLight(0xFFFFFF, 0.5);
  directionalLight6.position.set(150, 100, -50);

  const directionalLight7 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  directionalLight7.position.set(20, -50, 100);

  // シーンに追加
  scene.add(directionalLight1);
  scene.add(directionalLight2);
  scene.add(directionalLight3);
  scene.add(directionalLight4);
  scene.add(directionalLight5);
  scene.add(directionalLight6);
  scene.add(directionalLight7);
}

$(window).on('load', function(){
  updateScore();

  var device = ["iPhone", "iPad", "iPod", "Android"];
  for(var i=0; i<device.length; i++){
    if (navigator.userAgent.indexOf(device[i])>0){
      $('#loadingText').on('touchstart', function(event) {
        event.preventDefault();
        touchstartTime = new Date().getTime();
        // 座標の取得
        touchStartX = event.touches[0].pageX;
        touchStartY = event.touches[0].pageY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
      });
      $('#loadingText').on('touchmove', function(event) {
        event.preventDefault();
        // 座標の取得
        touchEndX = event.touches[0].pageX;
        touchEndY = event.touches[0].pageY;
      });

      $('#loadingText').on('touchend', function(event) {
        var touchendTime = new Date().getTime();
        if(touchendTime - touchstartTime < 300) {
          var touchMoveX = touchEndX - touchStartX;
          var touchMoveY = touchEndY - touchStartY;

          if (touchMoveY > 50 && Math.abs(touchMoveY/touchMoveX) > 2) {
            upSwipe = true;
          }else if (touchMoveY < -50 && Math.abs(touchMoveY/touchMoveX) > 2) {
            downSwipe = true;
          }else if (touchMoveX < -50 && Math.abs(touchMoveX/touchMoveY) > 2) {
            leftSwipe = true;
          }else if(Math.abs(touchMoveX)<10 && Math.abs(touchMoveY)<10) {
            oneTap = true;
          }
        }
      });
      break;
    }
    if(i == device.length-1) {
      $('html').keydown(function(e){
        if(e.keyCode == 38){
          upSwipe = true;
        }else if(e.keyCode == 40){
          downSwipe = true;
        }else if(e.keyCode == 37){
          leftSwipe = true;
        }else if(e.keyCode == 32){
          oneTap = true;
        }
      });
    }
  };
});

$(window).resize(function() {
  width = $('body').width();
  height = $('body').height();

  var scale;

  if(height / width < 0.75) {
    scale = height/480;
  }else {
    scale = width/640;
  }
  setLoadingTextScale();

  renderer.setSize(640*scale, 480*scale);

  $('#WebGL').css("width",  640*scale);
  $('#WebGL').css("height", 480*scale);
  $('#WebGL').css("left", width/2 - 320*scale);
  $('#WebGL').css("top", height/2 - 240*scale);

  $('#game_back').css("width",  640*scale);
  $('#game_back').css("height", 480*scale);
  $('#game_back').css("left", width/2 - 320*scale);
  $('#game_back').css("top", height/2 - 240*scale);

  $('p').css("font-size", 30*scale +"px");
  $('p').css("width", 627*scale);
  $('p').css("top", height/2 - 230*scale);
  $('p').css("left", $('#WebGL').css("left"));
  $('p').css("letter-spacing", 3*scale +"px");
});

function loadObj(index) {
  if(index >= objSourceList.length) {
    LoadingTextEnd();
    main();
    return;
  }

  var objLoader = new THREE.OBJLoader();
  var mtlLoader = new THREE.MTLLoader();

  var modelPath = "resource/";
  var objName = objSourceList[index] + ".obj";
  var mtlName = objSourceList[index] + ".mtl";
  mtlLoader.setPath(modelPath);
  mtlLoader.load(mtlName, function (materials){
    materials.preload();

    objLoader.setMaterials(materials);
    objLoader.setPath(modelPath);
    objLoader.load(objName, function (object){
      if(index == 0) {
        for(var i=0; i<penObj.length; i++) {
          var clone = object.clone();
          penObj[i] = clone;
          scene.add( clone );
          penDir[i] = (getRand(1, 0) == 0);
          if(i < 2) {
            penObj[i].visible = false;
          }
        }
      }else if(index == 1) {
        for(var i=0; i<capObj.length; i++) {
          var clone = object.clone();
          capObj[i] = clone;
          scene.add( clone );
          isCapSet[i] = false;
          if(i < 2) {
            capObj[i].visible = false;
          }
        }
      }

      loadObj(index+1);
    });
  });
}

function main() {
  requestAnimationFrame(main);

  Action() ;
  FixModel();
  // レンダリング
  renderer.render(scene, camera);
}

function Action() {
  var speed = 8;
  if(movingCount > 0) {
    movingCount += speed;
  }
  if(rotateCount > 0) {
    rotateCount += speed*2;
  }
  if(rotateCount < 0) {
    rotateCount -= speed*2;
  }
  if(movingCount > penSpan) {
    movingCount = penSpan;
  }
  if(rotateCount > 180) {
    rotateCount = 180;
  }
  if(rotateCount < -180) {
    rotateCount = -180;
  }
  if(movingCount == penSpan && Math.abs(rotateCount) == 180) {
    if(oneTap) {
      isCapSet[capObj.length-1] = !isCapSet[capObj.length-1];
    }else if(leftSwipe) {
      if(penDir[penObj.length/2] && isCapSet[capObj.length-1]) {
        score++;
        $.cookie('score', score);
        updateScore();
      }else {
        miss++;
        $.cookie('miss', miss);
      }
      slidePen();
      movingCount = speed;
    }else if(upSwipe && !isCapSet[capObj.length-1]) {
      penDir[capObj.length-1] = !penDir[capObj.length-1];
      rotateCount = speed*2;
    }else if(downSwipe && !isCapSet[capObj.length-1]) {
      penDir[capObj.length-1] = !penDir[capObj.length-1];
      rotateCount = -speed*2;
    }
  }

  oneTap = false;
  upSwipe = false;
  downSwipe = false;
  leftSwipe = false;
}

function updateScore() {
  var scoreStr = String(score);
  var socreLength = scoreStr.length;
  for(var i=0; i<34-socreLength; i++) {
    scoreStr = '0' + scoreStr;
  }
  $('p').text(scoreStr);
}

function FixModel() {
  for(var i=0; i<penObj.length; i++) {
    if(penObj[i] == null) continue;
    var posX = -penSpan + i*penSpan - movingCount;
    var direct = penDir[i] *180 *PI/180;
    if(i == penObj.length/2) {
      direct += (180-rotateCount)*PI/180;
    }

    if(posX <= 0) {
      penObj[i].rotation.x = direct;
    }else if(posX >= penSpan-1) {
      var rotation = 90 * PI / 180;
      penObj[i].rotation.x = rotation + direct;
    }else {
      var rotation = (90 * PI / 180) * ((penSpan-movingCount)/ penSpan);
      penObj[i].rotation.x = rotation + direct;
    }
    penObj[i].position.x = -penSpan + i*penSpan - movingCount;
  }

  var lastCap = capObj.length-1;
  for(var i=0; i<capObj.length; i++) {
    if(capObj[i] == null) continue;

    if(i < capObj.length) {
      if(isCapSet[i]) {
        capObj[i].position.y = 0;
      }else {
        capObj[i].position.y = 45;
      }
    }

    if(i < lastCap) {
      capObj[i].position.x = -penSpan + i*penSpan - movingCount;
    }
  }
  if(isCapSet[lastCap]) {
    capObj[lastCap].rotation.z = 0.0;
  }else {
    capObj[lastCap].rotation.y += 0.07;
    capObj[lastCap].rotation.z = 0.02;
  }
}

function slidePen() {
	for(var i=0; i<penObj.length-1; i++) {
    penObj[i].visible = penObj[i+1].visible;
		penDir[i] = penDir[i+1];
	}
  penDir[penObj.length-1] = (getRand(1, 0) == 0);

	for(var i=0; i<capObj.length-1; i++) {
  	isCapSet[i] = isCapSet[i+1];
    capObj[i].visible = isCapSet[i];
    capObj[i].rotation.y = capObj[i+1].rotation.y
	}
  if(isCapSet[capObj.length - 1]) {
    capObj[capObj.length - 1].rotation.y = 1.0;
  }
  isCapSet[capObj.length - 1] = false;
}

function getRand(max, min){
  var rand = Math.floor( Math.random() * (max + 1 - min) ) + min ;
  return rand;
}
