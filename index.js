import {Raytracer,color} from './gl.js'
import {Sphere,Material,Plane,AABB,Triangle} from './figures.js'
import {Texture,getEnvColor} from './texture.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights.js'


const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
const width = 3000
const height =3000
//Materiales

const blue = new Material([0.2,0.73,1],10,OPAQUE)
const green = new Material([0.2,0.9,0.2],10,OPAQUE)
const red = new Material([0.9,0.2,0.2],10,OPAQUE)
const yellow = new Material([0.8,0.8,0.2],10,OPAQUE)


const blacmirror = new Material([0.3,0.3,0.3],16,REFLECTIVE)
const bluemirror = new Material([0.3,0.3,0.8],16,REFLECTIVE)
const yellowmirror = new Material([0.8,0.8,0.3],16,REFLECTIVE)
const mirror = new Material([0.8,0.8,0.8],16,REFLECTIVE)

const blood = new Material([0.9,0.5,0.5],64,TRANSPARENT,1.3010)
const saphiro = new Material([0.3588,0.6215,0.8],150,TRANSPARENT,1.779)
const glass = new Material([0.9,0.9,0.9],150,TRANSPARENT,1.5)

const Textpixels = Texture('playa')
//const mil = getEnvColor(Textpixels,[1,1,1])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glClearColor(0.9,0.9,0.9)

 rtx.glColor(0,0,0)
 rtx.glClear()

rtx.envMap = Textpixels

rtx.lights.push(new AmbientLight())
//rtx.lights.push(new PointLight([0.5,0.30,2]))
rtx.lights.push(new DirectionalLight([0,0,-1],0.5))

rtx.scena.push(new Triangle([-2,1,-10],[0,1,-13],[-1,-1,-10],red))
rtx.scena.push(new Triangle([0,-3,-10],[-2,-3,-13],[-1,-1,-10],blue))

rtx.scena.push(new Sphere(1,[0,0,-13],green))
rtx.scena.push(new Sphere(1,[0,0,-10],glass))
rtx.scena.push(new Sphere(1,[5,-1.5,-11],mirror))


rtx.glRender()
rtx.glFinish('index')