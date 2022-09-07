import {getMatrixInverse,invert_matrix,normal_V3,resta_vectores,productos_matrices,producto_matriz_vector,producto_cruz} from './mathe.js'

const a = [[1,0,2],[0,1,0],[2,0,1]]
const b = [3,2,1]

const resultado = invert_matrix(a)
console.log(resultado)
const al = getMatrixInverse(a)
console.log(al)