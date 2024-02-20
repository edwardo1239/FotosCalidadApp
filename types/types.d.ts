/* eslint-disable prettier/prettier */
export interface prediosType {
  _id: string;
  enf: string;
  predio:{PREDIO: string, _id:string} ;
  tipoFruta: 'Naranja' | 'Limon';
}

export type serverResponseLotesType = {
  status: number;
  message: string;
  data: prediosType[];
};

export type fotoData = {
  _id: string;
  foto: string;
  fotoName: string;
};


export type DataServer = {
    _id: string;
    fotoName: string;
    foto: string; // asumiendo que 'data' es una cadena en base64
  };