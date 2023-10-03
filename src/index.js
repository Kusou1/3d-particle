import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Model from './model'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 5
camera.position.y = 1

/*------------------------------
Mesh
------------------------------*/
// const geometry = new THREE.BoxGeometry(2, 2, 2);
// const material = new THREE.MeshBasicMaterial( {
//   color: 0x00ff00,
// } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

/*------------------------------
OrbitControls
------------------------------*/
const controls = new OrbitControls(camera, renderer.domElement)

/*------------------------------
Helpers
------------------------------*/
// const gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

/*------------------------------
Models
------------------------------*/
const skull = new Model({
    name: 'skull',
    file: './models/skull.glb',
    scene: scene,
    placeOnLoad: true,
    color1: 'red',
    color2: 'yellow',
    background: '#47001b'
})

const horse = new Model({
    name: 'horse',
    file: './models/horse.glb',
    scene: scene,
    color1: 'blue',
    color2: 'pink',
    background: '#110047'
})

/*------------------------------
Controllers
------------------------------*/
const buttons = document.querySelectorAll('.button')
// buttons[0].addEventListener('click', ()=>{
//   skull.add()
//   horse.remove()
// })
// buttons[1].addEventListener('click', ()=>{
//   skull.remove()
//   horse.add()
// })

buttons[0].addEventListener('click', () => {
    skull.add()
    horse.remove()
})

buttons[1].addEventListener('click', () => {
    horse.add()
    skull.remove()
})

/*------------------------------
Clock
------------------------------*/
const clock = new THREE.Clock()

/*------------------------------
Loop
------------------------------*/
const animate = function () {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    if (skull.isActive) {
      skull.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
    }
    if (horse.isActive) {
      horse.particlesMaterial.uniforms.uTime.value = clock.getElapsedTime()
    }
}
animate()

/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize, false)


/*------------------------------
MouseMove
------------------------------*/
function onMouseMove(e) {
  // console.log(e)
 
  const x = e.clientX
  const y = e.clientY  

  gsap.to(scene.rotation, {
    y: gsap.utils.mapRange(0, window.innerWidth, .2, -.2, x),
    x: gsap.utils.mapRange(0, window.innerHeight, .2, -.2, y)
  })
}
window.addEventListener('mousemove', onMouseMove)