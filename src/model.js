import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import vertex from './shader/vertexShader.glsl'
import fragment from './shader/fragmentShader.glsl'
class Model {
    constructor(obj) {
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene
        this.color1 = obj.color1
        this.color2 = obj.color2
        this.placeOnLoad = obj.placeOnLoad

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            /*------------------------------
            Original Mesh
            ------------------------------*/
            this.mesh = response.scene.children[0]
            /*------------------------------
            Particles Material
            ------------------------------*/
            // this.particlesMaterial = new THREE.PointsMaterial({
            //     color: '#fff768',
            //     size: 0.02,
            //     wireframe: true
            // })
            this.particlesMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    // uColor1: { value: new THREE.Color('#004af2')},
                    // uColor2: { value: new THREE.Color('red')},
                    uColor1: { value: new THREE.Color(this.color1)},
                    uColor2: { value: new THREE.Color(this.color2)},
                    uTime: { value: 0},
                    uScale: { value: 0}
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                depthTest: false,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
            // this.mesh.material = this.material

            /*------------------------------
            Particles Geometry
            ------------------------------*/
            const sampler = new MeshSurfaceSampler(this.mesh).build()
            const numParticles = 10000
            this.particlesGeometry = new THREE.BufferGeometry()
            const particlesPosition = new Float32Array(numParticles * 3)

            for (let i = 0; i < numParticles; i++) {
                const newPosition = new THREE.Vector3()
                sampler.sample(newPosition)

                particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3)
            }

            this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))

            /*------------------------------
            Geometry Mesh
            ------------------------------*/
            this.geometry = this.mesh.geometry

            /*------------------------------
            Particles
            ------------------------------*/
            this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

            // place on load
            if (this.placeOnLoad) {
                this.add()
            }
        })
    }

    add() {
        this.scene.add(this.particles)
    }

    remove() {
        this.scene.remove(this.particles)
    }
}

export default Model
