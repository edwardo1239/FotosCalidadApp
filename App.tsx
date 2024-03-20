/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';

import {Alert, SafeAreaView, StyleSheet} from 'react-native';
import Header from './src/Header';
import Camara from './src/Camara';
import Footer from './src/Footer';
import {io} from 'socket.io-client';
import {DataServer, prediosType, serverResponseLotesType} from './types/types';

const socket = io('ws://192.168.0.172:3002/');

function App(): JSX.Element {
  const [lotesList, setLotesList] = useState<prediosType[]>([
    {_id: '', predio: {PREDIO: '', _id: ''}, tipoFruta: 'Limon', enf: ''},
  ]);

  //useEfect que hace la peticion al servidor cuando se inicia la app
  useEffect(() => {
    try {
      const request = {
        data: {
          query: {
            'calidad.fotosCalidad': {$exists: false},
            enf: {$regex: '^E', $options: 'i'},
          },
          select: {enf: 1},
          populate: {
            path: 'predio',
            select: 'PREDIO ICA',
          },
          sort: {fechaIngreso: -1},
        },
        collection: 'lotes',
        action: 'getLotes',
        query: 'proceso',
      };
      socket.emit(
        'fotosCalidad',
        {data: request},
        (serverResponse: serverResponseLotesType) => {
          console.log(serverResponse);
          if (serverResponse.status === 200) {
            setLotesList(serverResponse.data);
          } else {
            Alert.alert('error al caragar los lotes');
          }
        },
      );
    } catch (e: any) {
      return Alert.alert(`${e.name}:${e.message}`);
    }
  }, []);

  const [id, setId] = useState<string>('');

  const obtenerId = (dato: string) => {
    setId(dato);
  };

  const guardarFoto = async (data: DataServer): Promise<number> => {
    const request: any = {
      query: 'proceso',
      collection: 'lotes',
      action: 'putLote',
      record: 'ingresoFotoCalidad',
      data: data,
    };

    const response: serverResponseLotesType = await new Promise(resolve => {
      socket.emit(
        'fotosCalidad',
        {data: request},
        (serverResponse: serverResponseLotesType) => {
          resolve(serverResponse);
          console.log(serverResponse);
        },
      );
    });
    if (response.status !== 200) {
      return 400;
    }
    console.log(response);
    return response.status;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header obtenerId={obtenerId} lotesList={lotesList} />
      <Camara id={id} guardarFoto={guardarFoto} />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
