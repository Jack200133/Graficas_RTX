import {normal_V3,mult_vect,suma_vec,resta_vectores,producto_punto,magnitud_V3} from './mathe.js'

const WHITE = [1,1,1]
const BLACK = [0,0,0 ]

class Intersect{
    constructor(sceneOBJ,distancia,punto,normal) {
        this.sceneOBJ = sceneOBJ
        this.distancia = distancia
        this.punto = punto
        this.normal = normal
        
    }
}

class Sphere {
    constructor(radio,centro,material) {
        this.radio = radio
        this.centro = centro
        this.material=material
    }

    ray_intersect(origen,direccion){
        const L = resta_vectores(this.centro,origen)

        const tca = producto_punto(L,direccion)

        const d =( magnitud_V3(L)**2 - tca**2 )**0.5

        if (d > this.radio){
            return false
        }

        const thc = (this.radio**2 -d **2)**0.5
        const t0 = tca - thc
        const t1 = tca + thc

        if (t0<0 && t1<0){
            return null
        }
        const mult = mult_vect(direccion,t0)
        const P = suma_vec(origen,mult)
        const normal = normal_V3(resta_vectores(P,this.centro))
        return new Intersect(this,t0,P,normal,direccion)
    }
}

class Material{
    constructor(diffuse = WHITE,spec = 1.0) {
        this.diffuse = diffuse
        this.spec = spec
    }
}

export {Sphere,Material}