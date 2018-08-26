var width, height;

var renderer;
var scene;
var camera;

var objList = {};
var objSourceList = ["pen"];

var loadingText = new LoadingText(,);

$(document).ready(function() {
  // レンダラーを作成
  // レンダラーを作成
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    alpha: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(1280, 960);

  $(window).trigger('resize');

  // シーンを作成
  scene = new THREE.Scene();
  renderer.setClearColor(0xffffff, 0.0);

  // カメラを作成
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
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

  $('#canvas').css("width", 640*scale);
  $('#canvas').css("height", 480*scale);
  $('#canvas').css("left", width/2 - 320*scale);
  $('#canvas').css("top", height/2 - 240*scale);
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
