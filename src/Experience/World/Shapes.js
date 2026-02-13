import Experience from "../Experience.js"

export default class Shapes
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry()
    {
        this.donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        this.sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
        this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
        
        this.shapeGeometry = 
        {
            'Donuts': this.donutGeometry,
            'Spheres': this.sphereGeometry,
            'Boxes': this.boxGeometry
        }

        this.currentShape = {geometry: shapeGeometry['Donuts']}
    }
 
    setTextures()
    {
        this.textures = {}

        this.textures.color = this.resources.items.environmentMapTexture
        this.textures.color.colorSpace = ThreeMFLoader.SRGBColorSpace
    }

    //For Matcaps
    setMaterial()
    {
        this.material = new THREE.MeshMatcapMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }

    setMesh()
    {
        this.count = {shapeCount: 1000}
        this.density = {shapeDensity: 20}
        this.shapeGroup = new THREE.Group()

        this.setShapeGroup(this.currentShape.geometry, this.count, this.material, this.density, this.shapeGroup)
        this.scene.add(this.shapeGroup)
    }

    setShapeGroup(geometry, count, material, density, shapeGroup)
    {
        for(let i= 0; i<count.shapeCount; i++)
        {
            const shape = new THREE.Mesh(geometry, material)

            shape.position.x = (Math.random() - 0.5) * density.shapeDensity
            shape.position.y = (Math.random() - 0.5) * density.shapeDensity
            shape.position.z = (Math.random() - 0.5) * density.shapeDensity

            shape.rotation.x = Math.random() * Math.PI
            shape.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            shape.scale.set(scale, scale, scale)

            shapeGroup.add(shape)
        }
    }
}