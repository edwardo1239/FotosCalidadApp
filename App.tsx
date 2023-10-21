/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';
import Header from './src/Header';
import Camara from './src/Camara';
import Footer from './src/Footer';

function App(): JSX.Element {

  const [enf, setEnf] = useState<string>('');

  const obtenerEnf = (dato:string) => {
    setEnf(dato)
  }


  return (
    <SafeAreaView style={styles.container}>
      <Header obtenerEnf={obtenerEnf} />
      <Camara enf={enf}/>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
});

export default App;
