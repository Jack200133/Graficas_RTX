import {producto_matriz_vector,productos_matrices,normal_V3,mult_vect,producto_cruz,suma_vec,resta_vectores,producto_punto,magnitud_V3,inversa} from './mathe.js'
import {Obj} from './obj.js'

const WHITE = [1,1,1]
const BLACK = [0,0,0 ]


const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
class Intersect{
    constructor(sceneOBJ,distancia,punto,normal,textcoords) {
        this.sceneOBJ = sceneOBJ
        this.distancia = distancia
        this.punto = punto
        this.normal = normal
        this.textcoords = textcoords
        
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

        const u = 1 - (Math.atan2(normal[2],normal[0])/(2*Math.PI)+0.5)
        const v = Math.acos(-normal[1])/Math.PI

        const textcoords = [u,v]

        return new Intersect(this,t0,P,normal,textcoords)
    }
}

class Material{
    constructor(diffuse = WHITE,spec = 1.0,matType = OPAQUE,ior = 1.0,texture = null) {
        this.diffuse = diffuse
        this.matType = matType
        this.spec = spec
        this.ior = ior
        this.texture = texture
    }
}


class Plane{
    constructor(normal,offset,material) {
        this.normal = normal
        this.offset = offset
        this.material = material
    }

    ray_intersect(origen,direccion){
        const denom = producto_punto(direccion,this.normal)
        if (Math.abs(denom) > 1e-6){
        //const t = -(producto_punto(origen,this.normal) + this.offset)/denom
            const t = producto_punto(resta_vectores(this.offset,origen),this.normal)/denom
            if (t>0){
                const P = suma_vec(origen,mult_vect(direccion,t))
                return new Intersect(this,t,P,this.normal)
            }
        }
        return null
    }
}

class AABB{
    constructor(posicion,size,material) {
        this.posicion = posicion
        this.size = size
        this.material = material

        this.planes = [
            new Plane([1,0,0],suma_vec(posicion,[size[0]/2,0,0],material)),
            new Plane([-1,0,0],suma_vec(posicion,[-size[0]/2,0,0],material)),
            //new Plane([-1,0,0],-posicion[0]+size[0]/2,material),
            new Plane([0,1,0],suma_vec(posicion,[0,size[1]/2,0],material)),
            new Plane([0,-1,0],suma_vec(posicion,[0,-size[1]/2,0],material)),

            // new Plane([0,1,0],posicion[1]+size[1]/2,material),
            // new Plane([0,-1,0],-posicion[1]+size[1]/2,material),

            new Plane([0,0,1],suma_vec(posicion,[0,0,size[2]/2],material)),
            new Plane([0,0,-1],suma_vec(posicion,[0,0,-size[2]/2],material)),

            // new Plane([0,0,1],posicion[2]+size[2]/2,material),
            // new Plane([0,0,-1],-posicion[2]+size[2]/2,material),
        ]
        this.boundsMIN = []
        this.boundsMAX = []
        const epsilon = 0.0001

        for (let i = 0; i < 3; i++) {
            this.boundsMIN[i] = posicion[i] - (epsilon+size[i]/2)
            this.boundsMAX[i] = posicion[i] + (size[i]/2 + epsilon)
        }
    }

    ray_intersect(orig,dir){
        let intersect = null
        let closest = Infinity
        let v =0
        let u =0
        for (let plane of this.planes){
            const inter = plane.ray_intersect(orig,dir)
            if (inter){
                const planePoint = inter.punto

                if (this.boundsMIN[0] <=  planePoint[0]  && planePoint[0] <= this.boundsMAX[0] ){
                    if ( this.boundsMIN[1] <=  planePoint[1]  && planePoint[1] <= this.boundsMAX[1]){
                        if(this.boundsMIN[2] <=  planePoint[2]  && planePoint[2] <= this.boundsMAX[2]){

                            if (inter.distancia < closest){
                                closest = inter.distancia
                                intersect = inter

                                


                                if (Math.abs(inter.normal[0])>0){
                                    u = (planePoint[2] - this.boundsMIN[2])/(this.boundsMAX[2] - this.boundsMIN[2])
                                    v = (planePoint[1] - this.boundsMIN[1])/(this.boundsMAX[1] - this.boundsMIN[1])
                                }else if (Math.abs(inter.normal[1])>0){
                                    u = (planePoint[0] - this.boundsMIN[0])/(this.boundsMAX[0] - this.boundsMIN[0])
                                    v = (planePoint[2] - this.boundsMIN[2])/(this.boundsMAX[2] - this.boundsMIN[2])
                                }else if (Math.abs(inter.normal[2])>0){
                                    u = (planePoint[0] - this.boundsMIN[0])/(this.boundsMAX[0] - this.boundsMIN[0])
                                    v = (planePoint[1] - this.boundsMIN[1])/(this.boundsMAX[1] - this.boundsMIN[1])
                                }
                            }
                        }
                    }
                }
            }
        }
        if (intersect === null){
            return null
        }
        return new Intersect(this,closest,intersect.punto,intersect.normal,[u,v])
        
    }

}

class Triangle{
    constructor(A,B,C,material) {
        this.A = A
        this.B = B
        this.C = C
        this.material = material
        this.normal = normal_V3(inversa(producto_cruz(resta_vectores(B,A),resta_vectores(C,A))))
    }

    ray_intersect(orig,dir){
        const edge1 = resta_vectores(this.B,this.A)
        const edge2 = resta_vectores(this.C,this.A)
        const h = producto_cruz(dir,edge2)
        const a = producto_punto(edge1,h)
        if (a > -1e-6 && a < 1e-6){
            return null
        }
        const f = 1/a
        const s = resta_vectores(orig,this.A)
        const u = f * producto_punto(s,h)
        if (u < 0 || u > 1){
            return null
        }
        const q = producto_cruz(s,edge1)
        const v = f * producto_punto(dir,q)
        if (v < 0 || u+v > 1){
            return null
        }
        const t = f * producto_punto(edge2,q)
        if (t > 1e-6){
            const P = suma_vec(orig,mult_vect(dir,t))
            
            return new Intersect(this,t,P,this.normal,[u,v])
        }
        return null
    }
}

class Object3D{
    constructor(filename,translate=[0,0,0],scale=[1,1,1],rotate=[0,0,0],material) {
        this.obj = new Obj(filename)
        this.material = material
        this.triangles = []
        const modelMatrix = this.glCreateObjectMatrix(translate,scale,rotate)

        for (let face of this.obj.faces){
            const A = this.glTransformVertex(this.obj.vertices[face[0][0]-1],modelMatrix)
            const B = this.glTransformVertex(this.obj.vertices[face[1][0]-1],modelMatrix)
            const C = this.glTransformVertex(this.obj.vertices[face[2][0]-1],modelMatrix)

            this.triangles.push(new Triangle(A,B,C,material))

            if (face.length > 3){
                const D = this.glTransformVertex(this.obj.vertices[face[3][0]-1],modelMatrix)
                this.triangles.push(new Triangle(A,C,D,material))
            }
        }

    }

    ray_intersect(orig,dir){
        let intersect = null
        let closest = Infinity

        for (let triangle of this.triangles){
            const inter = triangle.ray_intersect(orig,dir)
            if (inter){
                if (inter.distancia < closest){
                    closest = inter.distancia
                    intersect = inter
                }
            }
        }
        if (intersect === null){
            return null
        }   
        return new Intersect(this,closest,intersect.punto,intersect.normal,[0,0])
    }

    glTransformVertex(vertex,modelMatrix){
        const gl_vertex = [vertex[0],vertex[1],vertex[2],1]
        const new_vertex = producto_matriz_vector(modelMatrix,gl_vertex)

        const res = [new_vertex[0]/new_vertex[3],
                    new_vertex[1]/new_vertex[3],
                    new_vertex[2]/new_vertex[3]]
        return res
    }

    glCreateObjectMatrix(translate,scale,rotate){
        const translation = [[1,0,0,translate[0]],
                            [0,1,0,translate[1]],
                            [0,0,1,translate[2]],
                            [0,0,0,1]]

        const rotation = this.glCreateRotationMatrix(...rotate)

        const scaling = [[scale[0],0,0,0],
                        [0,scale[1],0,0],
                        [0,0,scale[2],0],
                        [0,0,0,1]]

        const tr = productos_matrices(translation,rotation)
        const trs = productos_matrices(tr,scaling)

        return trs
    }

    glCreateRotationMatrix(pit, ya, rol){
        const pitch = (Math.PI/180)*pit
        const yaw = (Math.PI/180)*ya
        const roll = (Math.PI/180)*rol


        const pitchMatrix = [[1,0,0,0],
                            [0,Math.cos(pitch),-Math.sin(pitch),0],
                            [0,Math.sin(pitch),Math.cos(pitch),0],
                            [0,0,0,1]]
        const yawMatrix = [[Math.cos(yaw),0,Math.sin(yaw),0],
                            [0,1,0,0],
                            [-Math.sin(yaw),0,Math.cos(yaw),0],
                            [0,0,0,1]]
        const rollMatrix = [[Math.cos(roll),-Math.sin(roll),0,0],
                            [Math.sin(roll),Math.cos(roll),0,0],
                            [0,0,1,0],
                            [0,0,0,1]]
        return productos_matrices(productos_matrices(pitchMatrix,yawMatrix),rollMatrix)
    }

}

export {Sphere,Material,Plane,AABB,Triangle,Object3D}