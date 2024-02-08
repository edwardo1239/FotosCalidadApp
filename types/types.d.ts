export interface prediosType {
    id: string;
    nombre: string;
    tipoFruta: 'Naranja'|'Limon'
}

export type serverResponseLotesType = {
    status:number
    data:prediosType[]
}

export type fotoData = {
    enf:string
    foto:string
    fotoName:string
}

