import {Raytracer,color} from './gl.js'
import {Sphere,Material} from './figures.js'
import {Texture,getEnvColor} from './texture.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights.js'


const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
const width = 2000
const height =2000
//Materiales
const nouse = new Material([0.94,0.32,0.21],100)
const grass = new Material([0.3,1,0.3],16)
const blacmirror = new Material([0.1,0.1,0.1],16,REFLECTIVE)
const redmirror = new Material([0.9,0.2,0.2],16,REFLECTIVE)
const bluemirror = new Material([0.2,0.2,0.9],32,OPAQUE)
const greenmirror = new Material([0.1,0.9,0.1],126,OPAQUE)
const yellowmirror = new Material([0.9,0.9,0.2],16,REFLECTIVE)
const glass = new Material([0.9,0.5,0.5],64,TRANSPARENT,1.5)
const blue = new Material([0.2,0.73,1],10,OPAQUE)


const Textpixels = Texture('parkingLot')
const mil = getEnvColor(Textpixels,[1,1,1])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glClearColor(0.9,0.9,0.9)

 rtx.glColor(0,0,0)
 rtx.glClear()

rtx.envMap = Textpixels

rtx.lights.push(new AmbientLight())
rtx.lights.push(new DirectionalLight([-1,-1,-1],0.5))
//rtx.lights.push(new PointLight([3,0,0]))

//rtx.scena.push(new Sphere(1,[2.1,0,-10],redmirror))
rtx.scena.push(new Sphere(1,[-2,0,-10],blue))
rtx.scena.push(new Sphere(1,[0,0,-10],glass))
rtx.scena.push(new Sphere(1,[2,0,-10],blacmirror))
// rtx.scena.push(new Sphere(1,[0,2.1,-10],yellowmirror))
// rtx.scena.push(new Sphere(1,[0,-2.1,-10],greenmirror))



rtx.glRender()
rtx.glFinish('index')