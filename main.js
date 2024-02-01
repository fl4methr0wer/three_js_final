import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from 'three/examples/jsm/libs/stats.module'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
 

let camera, scene, renderer, stats;
let cube, sphere, torus, moebius;
let mirrorMaterial, material, material2;
let cubeCamera, cubeRenderTarget;
let controls;


function parametricMoebius ( u, t, target ) {
	// flat mobius strip
	// http://www.wolframalpha.com/input/?i=M%C3%B6bius+strip+parametric+equations&lk=1&a=ClashPrefs_*Surface.MoebiusStrip.SurfaceProperty.ParametricEquations-
	console.log("u : " + u) // from 0 to 1
	console.log("v: " + t) // from 0 to 1
	u -= 0.5;
	var v = 2 * Math.PI * t;
	var x, y, z;
	var a = 2;
  
	x = Math.cos( v ) * ( a + u * Math.cos( v / 2 ) );
	y = Math.sin( v ) * ( a + u * Math.cos( v / 2 ) );
	z = u * Math.sin( v / 2 );
  
	target.set( x, y, z );
  }

function init() {
	renderer = new THREE.WebGLRenderer( {antialias: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animation );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	document.body.appendChild( renderer.domElement );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 75;
	scene = new THREE.Scene();
    
	scene.add( new THREE.AmbientLight( 'white', 1.2 ) )
	stats = new Stats();
	document.body.appendChild( stats.dom );
	controls = new OrbitControls(camera, renderer.domElement);

	// new RGBELoader()
	// 	.setPath( 'textures/equirectangular/' )
	// 	.load( 'quarry_01_1k.hdr', function ( texture ) {

	// 		texture.mapping = THREE.EquirectangularReflectionMapping;

	// 		scene.background = texture;
	// 		scene.environment = texture;

	// 	} );

	const cloader = new THREE.CubeTextureLoader();
	const ctexture = cloader.load([
		"static/img/1.png",
		"static/img/2.png",
		"static/img/3.png",
		"static/img/4.png",
		"static/img/5.png",
		"static/img/6.png"
	])
	scene.background = ctexture;

	cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
	cubeRenderTarget.texture.type = THREE.UnsignedByteType;
	cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget );

	material = new THREE.MeshStandardMaterial( {
		envMap: cubeRenderTarget.texture,
		roughness: 0.05,
		metalness: 1
	} );

	mirrorMaterial = new THREE.MeshStandardMaterial( {
		envMap: cubeRenderTarget.texture,
		roughness: 0.05,
		metalness: 1
	} );

	material2 = new THREE.MeshStandardMaterial( {
		roughness: 0.1,
		metalness: 0,
		color : 0x23e2a1
	} );

	// PARAMETRIC
	let geom = new ParametricGeometry(parametricMoebius, 100, 100);
	material = new THREE.MeshPhongMaterial({color: 0xaafe51, side: THREE.DoubleSide, flatShading : true});
	moebius = new THREE.Mesh(geom, material); 
	moebius.scale.set(4, 4, 4);
	scene.add(moebius);
			
	sphere = new THREE.Mesh( new THREE.IcosahedronGeometry( 15, 8 ), mirrorMaterial );
	scene.add( sphere );

	material2.wireframe = true
	cube = new THREE.Mesh( new THREE.BoxGeometry( 15, 15, 15 ), material2 );
	scene.add( cube );

	let torusGeoometry = new THREE.TorusGeometry( 6, 3, 16, 100 );
	torus = new THREE.Mesh(torusGeoometry, material2)
	scene.add(torus);
}
init();

function animation( msTime ) {
  const time = msTime / 1000;

  cube.position.x = Math.cos( time ) * 30;
  cube.position.y = Math.sin( time ) * 30;
  cube.position.z = Math.sin( time ) * 30;

  cube.rotation.x += 0.02;
  cube.rotation.y += 0.03;

  torus.position.x = Math.cos( time + 10 ) * 30;
  torus.position.y = Math.sin( time + 10 ) * 30;
  torus.position.z = Math.sin( time + 10 ) * 30;

  torus.rotation.x += 0.02;
  torus.rotation.y += 0.03;

  moebius.position.x = -Math.cos( time ) * 50;
  moebius.position.z = Math.sin(time) * 50
  moebius.rotation.x += 0.03;
  moebius.rotation.y += 0.03;

  cubeCamera.update( renderer, scene ); // mirror camera
  controls.update();
  renderer.render( scene, camera );
  stats.update();
}

window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(newWidth, newHeight);
});


