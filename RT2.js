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
const blacmirror = new Material([0.3,0.3,0.3],16,REFLECTIVE)
const yellowmirror = new Material([0.8,0.8,0.3],16,REFLECTIVE)
const blood = new Material([0.9,0.5,0.5],64,TRANSPARENT,1.3010)
const saphiro = new Material([0.0588,0.3215,0.73],150,TRANSPARENT,1.779)
const blue = new Material([0.2,0.73,1],10,OPAQUE)
const green = new Material([0,0.6039,0.09],10,OPAQUE)


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
rtx.scena.push(new Sphere(1,[-0,1.5,-10],blue))
rtx.scena.push(new Sphere(1,[-3,-1.5,-10],green))
rtx.scena.push(new Sphere(1,[-3,1.5,-10],blood))
rtx.scena.push(new Sphere(1,[3,-1.5,-10],saphiro))
rtx.scena.push(new Sphere(1,[3,1.5,-10],blacmirror))
rtx.scena.push(new Sphere(1,[0,-1.5,-10],yellowmirror))



rtx.glRender()
rtx.glFinish('RT2')