
import {normal_V3} from './mathe.js'

const DIR_LIGHT = 0
const POINT_LIGHT = 1
const AMBIENT_LIGHT = 2

class DirectionalLight{
    constructor(direction = [0,-1,0], intensity = 1, color = [1,1,1]) {
        this.direction = normal_V3(direction)
        this.intensity = intensity
        this.color = color
        this.type = DIR_LIGHT
    }
}

class AmbientLight{
    constructor(intensity = 0.1, color = [1,1,1]) {
        this.intensity = intensity
        this.color = color
        this.type = AMBIENT_LIGHT
    }
}

export {AmbientLight,DirectionalLight}