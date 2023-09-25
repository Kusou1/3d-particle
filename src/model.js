import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

class Model {
    constructor (obj) {
        this.name = obj.name
        this.file = obj.file
        this.scene = obj.scene

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('./draco/')
        this.loader.setDRACOLoader( this.dracoLoader )

        this.init()
    }

    init() {
        this.loader.load(this.file, (response) => {
            console.log(response)

            this.mesh = response.scene.children[0]
            console.log(this.mesh)
            this.material = new THREE.MeshBasicMaterial({
                color: "#fff768",
                wireframe: true
            })

            this.mesh.material = this.material
            console.log(this.mesh)
        })
    }
    
    add() {
        this.scene.add(this.mesh)
    }

    remove() {
        this.scene.remove(this.mesh)
    }
}

export default Model