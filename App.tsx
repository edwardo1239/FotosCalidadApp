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
import {fotoData, prediosType, serverResponseLotesType} from './types/types';

const socket = io('ws://192.168.0.172:3003/');

function App(): JSX.Element {
  const [lotesList, setLotesList] = useState<prediosType[]>([
    {id: '', nombre: '', tipoFruta: 'Limon'},
  ]);

  //useEfect que hace la peticion al servidor cuando se inicia la app
  useEffect(() => {
    try {
      const request = {
        data: {action: 'obtenerLotesFotosCalidad', query: 'proceso'},
      };
      socket.emit(
        'calidad',
        request,
        (serverResponse: serverResponseLotesType) => {
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

  const [enf, setEnf] = useState<string>('');

  const obtenerEnf = (dato: string) => {
    setEnf(dato);
  };

  const guardarFoto = async (dataServer: fotoData): Promise<number> => {
    const request = {
      data: {action: 'guardarFotosCalidad', data: dataServer, query: 'proceso'},
    };
    const response: serverResponseLotesType = await new Promise(resolve => {
      socket.emit(
        'calidad',
        request,
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
      <Header obtenerEnf={obtenerEnf} lotesList={lotesList} />
      <Camara enf={enf} guardarFoto={guardarFoto} />
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
