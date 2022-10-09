import {Raytracer,color} from './gl.js'
import {Sphere,Material,Plane,AABB,Triangle,Object3D} from './figures.js'
import {Texture,getEnvColor} from './texture.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights.js'


const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
const width = 4000
const height =4000
//Materiales

const laeves = new Material([0.9,0.9,0.9],64,TRANSPARENT,1,Texture('lea'))
const laeves2 = new Material([0.9,0.4,0.6],64,REFLECTIVE,1,Texture('lea'))

const blue = new Material([0.2,0.73,1],10,OPAQUE)
const log = new Material([0.9,0.9,0.9],64,OPAQUE,1.3010,Texture('log'))
const log2 = new Material([0.9,0.2,0.2],64,OPAQUE,1.3010,Texture('log'))


const Textpixels = Texture('a')
//const mil = getEnvColor(Textpixels,[1,1,1])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glClearColor(0.9,0.9,0.9)

rtx.glColor(0,0,0)
rtx.glClear()

rtx.envMap = Textpixels

rtx.lights.push(new AmbientLight(0.1))
rtx.lights.push(new PointLight([0.5,0.30,0]))
rtx.lights.push(new DirectionalLight([1,1,1],0.9))

//rtx.scena.push(new Object3D('sword',[0,0,-10],[0.1,0.1,0.1],[45,0,0],blue))

rtx.scena.push(new AABB([-7,-4,-30],[5,5,5],log))
rtx.scena.push(new AABB([-7,1,-30],[5,5,5],log))
rtx.scena.push(new AABB([-7,6,-30],[5,5,5],log))

rtx.scena.push(new AABB([-7,11,-30],[5,5,5],laeves))
rtx.scena.push(new AABB([-7,11,-35],[5,5,5],laeves))
rtx.scena.push(new AABB([-7,16,-35],[5,5,5],laeves))
rtx.scena.push(new AABB([-7,11,-25],[5,5,5],laeves))
rtx.scena.push(new AABB([-2,11,-30],[5,5,5],laeves))
rtx.scena.push(new AABB([-12,11,-30],[5,5,5],laeves))


rtx.scena.push(new AABB([8,-4,-30],[5,5,5],log2))
rtx.scena.push(new AABB([8,1,-30],[5,5,5],log2))
rtx.scena.push(new AABB([8,6,-30],[5,5,5],log2))

rtx.scena.push(new AABB([8,11,-30],[5,5,5],laeves2))
rtx.scena.push(new AABB([8,11,-35],[5,5,5],laeves2))
rtx.scena.push(new AABB([8,16,-35],[5,5,5],laeves2))
rtx.scena.push(new AABB([8,11,-25],[5,5,5],laeves2))
rtx.scena.push(new AABB([3,11,-30],[5,5,5],laeves2))
rtx.scena.push(new AABB([3,16,-30],[5,5,5],laeves2))
rtx.scena.push(new AABB([13,11,-30],[5,5,5],laeves2))
rtx.scena.push(new AABB([13,16,-30],[5,5,5],laeves2))
rtx.glRender()
rtx.glFinish('Proyecto2')