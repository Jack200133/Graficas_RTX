import fs from 'fs'
import {Buffer } from 'node:buffer'


class Texture{
    constructor(filename){
        //MIN 1:21
        this.filename = filename
        this.getalgo()

    }

    getfile(filename){
        fs.readFile(`${filename}.bmp`,function(error,data){
            //console.log("A",data)
            //const headerSize = data.read(4)

            const dat = Buffer.from(data)

            //console.log("A ",headerSize)
            //this.data = data
            //console.log(dat)
            const headersize = dat.readUInt32LE(10)
            this.width = dat.readUInt32LE(18)
            this.height = dat.readUInt32LE(22)

            this.pixels = []
            let byteIndex = headersize
            for (let x = 0; x < this.width; x++) {
                const row = []
                for (let y = 0; y < this.height; y++) {
                    const b = dat.readUInt8(byteIndex++)/255;
                    const g = dat.readUInt8(byteIndex++)/255;
                    const r = dat.readUInt8(byteIndex++)/255;
                    row.push([r,g,b])
               }
               
               this.pixels.push(row)
            }
            console.log('CONS',this.width,this.height)

        }) 
    }

    async getalgo(){
       const  t = await this.getfile(this.filename)
       console.log(this.width)
    }

}

const Text = new Texture('parkingLot')
console.log('E',Text.width,Text.height)