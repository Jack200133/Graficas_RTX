import fs from 'fs'
import {Buffer } from 'node:buffer'
import {normal_V3} from './mathe.js'


const Texture = (filename) =>{
    const der = fs.readFileSync(`${filename}.bmp`)

    //console.log("A",data)
    //const headerSize = data.read(4)

    const dat = Buffer.from(der)

    //console.log("A ",headerSize)
    //this.data = data
    //console.log(dat)
    const headersize = dat.readUInt32LE(10)
    const width = dat.readUInt32LE(18)
    const height = dat.readUInt32LE(22)

    const pixels = []
    let byteIndex = headersize
    //console.log(byteIndex)
    for (let x = 0; x < height; x++) {
        const row = []
        for (let y = 0; y < width; y++) {
            const b = dat.readUInt8(byteIndex++)/255;
            const g = dat.readUInt8(byteIndex++)/255;
            const r = dat.readUInt8(byteIndex++)/255;
            row.push([r,g,b])
        }
        //console.log(x,height,row)
        pixels.push(row)
    }
    const dater= {pixels,width,headersize,height}
    return dater

}


const getEnvColor=(texture,dir)=>{

    const dir_norm = normal_V3(dir)
    const nrg = dir_norm[1]
    const x = parseInt((Math.atan2(dir_norm[2],dir_norm[0])/(2*Math.PI)+0.5)*texture.width)
    const y = parseInt(Math.acos(-nrg)/Math.PI*texture.height)
    return texture.pixels[y][x]
}

const getColor=(texture,u,v)=>{
    if(u>=0 && u<=1 && v>=0 && v<=1){
        const x = parseInt(u*texture.width)
        const y = parseInt(v*texture.height)
        return texture.pixels[y][x]
    }
    else{
        return null
    }
}



export {Texture,getEnvColor,getColor}