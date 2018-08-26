var width, height;

var renderer;
var scene;
var camera;

var objList = {};
var objSourceList = ["pen"];

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
  renderer.setClearColor(0xffffff, 0.0);

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, 640 / 480, 1, 10000);
  camera.position.set(0, 0, +1000);

  // 平行光源
  const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight1.position.set(0.5, 1, 1);
  const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight2.position.set(0.5, -1, 0);
  const directionalLight3 = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight3.position.set(-1.0, 0, 0);
  // シーンに追加
  scene.add(directionalLight1);
  scene.add(directionalLight2);
  scene.add(directionalLight3);

  loadObj(objList, objSourceList);

  // 初回実行
  //renderer.render(scene, camera);
  tick();

  LoadingTextStart();
});

$(window).on('load', function(){

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

function loadObj(objList, objSourceList) {
  var objLoader = new THREE.OBJLoader();
  var mtlLoader = new THREE.MTLLoader();

  for(var i in objSourceList) {
    var modelPath = "resource/";
    var objName = objSourceList[i] + ".obj";
    var mtlName = objSourceList[i] + ".mtl";
    mtlLoader.setPath(modelPath);
    mtlLoader.load(mtlName, function (materials){
      materials.preload();

      objLoader.setMaterials(materials);
      objLoader.setPath(modelPath);
      objLoader.load(objName, function (object){
        object.scale.set(4, 4, 4);
        objList[objSourceList[i]] = object;
        scene.add( objList[objSourceList[i]] );
      });
    });
  }
}

function tick() {
  requestAnimationFrame(tick);

  // 箱を回転させる
  if(objList["pen"] != null) {
    objList["pen"].rotation.x += 0.1;
  }
  // objList["pen"].rotation.z += 0.01;

  // レンダリング
  renderer.render(scene, camera);
}
