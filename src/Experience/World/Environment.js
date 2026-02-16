import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor ()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        //Add lighting if necessary
        //this.setSunLight()
        this.setEnvironmentMap()
    }

    // setSunLight()
    // {}

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.udpateMaterials = () =>
        {
            this.scene.traverse((child) =>
                {
                    if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshMatcapMaterial)
                    {
                        child.material.envMap = this.environmentMap.texture 
                        child.material.needsUpdate = true
                    }
                })
        }

        this.environmentMap.udpateMaterials()
    }
}