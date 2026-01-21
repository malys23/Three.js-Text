import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 300 })

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
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture['1'] })

const writing = {message: 'Your Text Here'}
const textGroup = new THREE.Group();
//function to generate writing
function textCreation(writing){
    fontLoader.load(
        '/fonts/helvetiker_regular.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(
                writing.message, 
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
            const text = new THREE.Mesh(textGeometry, material)
            textGroup.add(text)
            scene.add(textGroup)     
        }
    ) 
}
textCreation(writing)

//function to remove writing
function removeText(){
    while(textGroup.children.length>0){
        const child = textGroup.children[0];
        textGroup.remove(child);
    }
}

//gui to change text
gui.add(writing, 'message').onFinishChange(value=>{
    removeText()
    writing.needsUpdate
    textCreation(writing)
    console.log('User typed: ', value)
})  

/**
* Objects
*/
//function to generate shapes
const count = {shapeCount: 1000}
const density = {shapeDensity: 20}
const shapeGroup = new THREE.Group();

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const shapeGeometry = {
    'Donuts': donutGeometry,
    'Spheres': sphereGeometry,
    'Boxes': boxGeometry
}
const shapes = {geometry: shapeGeometry['Donuts']}

function shapeSetup(geometry, count){
    console.time('shapes')
    for(let i = 0; i<count.shapeCount; i++){
        const shape = new THREE.Mesh(geometry, material)

        shape.position.x = (Math.random() - 0.5) * density.shapeDensity
        shape.position.y = (Math.random() - 0.5) * density.shapeDensity
        shape.position.z = (Math.random() - 0.5) * density.shapeDensity

        shape.rotation.x = Math.random() * Math.PI
        shape.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        shape.scale.set(scale, scale, scale)

        shapeGroup.add(shape)
        console.log(shapeGroup.length)
    }
    scene.add(shapeGroup)
    console.timeEnd('shapes')
}

shapeSetup(shapes.geometry, count)

//function to delete shape Group
function removeShapes(){
    while(shapeGroup.children.length>0){
        const child = shapeGroup.children[0];
        shapeGroup.remove(child);
    }
}       
//Controller for matcap texture
gui.add(params, 'matcap', Object.keys(matcapTexture)).onChange(value =>{
    material.matcap = matcapTexture[value]
    text.needsUpdate = true
    console.log(`MatCap changed to: ${value}`)
})

//Controller for Count
gui.add(count, 'shapeCount').min(100).max(10000).step(50).onChange(value =>{
    removeShapes()
    count.needsUpdate = true
    shapeSetup(shapes.geometry, count)
    console.log(`shapeCount changed to: ${value}`)
})

//Controller for Density
gui.add(density, 'shapeDensity').min(10).max(200).step(10).onChange(value =>{
    removeShapes()
    density.needsUpdate = true
    shapeSetup(shapes.geometry, count)
    console.log(`shapeDensity changed to: ${value}`)
})

//Controller for shape
gui.add(shapes, 'geometry', Object.keys(shapeGeometry)).onChange(value =>{
    removeShapes()
    shapes.geometry = shapeGeometry[value]
    shapeSetup(shapes.geometry, count)
    console.log(`Shape changed to: ${value}`)
})

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
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