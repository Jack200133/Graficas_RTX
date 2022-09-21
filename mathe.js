

const productos_matrices =(a,b)=>{

    const filas_a = a.length
    const columnas_a = a[0].length
    const filas_b = b.length
    const columnas_b = b[0].length

    if(columnas_a!=filas_b){
        return null
    }
    const resultado = []
    for (var i = 0; i < columnas_b; i++) {
        resultado[i] = []
        
    }
    for (var c = 0; c < columnas_b; c++) {
        for (var i = 0; i < filas_a; i++) {
            let suma = 0 

            for (var j = 0; j < columnas_a; j++) {
        
                suma += a[i][j]*b[j][c]
            }
            resultado[i][c] = suma
        }
        
    }

    return resultado
}


const producto_matriz_vector = (a,b)=>{
    const filas_a = a.length
    const columnas_a = a[0].length

    if(columnas_a != b.length){
        return null
    }
    const producto = new Array()
    for (var i = 0; i < filas_a; i++) {
        let suma = 0
        for (var j = 0; j < columnas_a; j++) {
            suma += a[i][j]*b[j]
        
        }
        producto.push(suma)

    }
    return producto
}

const producto_vector_vector =(a,b) =>{
    if(a.length != b.length){
        return null
    }
    const producto = new Array()
    for (var i = 0; i < a.length; i++) {
        producto.push(a[i]*b[i])
    }
    return producto
}

const producto_cruz=(a,b)=>{
    return [a[1]*b[2]-a[2]*b[1],
            a[2]*b[0]-a[0]*b[2],
            a[0]*b[1]-a[1]*b[0]]
}

const mult_vect = (a,b) =>{
    
    const respuesta = []
    for (var i = 0; i < a.length; i++) {
        respuesta.push(a[i]*b)
    }
    return respuesta 
}

const resta_vectores = (a,b) =>{
    const respuesta = []
    for (var i = 0; i < a.length; i++) {
        respuesta.push(a[i]-b[i])
    }
    return respuesta
}

const suma_vec = (a,b) =>{
    const respuesta = []
    for (var i = 0; i < a.length; i++) {
        respuesta.push(a[i]+b[i])
    }
    return respuesta
}

const normal_V3 = (a) =>{
    try{
        const mag = Math.pow(a[0]**2+ a[1]**2 + a[2]**2,0.5)
        return[a[0]/mag,
               a[1]/mag,
               a[2]/mag,]
    }
    catch{
        return[0,0,0]
    }
}

const magnitud_V3 = (a) =>{
    return Math.pow(a[0]**2+ a[1]**2 + a[2]**2,0.5)
}

const producto_punto = (a,b) =>{
    return a[0]*b[0] +a[1]*b[1]+a[2]*b[2]
}

const inversa = (a) =>{
    const result = a.map(function(i){
        return -i
    })
    return result
}

const invert_matrix = (matrix) => {

    const n = matrix.length
    const inverted = []

    for (var i = 0; i < n; i++) {
        inverted.push([])
    }

    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (i != j){
                inverted[j][i] = -matrix[i][j]/matrix[i][i]
            }
            else{
                inverted[j][i] = 1
            }
        
        }
    }
    return inverted
}

const nx2n = (n_rows,n_columns)=>{
    const zero = []
    for (var i= 0; i < n_rows; i++) {
        zero.push([])
        for (var j = 0; j < 2*n_columns; j++) {
            zero[i].push(0)
        }
    }
    return zero
}

const update = (inputs,n_rows,n_columns,Zero)=>{
    for (var i = 0; i < n_rows; i++) {
        for (var j = 0; j < n_columns; j++) {
            Zero[i][j]= inputs[i][j]
            
        }
    }
    return Zero
}

const identity = (n_rows,n_columns,Matrix) =>{
    for (var i= 0; i < n_rows; i++) {
        for (var j = 0; j < n_columns; j++) {
            if(i ==j){
                Matrix[i][j+n_columns] = 1
            }
        }
    }
    return Matrix
}

const Gaussain_Jordan = (n_rows,n_columns,Matrix) =>{
    for (var i= 0; i < n_rows; i++) {
        if (Matrix[i][i] ===0){
            console.log("error no divisible entre 0")
        }
        for (var j = 0; j < n_columns; j++) {
            if (i != j){
                const ratio = Matrix[j][i]/Matrix[i][j]

                for (var k= 0; k < 2*n_columns; k++) {
                    Matrix[j][k] = Matrix[j][k] -ratio*Matrix[i][k]
                }
            }
        }
    }
    return Matrix
}

const row_op = (n_rows,n_columns,Matrix) =>{
    for (var i = 0; i < n_rows; i++) {
        const divide = Matrix[i][i]
        for (var j = 0; j < 2*n_columns; j++) {
            Matrix[i][j] = Matrix[i][j]/divide
        }
    }
    return Matrix
}

const getMatrixInverse = (matrix) =>{
    const result = []
    const num_rows = matrix.length
    const num_colomns = matrix[0].length
    const INVERSE_Matrix = (row_op(num_rows,num_colomns,
        Gaussain_Jordan(num_rows,num_colomns,
            identity(num_rows,num_colomns,
                update(matrix,num_rows,num_colomns,
                    nx2n(num_rows,num_colomns))))))
    
    for (var i= 0; i < num_rows; i++) {
        result.push([])
        for (var j= 0; j < num_colomns; j++) {
            result[i].push(INVERSE_Matrix[i][j])
        }
    }
    return result
}

const getReflect = (normal,direccion) =>{
    return normal_V3(resta_vectores(mult_vect(normal,2* producto_punto(normal,direccion)),direccion))
}

const refractVector = (normal,direccion,ior) =>{
    //Snells Law
    let cosi = Math.max(-1,Math.min(1,producto_punto(direccion,normal)))
    let non = normal
    let etai = 1
    let etat = ior
    //console.log(cosi,etai,etat)
    if (cosi < 0){
        cosi = -cosi 
    }else{
        etai,etat = etat,etai
        non= inversa(normal)
    }
    //console.log('w',cosi,etai,etat)
    const eta = etai/etat
    const k = 1 - (eta **2) * (1- (cosi **2))
    if (k < 0){
        // Total Internal Reflection
        return null
    }
    const refractvect = suma_vec(mult_vect(direccion,eta),mult_vect(non,eta*cosi-(k**0.5)))
    return refractvect
}

const Fresnel = (normal,direccion,ior) =>{
    //Fresnel Equation
    let cosi = Math.max(-1,Math.min(1,producto_punto(direccion,normal)))
    const non = []
    let etai = 1
    let etat = ior
    const etai2 = 1
    const etat2 = ior

    
    if (cosi < 0){
        cosi = -cosi
    }else{
        etai = etat2
        etat = etai2

    }

    const sint = etai/etat * (Math.max(0,1-cosi**2)**0.5)

    if (sint >=1){
        return null
    }

    const cost =Math.max(0,1-sint**2)**0.5
    cosi = Math.max(cosi)

    const Rs = ((etat * cosi) - (etai*cost))/((etat *cosi) + (etai*cost))
    const Rp = ((etai * cosi) - (etat*cost))/((etai *cosi) + (etat*cost))

    return (Rs**2 + Rp**2)
}

export {refractVector,Fresnel,getReflect,producto_vector_vector,mult_vect,suma_vec,magnitud_V3,getMatrixInverse,invert_matrix,inversa,producto_punto,normal_V3,resta_vectores,productos_matrices,producto_matriz_vector,producto_cruz}