const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a1a);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3);  
pointLight.position.set(0, 0, 0);  // Sun's position for light source
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();

// Add the Sun
const sunTexture = textureLoader.load('../assets/textures/2k_sun.jpg');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet Data: Semi-major axis (scaled), eccentricity, orbit speed, and rotation speed for each planet
const planetsData = [
  { name: 'Mercury', texture: '2k_mercury.jpg', size: 0.4, a: 15 * 0.387, e: 0.2056, speed: 0.04, rotationSpeed: 0.005 },
  { name: 'Venus', texture: '2k_venus_surface.jpg', size: 0.9, a: 15 * 0.723, e: 0.0068, speed: 0.03, rotationSpeed: 0.001 },
  { name: 'Earth', texture: '2k_earth_daymap.jpg', size: 1, a: 15 * 1.000, e: 0.0167, speed: 0.02, rotationSpeed: 0.01 },
  { name: 'Mars', texture: '2k_mars.jpg', size: 0.6, a: 15 * 1.524, e: 0.0934, speed: 0.015, rotationSpeed: 0.01 },
  { name: 'Jupiter', texture: '2k_jupiter.jpg', size: 3, a: 15 * 5.203, e: 0.0489, speed: 0.008, rotationSpeed: 0.02 },
  { name: 'Saturn', texture: '2k_saturn.jpg', size: 2.4, a: 15 * 9.537, e: 0.0565, speed: 0.006, rotationSpeed: 0.015 },
  { name: 'Uranus', texture: '2k_uranus.jpg', size: 2, a: 15 * 19.191, e: 0.0463, speed: 0.004, rotationSpeed: 0.013 },
  { name: 'Neptune', texture: '2k_neptune.jpg', size: 1.9, a: 15 * 30.069, e: 0.0086, speed: 0.002, rotationSpeed: 0.013 }
];

// Create Planet Meshes and add them to the scene
const planetMeshes = planetsData.map(planet => {
  const texture = textureLoader.load(`../assets/textures/${planet.texture}`);
  const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return { mesh, a: planet.a, e: planet.e, speed: planet.speed, rotationSpeed: planet.rotationSpeed, angle: Math.random() * Math.PI * 2 };  // Initialize with random angle for orbits
});

// Orbit controls for interactive viewing
const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.00005;  // Time variable for revolution (orbit)

  // Rotate the Sun slowly
  sun.rotation.y += 0.002;  // Slow rotation of the Sun

  planetMeshes.forEach(planet => {
    const a = planet.a;  // Semi-major axis
    const e = planet.e;  // Eccentricity
    const speed = planet.speed;  // Speed of orbit
    const rotationSpeed = planet.rotationSpeed;  // Speed of axial rotation

    // Update the current angle for orbit based on time and speed
    planet.angle += speed;  // Update orbit angle over time

    // Calculate the orbit position using the elliptical orbit formula
    const r = a * (1 - e * e) / (1 + e * Math.cos(planet.angle));  // Orbit equation

    // Update position for elliptical orbit
    planet.mesh.position.x = r * Math.cos(planet.angle);
    planet.mesh.position.z = r * Math.sin(planet.angle);

    // Rotate the planet on its axis
    planet.mesh.rotation.y += rotationSpeed;  // Planet spinning
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
