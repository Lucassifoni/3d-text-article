<template>
  <div>
    <canvas></canvas>
  </div>
</template>

<script>
  import * as ThreeImport from './../../../threejs/three.min.js';
  import * as OrbitControlsImport from './../../../threejs/OrbitControls.js';
  import * as QuickHullsImport from './../../../threejs/QuickHull.js';
  import * as ConvexGeoImport from './../../../threejs/ConvexGeometry.js';
  import * as WebglImport from './../../../threejs/WebGL.js';
  
  if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
  }

  var group, camera, scene, renderer;

  init();

  animate();

  function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 15, 20, 30 );
    scene.add( camera );
    // controls
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    // light
    var light = new THREE.PointLight( 0xffffff, 1 );
    camera.add( light );
    // helper
    scene.add( new THREE.AxesHelper( 20 ) );
    // textures
    var loader = new THREE.TextureLoader();
    var texture = loader.load( 'textures/sprites/disc.png' );
    group = new THREE.Group();
    scene.add( group );
    // points
    var vertices = new THREE.DodecahedronGeometry( 10 ).vertices;
    for ( var i = 0; i < vertices.length; i ++ ) {
      //vertices[ i ].add( randomPoint().multiplyScalar( 2 ) ); // wiggle the points
    }
    var pointsMaterial = new THREE.PointsMaterial( {
      color: 0x0080ff,
      map: texture,
      size: 1,
      alphaTest: 0.5
    } );
    var pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );
    var points = new THREE.Points( pointsGeometry, pointsMaterial );
    group.add( points );
    // convex hull
    var meshMaterial = new THREE.MeshLambertMaterial( {
      color: 0xffffff,
      opacity: 0.5,
      transparent: true
    } );
    var meshGeometry = new THREE.ConvexBufferGeometry( vertices );
    var mesh = new THREE.Mesh( meshGeometry, meshMaterial );
    mesh.material.side = THREE.BackSide; // back faces
    mesh.renderOrder = 0;
    group.add( mesh );
    var mesh = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
    mesh.material.side = THREE.FrontSide; // front faces
    mesh.renderOrder = 1;
    group.add( mesh );
    //
    window.addEventListener( 'resize', onWindowResize, false );
  }

  function randomPoint() {
    return new THREE.Vector3( THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ) );
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  function animate() {
    requestAnimationFrame( animate );
    group.rotation.y += 0.005;
    render();
  }

  function render() {
    renderer.render( scene, camera );
  }

  export default {
    name: 'ThreedFirstStep',
    mounted() {
      render();
    }
  };
</script>