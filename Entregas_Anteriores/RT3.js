import {Raytracer,color} from './gl.js'
import {Sphere,Material,Plane,AABB} from './figures.js'
import {Texture,getEnvColor} from './texture.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights.js'


const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
const width = 2560
const height =2560
//Materiales
const blacmirror = new Material([0.3,0.3,0.3],16,REFLECTIVE)
const yellowmirror = new Material([0.8,0.8,0.3],16,REFLECTIVE)
const blood = new Material([0.9,0.5,0.5],64,TRANSPARENT,1.3010)
const saphiro = new Material([0.3588,0.6215,0.8],150,TRANSPARENT,1.779)
const blue = new Material([0.2,0.73,1],10,OPAQUE)
const green = new Material([0.2,0.9,0.2],10,OPAQUE)
const red = new Material([0.9,0.2,0.2],10,OPAQUE)
const yellow = new Material([0.8,0.8,0.2],10,OPAQUE)

//const Textpixels = Texture('playa')
//const mil = getEnvColor(Textpixels,[1,1,1])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glClearColor(0.9,0.9,0.9)

 rtx.glColor(0,0,0)
 rtx.glClear()

//rtx.envMap = Textpixels

rtx.lights.push(new AmbientLight())
//rtx.lights.push(new DirectionalLight([0,-0.1,-1],0.5))
rtx.lights.push(new PointLight([0,0,0],[1,1,1],0.5))

//rtx.scena.push(new Sphere(1,[2.1,0,-10],redmirror))
//rtx.scena.push(new Sphere(1,[-0,0,-10],blood))
//rtx.scena.push(new Sphere(1,[-3,-1.5,-10],blood))
rtx.scena.push(new AABB([5,1,-20],[5,5,5],yellow))
rtx.scena.push(new AABB([-5,1,-20],[5,5,5],blacmirror))
//rtx.scena.push(new AABB([0,0,20],[5,5,5],blue))
// rtx.scena.push(new Sphere(1,[-3,1.5,-10],blood))
// rtx.scena.push(new Sphere(1,[3,-1.5,-10],saphiro))
// rtx.scena.push(new Sphere(1,[3,1.5,-10],blacmirror))
// rtx.scena.push(new Sphere(1,[0,-1.5,-10],yellowmirror))

// rtx.scena.push(new Plane([0,1,0],[-10,10,0],green))
// rtx.scena.push(new Plane([1,0,0],[20,0,0],blue))

//rtx.scena.push(new Plane([1,0,0],[-10,4,-30],green))
rtx.scena.push(new Plane([0,1,0],[-1,-4,-10],blue))
rtx.scena.push(new Plane([0,-1,0],[-1,7,-20],red))
rtx.scena.push(new Plane([0,0,1],[0,0,-100],blue))
rtx.scena.push(new Plane([1,0,0],[-10,0,-20],green))
rtx.scena.push(new Plane([-1,0,0],[10,0,-20],green))
// rtx.scena.push(new Plane([0,0,1],[0,0,-20],yellow))


//new Plane([-1,0,0],-posicion[0]+size[0]/2,material),


//rtx.scena.push(new Plane([-1,-1,-1],[1.5,3,-1.5],blacmirror))

rtx.glRender()
rtx.glFinish('RT3')