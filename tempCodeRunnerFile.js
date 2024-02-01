
// function surface( u, v, target ) {
//   const n = 8,  // larger values make sharper square
//   t = 1.5; // larger values make more twists
      
//   u *= 2*Math.PI;
//   v *= 2*Math.PI;
      
//   var r = (Math.cos(v)**n + Math.sin(v)**n)**(-1/n);
//   var x = (4+r*Math.cos(v+t*u)) * Math.cos(u);
//   var y = (4+r*Math.cos(v+t*u)) * Math.sin(u);
//   var z = r*Math.sin(v+t*u);
    
//   target.set( x, y, z );
// } 
// const geometry = new ParametricGeometry(surface, 100, 100);   
// var object = new THREE.Mesh(
//   geometry,
//   new THREE.MeshNormalMaterial(),
// );	
// scene.add( object );