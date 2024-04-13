import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';
import { Water } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/objects/Water.js';
import { Sky } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/objects/Sky.js';
import { clamp } from './utils.js';

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();
let water, sky, sun;

let airFog;
let airColor = new THREE.Color(0x90cae5);
let airFogDistance = 800;

let waterFog;
let waterColor = new THREE.Color(0x071516);
let waterFogDistance = 100;

const skyParameters = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 20,
    azimuth: 180,
};

let renderTarget;
const sceneEnv = new THREE.Scene();
let pmremGenerator;

let scene, renderer, waterUniforms;


export function initScene() {
    const scene = new THREE.Scene();

    airFog = new THREE.Fog(airColor, 1, airFogDistance);
    waterFog = new THREE.Fog(waterColor, 1, waterFogDistance);

    scene.fog = airFog;
    scene.background = waterColor;
    
    return scene;
}

export function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.antialias = false;
    renderer.setPixelRatio( window.devicePixelRatio / 3 );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileCubemapShader();
    return renderer;
}

// ------------------------------------------

export function fog(scene, cam) {
    if(cam.position.y > 0.001) {
        scene.fog = airFog;
        scene.background = airColor;
    } else {
        scene.fog = waterFog;
        scene.background = waterColor;
    }
}


export function setupScene(scn) {
    scene = scn;

    // renderer.toneMappingExposure = effectController.exposure;

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x2b4c59, 5);
    hemisphereLight.position.set(0, 10, 0);
    scene.add(hemisphereLight);

    // const helper = new THREE.DirectionalLightHelper(sun);
    // scene.add(helper);

    // ground
    sun = new THREE.Vector3();

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    ground.position.y = -300;
    scene.add(ground);

    // ocean
    const oceanGeometry = new THREE.PlaneGeometry(1000, 1000);
    textureLoader.load('../references/submarine/waternormals.jpg',
        function(texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            water = new Water(
                oceanGeometry,
                {
                    textureWidth: 512,
                    textureHeight: 512,
                    waterNormals: texture,
                    sunDirection: new THREE.Vector3(0, 0, 0 ),
                    sunColor: 0xffffff,
                    waterColor: 0x001e0f,
                    distortionScale: 2,
                    fog: scene.fog !== undefined,
                }
            );


            // const ocean = new THREE.Mesh(oceanGeometry, water);
            water.rotation.x = Math.PI / -2;
            // ocean.position.y = 0;
            scene.add(water);

            // Skybox
            sky = new Sky();
            sky.scale.setScalar( 10000 );
            scene.add( sky );


            // sun
            const skyUniforms = sky.material.uniforms;
            skyUniforms[ 'turbidity' ].value = skyParameters.turbidity;
            skyUniforms[ 'rayleigh' ].value = skyParameters.rayleigh;
            skyUniforms[ 'mieCoefficient' ].value = skyParameters.mieCoefficient;
            skyUniforms[ 'mieDirectionalG' ].value = skyParameters.mieDirectionalG;

            const phi = THREE.MathUtils.degToRad( 90 - skyParameters.elevation );
            const theta = THREE.MathUtils.degToRad( skyParameters.azimuth );
            sun.setFromSphericalCoords( 1, phi, theta );
            const sunLight = new THREE.DirectionalLight(0xf2e7cb, 5);
            scene.add(sunLight);

            skyUniforms[ 'sunPosition' ].value.copy( sun );

            sunLight.position.set(0, 10, 10);
            sunLight.target.position.set(0, 0, 0);
            sunLight.target.updateMatrixWorld();

            waterUniforms = water.material.uniforms;
            waterUniforms[ 'size' ].value = 6;
            waterUniforms[ 'sunDirection' ].value.copy( sun ).normalize();



            // generating lighting DOESN'T FUCKING WORK, i think it's because the example i'm using uses an old version of three js
            // if anyone knows how to make this work please tell me
            /*
            if ( renderTarget !== undefined ) renderTarget.dispose();

            sceneEnv.add( sky );
            renderTarget = pmremGenerator.fromScene( sceneEnv );

            scene.add( sky );
            scene.environment = renderTarget.texture;
            */
        }
    );
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    if(waterUniforms !== undefined) {
        waterUniforms[ 'time' ].value += 0.5 / 60.0;
    }
}