import * as THREE from 'three'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.textureLoader = new THREE.TextureLoader()
    }

    startLoading()
    {
        for (const source of this.sources)
        {
            // Load source
            this.loaders.textureLoader.load(
                source.path,
                (file) =>
                {
                    this.sourceLoaded(source, file)
                }
            )
        }
    }

    sourceLoaded(sources, file)
    {
        this.items[sources.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            console.log('Finished!')
            this.trigger('ready')
        }
    }
}