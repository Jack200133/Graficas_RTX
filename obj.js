import fs from 'fs'

class Obj{
    constructor(filename){
        this.data= fs.readFileSync(`${filename}.obj`)
        this.vertices =[]
        this.faces = []
        this.normals = []
        this.texcoords = []

        const lines = this.data.toString().split('\r')

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            const parts = line.split(' ')
            const type = parts[0]
            if(type === 'v'){
                this.vertices.push(parts.slice(1).map(Number))
            }
            else if(type === 'vn'){
                this.normals.push(parts.slice(1).map(Number))
            }
            else if(type === 'vt'){
                this.texcoords.push(parts.slice(1).map(Number))
            }
            else if(type === 'f'){
                const face = []
                for (let j = 1; j < parts.length; j++) {
                    const part = parts[j]
                    const indices = part.split('/').map(Number)
                    face.push(indices)
                }
                this.faces.push(face)
            }
        }
        
    }

}

export {Obj}