import Experience from "../Experience.js"

export default class Message
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
        
    }

    setTextures()
    {

    }

    setMaterial()
    {}

    setMesh()
    {}
}