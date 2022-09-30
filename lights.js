
import {magnitud_V3,suma_vec,getReflect,normal_V3,mult_vect,producto_punto,resta_vectores,inversa} from './mathe.js'

const DIR_LIGHT = 0
const POINT_LIGHT = 1
const AMBIENT_LIGHT = 2

class DirectionalLight{
    constructor(direction = [0,-1,0], intensity = 1, color = [1,1,1]) {
        this.direction = normal_V3(direction)
        this.light_dir = inversa(this.direction)
        this.intensity = intensity
        this.color = color
        this.type = DIR_LIGHT
    }

    getDiffuseColor(inter,raytracer){
        const ligt_dir = inversa(this.direction)
        
        const intensity = Math.max(producto_punto(inter.normal,ligt_dir),0)*this.intensity


        const diffuseColor = [ 
          intensity * this.color[0],
          intensity * this.color[1],
          intensity * this.color[2]
        ]
        return diffuseColor
    }

    getSpecColor(inter,raytracer){
        const ligt_dir = inversa(this.direction)
        //console.log(inter.normal,ligt_dir)
        const R = getReflect(inter.normal,ligt_dir)
        //console.log(raytracer.camPos,inter.punto)
        const view_dir = normal_V3(resta_vectores(raytracer.camPos,inter.punto))


        const spec_intensity = this.intensity *( Math.max(producto_punto(view_dir,R),0))**inter.sceneOBJ.material.spec

        const specColor = [ 
            spec_intensity * this.color[0],
            spec_intensity * this.color[1],
            spec_intensity * this.color[2]
        ]
        //console.log(specColor)
        return specColor

    }

    getShadowIntensity(inter,raytracer){
        const ligt_dir = inversa(this.direction)
        //console.log(inter.punto,ligt_dir,inter.sceneOBJ)
        const shadow_inter = raytracer.glscene_intersect(inter.punto,ligt_dir,inter.sceneOBJ)? 1:0
        //const shadow_inter =0
        return shadow_inter
    }

    getColor(inter,raytracer){
        const ligt_dir = inversa(this.direction)
        
        const intensity = Math.max(producto_punto(inter.normal,ligt_dir),0)*this.intensity


        const diffuseColor = [ 
          intensity * this.color[0],
          intensity * this.color[1],
          intensity * this.color[2]
        ]

        const R = getReflect(inter.normal,ligt_dir)
        const view_dir = normal_V3(resta_vectores(raytracer.camPos,inter.punto))


        const spec_intensity = (this.intensity * Math.max(producto_punto(view_dir,R),0))**inter.sceneOBJ.material.spec

        const specColor = [ 
            spec_intensity * this.color[0],
            spec_intensity * this.color[1],
            spec_intensity * this.color[2]
        ]


        const shadow_inter = raytracer.glscene_intersect(inter.punto,ligt_dir,inter.sceneOBJ)? 1:0
        //const shadow_inter =0
        return mult_vect(suma_vec(diffuseColor,specColor),(1-shadow_inter))
    }
}

class PointLight{
    constructor(point,color = [1,1,1],constant = 1.0, linear = 0.1, quad = 0.01){
        this.point = point
        this.color = color
        this.constant = constant
        this.linear = linear
        this.quad = quad
        this.type = POINT_LIGHT
        //this.light_dir = normal_V3(resta_vectores(this.point, inter.punto))
    }

        
    getDiffuseColor(inter,raytracer){
        const light_dir = normal_V3(resta_vectores(this.point,inter.punto))
        // att =1/(kc + kl*d+Kq *d*d)
        //const atte = 1.0 / (this.constant + this.linear * light_distance + this.quad * light_distance**2)
        //console.log(this.constant ,this.linear , light_distance, this.quad )
        const atte = 1
        const intensity = Math.max(producto_punto(inter.normal,light_dir)*atte,0)



        const diffuseColor = [ 
          intensity * this.color[0],
          intensity * this.color[1],
          intensity * this.color[2]
        ]
        return diffuseColor
    }

    getSpecColor(inter,raytracer){
        const light_distance = normal_V3(resta_vectores(this.point,inter.punto))
        const R = getReflect(inter.normal,light_distance)
        const view_dir = normal_V3(resta_vectores(raytracer.camPos,inter.punto))

        const atte = 1.0
        const intensity = Math.max((producto_punto(inter.normal,light_distance)*atte),0)
        const spec_intensity = (intensity* Math.max(producto_punto(view_dir,R),0))**inter.sceneOBJ.material.spec

        const specColor = [ 
            spec_intensity * this.color[0],
            spec_intensity * this.color[1],
            spec_intensity * this.color[2]
        ]
        return specColor

    }

    getShadowIntensity(inter,raytracer){
        const l = resta_vectores(this.point,inter.punto)
        const ligt_dis = magnitud_V3(l)
        const ligt_dir = normal_V3(l)
        const shadow_inter = raytracer.glscene_intersect(inter.punto,ligt_dir,inter.sceneOBJ)
        if (shadow_inter){
            if (shadow_inter.distancia < ligt_dis){
                return 1
            }
        }
        //const shadow_inter =0
        return 0
    }

    getColor(inter,raycast){
        const ligt_dir =normal_V3(resta_vectores(this.point, inter.punto))


        const light_distance = magnitud_V3(normal_V3(resta_vectores(this.point,inter.punto)))
        // att =1/(kc + kl*d+Kq *d*d)
        //const atte = 1.0 / (this.constant + this.linear * light_distance + this.quad * light_distance**2)
        //console.log(this.constant ,this.linear , light_distance, this.quad )
        const atte = 1
        const intensity = Math.max(producto_punto(inter.normal,ligt_dir)*atte,0)



        const diffuseColor = [ 
          intensity * this.color[0],
          intensity * this.color[1],
          intensity * this.color[2]
        ]
        const R = getReflect(inter.normal,ligt_dir)
        const view_dir = normal_V3(resta_vectores(raycast.camPos,inter.punto))


        const spec_intensity = (intensity* Math.max(producto_punto(view_dir,R),0))**inter.sceneOBJ.material.spec

        const specColor = [ 
            spec_intensity * this.color[0],
            spec_intensity * this.color[1],
            spec_intensity * this.color[2]
        ]


        const shadow_inter = raycast.glscene_intersect(inter.punto,ligt_dir,inter.sceneOBJ)? 1:0
        //const shadow_inter =0
        return mult_vect(suma_vec(diffuseColor,specColor),(1-shadow_inter))
    }
}

class AmbientLight{
    constructor(intensity = 0.1, color = [1,1,1]) {
        this.intensity = intensity
        this.color = color
        this.type = AMBIENT_LIGHT
    }

    
    getDiffuseColor(inter,raytracer){
        
        return mult_vect(this.color,this.intensity)
    }

    getSpecColor(inter,raytracer){
        return [0,0,0]

    }

    getShadowIntensity(inter,raytracer){

        return 0
    }

    getColor(inter,raytracer){
        return mult_vect(this.color,this.intensity)
    }
}

export {AmbientLight,DirectionalLight,PointLight}