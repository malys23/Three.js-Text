import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = {
    '1': textureLoader.load('/textures/matcaps/1.png'),
    '2': textureLoader.load('/textures/matcaps/2.png'),
    '3': textureLoader.load('/textures/matcaps/3.png'),
    '4': textureLoader.load('/textures/matcaps/4.png'),
    '5': textureLoader.load('/textures/matcaps/5.png')
}
const params = {matcap: '1'}
matcapTexture.colorSpace = THREE.SRGBColorSpace


/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello Three.js', 
            {
                font: font, 
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )

        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture['1'] })
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        /**
         * Objects
         */
        //function to generate donuts
        const count = {donutCount: 3000}
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

        //function to generate shapes
        const donutGroup = new THREE.Group();
        function shapeSetup(geometry, count){
            console.time('donuts')
            for(let i = 0; i<count.donutCount; i++){
                const donut = new THREE.Mesh(donutGeometry, material)

                donut.position.x = (Math.random() - 0.5) * 50
                donut.position.y = (Math.random() - 0.5) * 50
                donut.position.z = (Math.random() - 0.5) * 50

                donut.rotation.x = Math.random() * Math.PI
                donut.rotation.y = Math.random() * Math.PI

                const scale = Math.random()
                donut.scale.set(scale, scale, scale)

                donutGroup.add(donut)
                console.log(donutGroup.length)
            }
            scene.add(donutGroup)
            console.timeEnd('donuts')
        }

        //function to delete donut Group
        function removeShapes(){
            while(donutGroup.children.length>0){
                const child = donutGroup.children[0];
                donutGroup.remove(child);
            }
        }

        shapeSetup(donutGeometry, count)
        
        //Controller for matcap texture
        gui.add(params, 'matcap', Object.keys(matcapTexture)).onChange(value =>{
            material.matcap = matcapTexture[value]
            text.needsUpdate = true
            console.log(`MatCap changed to: ${value}`)
        })

        //Controller for donut Count
        gui.add(count, 'donutCount').min(100).max(10000).step(50).onChange(value =>{
            removeShapes()
            count.needsUpdate = true
            shapeSetup(donutGeometry, count)
            console.log(`donutCount changed to: ${value}`)
        })
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()