import {Raytracer,color} from './gl.js'
import {Sphere,Material} from './figures.js'
import {AmbientLight,DirectionalLight} from './lights'

const width = 3000
const height = 3000

//Materiales
const snow = new Material([0.65,0.65,0.6])
const butons = new Material([0.1,0.1,0.1])
const mouth = new Material([0.2,0.2,0.2])
const nouse = new Material([0.94,0.32,0.21])
const iris = new Material([0.8,0.8,0.8])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glColor(1,1,1)
rtx.glClear()

rtx.lights.push(new AmbientLight( 0.7))
rtx.lights.push(new DirectionalLight([-0.3,-1,-1],1,[1,1,1] ))

rtx.scena.push(new Sphere(1,[-1.5,0,-5],snow))
rtx.scena.push(new Sphere(0.7,[1,0,-5],snow))
rtx.scena.push(new Sphere(1,[0,0,-6],snow))

rtx.scena.push(new Sphere(0.2,[0,0,-5],butons))
rtx.scena.push(new Sphere(0.2,[-0.6,0,-4.4],butons))
rtx.scena.push(new Sphere(0.25,[-1.2,0,-4],butons))

rtx.scena.push(new Sphere(0.05,[0.5,0.10,-4],mouth))
rtx.scena.push(new Sphere(0.05,[0.5,-0.10,-4],mouth))
rtx.scena.push(new Sphere(0.05,[0.6,-0.25,-4],mouth))
rtx.scena.push(new Sphere(0.05,[0.6,0.25,-4],mouth))

rtx.scena.push(new Sphere(0.10,[0.8,0,-4.35],nouse))

rtx.scena.push(new Sphere(0.05,[0.5,0.10,-2],iris))
rtx.scena.push(new Sphere(0.05,[0.5,-0.10,-2],iris))

rtx.scena.push(new Sphere(0.025,[0.45,0.10,-1.75],mouth))
rtx.scena.push(new Sphere(0.025,[0.45,-0.07,-1.75],mouth))


rtx.glRender()
rtx.glFinish('RT1')