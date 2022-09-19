import {Raytracer,color} from './gl.js'
import {Sphere,Material} from './figures.js'
import {AmbientLight,DirectionalLight,PointLight} from './lights'

const width = 4000
const height = 4000

//Materiales
const snow = new Material([0.65,0.65,0.6])
const butons = new Material([0.1,0.1,0.1])
const mouth = new Material([0.2,0.2,0.2])
const nouse = new Material([0.94,0.32,0.21],100)
const iris = new Material([0.8,0.8,0.8])


const rtx = new Raytracer()
rtx.glCreateWindow(width,height)
rtx.glClearColor(0.11,0.17,0.33)
rtx.glColor(1,1,1)
rtx.glClear()

rtx.lights.push(new AmbientLight(0.7 ))
rtx.lights.push(new DirectionalLight([-1,-1,-1]))
//rtx.lights.push(new PointLight([-10,-10,-10]))

rtx.scena.push(new Sphere(2,[2,0,-10],nouse))
rtx.scena.push(new Sphere(2,[-2,0,-10],butons))



rtx.glRender()
rtx.glFinish('index')