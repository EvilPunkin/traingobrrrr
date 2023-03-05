// haha some of this is from replit template dont make fun of me pls im still learning three.js


var frame = 0;
var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
	
// The three.js scene: the 3D world where you put objects
const scene = new THREE.Scene();

// The camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);

//light
const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 0, 2, 0 );
scene.add( light );

// Texture
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'textures/' );
const textureCube = loader.load( [
	'pickel.jpeg', 'pickel.jpeg',
	'pickel.jpeg', 'pickel.jpeg',
	'pickel.jpeg', 'pickel.jpeg'
] );
const cubeMat = new THREE.MeshToonMaterial( { color: 0xff6600 } );
const otherMat = new THREE.MeshStandardMaterial( { color: randomColor } );
const texture = new THREE.TextureLoader().load( 'textures/pickel.jpeg' );
const material = new THREE.MeshBasicMaterial( { map: texture } );

// A cube we are going to animate
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: cubeMat
};

// A cube we are going to animate
const cube2 = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: material
};

// A cube we are going to animate
const cube3 = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 1, 1),
  // The material: the appearance (color, texture) of the object
  material: cubeMat
};

// A cube we are going to animate
const ground = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(2, 0.1, 2),
  // The material: the appearance (color, texture) of the object
  material: otherMat
};

ground.mesh = new THREE.Mesh(ground.geometry, ground.material);
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
cube2.mesh = new THREE.Mesh(ground.geometry, ground.material);
cube3.mesh = new THREE.Mesh(ground.geometry, ground.material);

// Add the cube into the scene
scene.add(ground.mesh);
scene.add(cube.mesh);
scene.add(cube2.mesh);
scene.add(cube3.mesh);

// Make the camera further from the cube so we can see it better
camera.position.z = 5;
camera.position.y = 1.5;
camera.rotation.x = -0.4;
	

function render() {
  // Render the scene and the camera
  renderer.render(scene, camera);

	camera.position.x = Math.sin(frame);
	camera.rotation.z += 0.01;

	// camera.position.y += 0.1;
	// camera.position.z += 0.1;

	
  // Rotate the cube every frame
  cube.mesh.position.x = Math.sin(frame*7);
  cube.mesh.position.y = Math.sin(frame*3);
  cube.mesh.position.z = Math.sin(frame*9);

	cube2.mesh.scale.x = Math.random(1,10);
	cube2.mesh.scale.y = Math.random(1,10);
	cube2.mesh.scale.z = Math.random(1,10);
  cube2.mesh.position.x = Math.sin(frame*2);
  cube2.mesh.position.y = Math.sin(frame*8);
  cube2.mesh.position.z = Math.sin(frame*35);
  cube2.mesh.rotation.z += 2;

  cube3.mesh.position.x = Math.random(-20,20);
  cube3.mesh.position.y = Math.random(-20,20);
  cube3.mesh.position.z = Math.random(-20,20);
	cube3.mesh.rotation.z += 2;
	
  ground.mesh.rotation.x = Math.sin(frame*9);
  ground.mesh.rotation.y += 2;
  ground.mesh.rotation.z += 4;

  cubeMat.color.setRGB(Math.random(1,255), Math.random(1,255), Math.random(1,255)
);
	
	frame += 1/60;	
	
  // Make it call the render() function about every 1/60 second
  requestAnimationFrame(render);
}

render();