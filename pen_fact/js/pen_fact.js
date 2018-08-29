var width, height;

var renderer;
var scene;
var camera;

var objList = {};
var objSourceList = ["pen", "cap"];

var count = 0;
var score = 0;
var miss = 0;

$(document).ready(function() {
  // レンダラーを作成
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
  camera.position.set(0, 0, +250);

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

  loadObj(0);

  main();

  LoadingTextStart();
});

  var touchStartX;
  var touchStartY;
  var touchMoveX;
  var touchMoveY;
$(window).on('load', function(){

  var device = ["iPhone", "iPad", "iPod", "Android"];
  for(var i=0; i<device.length; i++){
    if (navigator.userAgent.indexOf(device[i])>0){
      // $('.touch_area').on('touchend', function() {
      //     start();
      // });
      $('#loadingText').on('touchstart', function(event) {
        event.preventDefault();
        // 座標の取得
        touchStartX = event.touches[0].pageX;
        touchStartY = event.touches[0].pageY;
        console.log("touch " + touchStartX + ":" + touchStartY);
      });

      $('#loadingText').on('touchmove', function(event) {
        event.preventDefault();
        // 座標の取得
        touchMoveX = event.changedTouches[0].pageX;
        touchMoveY = event.changedTouches[0].pageY;
      });

      $('#loadingText').on('touchend', function(event) {
        if (touchStartX > touchMoveX) {
            if (touchStartX > (touchMoveX + 50)) {
            console.log("left move");
            }
        } else if (touchStartX < touchMoveX) {
            if ((touchStartX + 50) < touchMoveX) {
            console.log("right move");
            }
        }
      });

      break;
    }
    if(i == device.length-1) {
      $('.touch_area').on('mousedown', function() {
        //   start();
        // touch = true;
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
  } else {
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
});

function loadObj(index) {
  if(index >= objSourceList.length) return;
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

      objList[objSourceList[index]] = object;
      scene.add( objList[objSourceList[index]] );
      loadObj(index+1);
    });
  });
}

function main() {
  requestAnimationFrame(main);

  // 箱を回転させる
  if(objList["pen"] != null) {
    objList["pen"].rotation.x += 0.01;
  }
  if(objList["cap"] != null) {
    objList["cap"].rotation.y += 0.1;
  }
  // if(objList["cap"] != null) {
  //   objList["cap"].rotation.z = 0.5;
  // }
  // objList["pen"].rotation.z += 0.01;

  // レンダリング
  renderer.render(scene, camera);
}
