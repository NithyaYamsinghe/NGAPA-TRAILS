import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Canvas
const canvas = document.querySelector("canvas");

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  80, // Field of View
  window.innerWidth / window.innerHeight, // Aspect Ratio
  0.1, // Near
  4000 // Far
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Background Image
const textureLoader = new THREE.TextureLoader();
const backgroundTexture = textureLoader.load(
  "/model/uluru/textures/rastMat_baseColor.png"
); // Your background image path
scene.background = backgroundTexture;

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 10;
controls.maxDistance = 200;
controls.target.set(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load("/model/uluru/scene.gltf", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  model.position.x += model.position.x - center.x;
  model.position.y += model.position.y - center.y;
  model.position.z += model.position.z - center.z;

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
  camera.position.set(0, cameraDistance * 0.8, cameraDistance * 1.8);
  camera.lookAt(center);

  controls.target.copy(center);
  controls.update();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

// Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
