import {Raytracer,color} from './gl.js'
import {Sphere,Material} from './figures.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights.js'
const OPAQUE = Bun.env.OPAQUE
const REFLECTIVE = Bun.env.REFLECTIVE
const TRANSPARENT = Bun.env.TRANSPARENT

const width = 1000
const height = 1000

//Materiales
const nouse = new Material([0.94,0.32,0.21],100)
const grass = new Material([0.3,1,0.3],16)
const blacmirror = new Material([0.9,0.9,0.9],16,REFLECTIVE)
const redmirror = new Material([0.9,0.2,0.2],16,REFLECTIVE)
const bluemirror = new Material([0.2,0.2,0.9],16,REFLECTIVE)
const greenmirror = new Material([0.2,0.9,0.2],16,REFLECTIVE)
const yellowmirror = new Material([0.9,0.9,0.2],16,REFLECTIVE)


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glClearColor(0.90,0.90,0.90)
rtx.glColor(1,1,1)
rtx.glClear()

rtx.lights.push(new AmbientLight(0.7))
rtx.lights.push(new DirectionalLight([-1,-1,-1]))
rtx.lights.push(new PointLight([3,0,0]))

rtx.scena.push(new Sphere(1,[2.1,0,-10],redmirror))
rtx.scena.push(new Sphere(1,[0,0,-10],blacmirror))
rtx.scena.push(new Sphere(1,[-2.1,0,-10],bluemirror))
rtx.scena.push(new Sphere(1,[0,2.1,-10],yellowmirror))
rtx.scena.push(new Sphere(1,[0,-2.1,-10],greenmirror))



rtx.glRender()
rtx.glFinish('index')