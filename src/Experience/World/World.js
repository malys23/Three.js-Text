import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Shapes from './Shapes.js'
import Message from './Message.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.shapes = new Shapes()
            this.text = new Message()
        })
        
    }
}