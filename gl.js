import fs from 'fs'
import {refractVector,Fresnel,getReflect,mult_vect,producto_vector_vector,suma_vec,producto_punto,normal_V3,invert_matrix,inversa, resta_vectores} from './mathe.js'
import {getEnvColor} from './texture.js'

const OPAQUE = 0
const REFLECTIVE = 1
const TRANSPARENT = 2
const MAX_RECURSION_DEPH =3

const color = (r,g,b) =>{
  return [parseInt(b*255),parseInt(g*255),parseInt(r*255)]
}

const barycentric_coordinates=(A,B,C,P)=>{
  const areaABC = (B[1] - C[1])*(A[0]-C[0]) + (C[0]-B[0])*(A[1]-C[1])
  const areaPBC = (B[1]-C[1])*(P[0]-C[0]) + (C[0]-B[0])*(P[1]-C[1])
  const areaPAC = (C[1]-A[1])*(P[0]-A[0]) + (A[0]-C[0])*(P[1]-A[1])

  try{
    const u = areaPBC / areaABC
    // PAC / ABC
    const v = areaPAC / areaABC
    // 1 - u - v
    const w = 1 - u - v
  }catch{
    return -1,-1,-1
  }
  return u,v,w

}

class Raytracer {
  constructor() {
    this.width = 4;
    this.height = 4;
    this.fov = 60
    this.camPos = [0,0,0]
    this.scena = []
    this.lights = []
    this.envMap = null
    this.nearPlane = 0.1
    this.glViewPort(0,0,4,4)
    this.clearColor = color(0,0,0)
    this.currentColor = color(1,1,1)
    this.glClear()
    
  }

  glCreateWindow(width, height){
    this.width = width;
    this.height = height;
    
    this.glViewPort(0,0,width,height)
  }

  glViewPort(x,y,width,height){
    this.mx_width = (x+width)
    this.mx_height =  (y+height)
    this.min_width =x
    this.min_height =y
  }

  glColor(r,g,b){
    this.currentColor = color(r,g,b)
  }

  glClear(){
    this.pixels = []
    //this.pixels=new Array(this.width).fill(new Array(this.height).fill(this.clearColor))
    for(var i=0;i<=this.width;i++){
      this.pixels[i]=[]
      for(var j=0;j<=this.height;j++){

        this.pixels[i][j]=this.clearColor
      }
    }
  }

  glClearVP(){
    this.pixels = []
    //this.pixels=new Array(this.width).fill(new Array(this.height).fill(this.clearColor))
    for(var i=this.min_width;i<=this.mx_width+1;i++){
      this.pixels[i]=[]
      for(var j=this.min_height;j<=this.mx_height+1;j++){

        this.pixels[i][j]=this.clearColor
      }
    }
  }

  
  glClearColor(r,g,b){
    this.clearColor = color(r,g,b)
  }

  glPoint(x,y,crl=null){
    //console.log(x,y,crl)
    if((this.min_width<=y<=this.mx_width)&&(this.min_height<=x<=this.mx_height)){
      if(crl!==null){
        this.pixels[y][x] = crl
      }else{

        this.pixels[y][x] = this.currentColor
      }
      
    }
  }
  glscene_intersect(origen,direccion,sceneObj){
    let res = null
    let minor = Infinity
    const intersect = this.scena.map(function(obj){
      const hit = obj.ray_intersect(origen,direccion)
      if(hit !== null){
        if(sceneObj != hit.sceneOBJ){
          if (hit.distancia < minor){
            res = hit
            minor = hit.distancia
          }
        }
      }
    })
    return res
  }
  
  ray_cast(origen,direccion,sceneOBJ = null, recursion = 0){
    
    const inter = this.glscene_intersect(origen,direccion,sceneOBJ)
  
    if (inter === null || recursion >= MAX_RECURSION_DEPH){
      //console.log(this.clearColor)
      if (this.envMap){
        //console.log(getEnvColor(this.envMap,direccion),direccion)
        return getEnvColor(this.envMap,direccion)
      }else{
        
        return [this.clearColor[2]/255,
        this.clearColor[1]/255,
        this.clearColor[0]/255]
      }

    }
    const mat = inter.sceneOBJ.material
      
    let finalColor = [0,0,0]
    const objColor = [...mat.diffuse]

    if (mat.matType === OPAQUE){
      
      this.lights.forEach(ligt => {
        const diffuse = ligt.getDiffuseColor(inter,this)
        const specColor = ligt.getSpecColor(inter,this)
        const shadow = ligt.getShadowIntensity(inter,this)

        const eleColor = mult_vect(suma_vec(diffuse,specColor),(1-shadow))

        //finalColor = suma_vec(finalColor,ligt.getColor(inter,this))
        finalColor = suma_vec(finalColor,eleColor)
  
      })
    }else if(mat.matType === REFLECTIVE){
      
      const ref = getReflect(inter.normal,inversa(direccion))
      const refC = this.ray_cast(inter.punto,ref,inter.sceneOBJ,(recursion+1))

      let specColor = [0,0,0]

      this.lights.forEach(ligt => {
        specColor = suma_vec(specColor,ligt.getSpecColor(inter,this))
      })
      finalColor = suma_vec(refC,specColor)

      //console.log("REFC ",refC)
      //finalColor = refC
    }else if(mat.matType === TRANSPARENT){
      const outsideray = producto_punto(direccion,inter.normal)<0
      const bias = mult_vect(inter.normal,0.001)
      const ref = getReflect(inter.normal,inversa(direccion))
      //console.log(outsideray,bias,ref)
      const refOrigin =outsideray?suma_vec(inter.punto,bias):resta_vectores(inter.punto,bias)
      
      const refC = this.ray_cast(refOrigin,ref,null,(recursion+1))
      const kr = Fresnel(inter.normal,direccion,mat.ior)
      //console.log(refC,kr)
      let specColor = [0,0,0]
      let refracColor = [0,0,0]
      this.lights.forEach(ligt => {
        specColor = suma_vec(specColor,ligt.getSpecColor(inter,this))
      })
      if (kr <1){
        //Calcular refraccion

        const refract = refractVector(inter.normal,direccion,mat.ior)
        const refractOrg = outsideray? suma_vec(inter.punto,bias):resta_vectores(inter.punto,bias)
        refracColor = this.ray_cast(refractOrg,refract,null,recursion+1)
      }

      finalColor =suma_vec(suma_vec(mult_vect(refC,kr),mult_vect(refracColor,(1-kr))),specColor)
    }

    finalColor = producto_vector_vector(finalColor,objColor)
    //console.log('final',finalColor)
      
    const r = Math.min(1,finalColor[0])
    const g = Math.min(1,finalColor[1])
    const b = Math.min(1,finalColor[2])
    finalColor[0] = r
    finalColor[1] = g
    finalColor[2] = b
    return (finalColor)

    //return inter.sceneOBJ.material.diffuse

  }

  glRender(){
    //Proyeccion
    const t = Math.tan((this.fov * Math.PI/180)/2)*this.nearPlane
    const r = t* this.mx_width/this.mx_height
    //console.log(t,r)
    for (var x = this.min_width; x < this.mx_width+1; x++) {
      for (var y = this.min_height; y < this.mx_height+1; y++) {
        // Pasar de coordenadas de ventana a coordenadas 
        // NDC (-1 a 1)
        const Px = (((x+0.5-this.min_width)/(this.mx_width-this.min_width)) *2 -1) *r
        const Py = (((y+0.5-this.min_height)/(this.mx_height-this.min_height)) *2 -1)*t
        const direction = normal_V3([Px,Py,-this.nearPlane])
        //console.log(Px,Py,direction)
        const rayC = this.ray_cast(this.camPos,direction)
        //console.log('RAC',rayC)
        if (rayC !== null){
          this.glPoint(x,y,color(...rayC))
        }

     }
    }
  }

  glPoint_VP(ndcx, ndcy,crl=null){
    console.log("SSZ",ndcx,ndcy,crl)

    const x = (ndcx+1) * ((this.mx_width-this.min_width)/2)+ this.min_width
    const y = (ndcy+1) * ((this.mx_height-this.min_height)/2)+ this.min_height
  
    const fx= Math.round(x)
    const fy= Math.round(y)
    console.log("FX",fx,fy)
    if(crl){

      this.glPoint(fx,fy,crl)
    }else{

      this.glPoint(fx,fy)
    }
  }

  glLine(x1,y1,x2,y2,crl=null){
    const dx = x2-x1;
    const dy = y2-y1;
    const d = Math.abs(dx)>Math.abs(dy)?Math.abs(dx):Math.abs(dy);
    const sx = dx/d;
    const sy = dy/d;
    let x = x1;
    let y = y1;
    for(let i=0;i<d;i++){
      this.glPoint(parseInt(y),parseInt(x),crl)
      x+=sx;
      y+=sy;
    }
  }

  boundaries(x,y,poly){
    const num = poly.length
    let j = num -1
    let c = false

    for (let i = 0; i < num; i++) {
      if(x===poly[i][0] && y===poly[i][1]){
        return true
      }   
      
      if((poly[i][1]>y != (poly[j][1]>y))){
        const slope = (x-poly[i][0])*(poly[j][1]-poly[i][1]) - (poly[j][0]-poly[i][0])*(y-poly[i][1])
        if(slope === 0){
          return true
        }
        if((slope < 0)!= (poly[j][1]<poly[i][1])){
          c = !c
        } 
      }
      j = i
    }
    return c
  }

  glFill(poly,clr=null){
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        if (this.boundaries(i,j,poly)){
          this.glPoint(j,i,clr)
        }
      }
      
    }
  }

  glFinish(filename){
    const buffer = Buffer.alloc(14+40+(this.width*this.height*3));
    // A bitmap file starts with a "BM" in ASCII.
    buffer.write("B", 0);
    buffer.write("M", 1);
    // The entire filesize.
    buffer.writeUInt32LE(14+40+(this.width*this.height*3), 2);
    // 4 bytes reserved for the application creating the image.
    buffer.writeUInt32LE(0, 6);
    // The byte offset to access the pixel data.
    buffer.writeUInt32LE(14+40, 10);

    // The size of the header.
    buffer.writeUInt32LE(40, 14);
    // The width and height of the bitmap image.
    buffer.writeUInt32LE(this.width, 18);
    buffer.writeUInt32LE(this.height, 22);
    // The number of color planes, which in bitmap files is always 1
    buffer.writeUInt16LE(1, 26);
    buffer.writeUInt16LE(24, 28);

    // Compression method, not supported in this package.
    buffer.writeUInt32LE(0, 30);
    buffer.writeUInt32LE((this.height*this.width*3), 34);
    // Number of colors in the palette.
    buffer.writeUInt32LE(0, 38);
    // Number of important colors used.
    buffer.writeUInt32LE(0, 42);
    buffer.writeUInt32LE(0, 46);
    buffer.writeUInt32LE(0, 50);

    let byteIndex = 54
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        buffer.writeUInt8(this.pixels[x][y][0], byteIndex++);
        buffer.writeUInt8(this.pixels[x][y][1], byteIndex++);
        buffer.writeUInt8(this.pixels[x][y][2], byteIndex++);

     }
    }
 
    fs.writeFile(`${filename}.bmp`,buffer,(error)=>{
        if(error) {
            console.error(error)
        }
    })
  }



}
export {Raytracer,color}