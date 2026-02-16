import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import Experience from '../Experience.js'

export default class Message
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.fontLoader = new FontLoader()

        this.setTextures()
        this.setMaterial()
        this.setText()
    }
    
    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.environmentMapTexture
        this.textures.color.colorSpace = THREE.SRGBColorSpace
    }

    setMaterial()
    {
        this.material = new THREE.MeshMatcapMaterial({
            maps: this.textures.color
        })
    }

    setText()
    {
        this.writing = 
        {
            message: "Your Text Here"
        }

        this.textGroup = new THREE.Group() 

        this.fontLoader.load
        (
            '/fonts/helvetiker_regular.typeface.json',
            (font) => {
                this.textGeometry = new TextGeometry
                (
                    this.writing.message,
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
                this.textGeometry.center()                   

                this.text = new THREE.Mesh(this.textGeometry, this.material)
                this.textGroup.add(this.text)
            
                this.scene.add(this.textGroup)
                console.log("Font info has loaded from static")
            },
            undefined,
            (error) => 
            {
                console.error("Font failed to load:" , error)
            }
        )
    }
}