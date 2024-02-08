import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
  Alert
} from 'react-native';
import { prediosType, serverResponseLotesType } from '../types/types';

type propsType = {
    obtenerEnf: (data:string) => void
    lotesList: prediosType[]
}


export default function Header(props:propsType) {
    const [lote, setLote] = useState<string>('Seleccionar Lote')
    const [modalVisible, setModalVisible] = useState<boolean>(false)

  return (
     <View style={styles.container}>
      <View >
        <Image
          source={require('../assets/CELIFRUT.png')}
          style={styles.image}
        />
      </View>

      <TouchableOpacity style={styles.botonLotes}
      onPress={() => setModalVisible(true)}>
        <Text>{lote}</Text>
      </TouchableOpacity>

      <Modal 
      transparent={true}
      visible={modalVisible}
      animationType="fade"
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
        <View style={styles.centerModal}>
          <View style={styles.viewModal}>

          <FlatList
                data={props.lotesList}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                  style={styles.pressableStyle}
                  onPress={() => {
                    setLote(item.id +"--"+ item.nombre)
                    setModalVisible(false)
                    props.obtenerEnf(item.id)
                    }}>
                  <Text style={styles.textList}>{item.id} -- {item.nombre}</Text>
                  </TouchableOpacity>)}
               
              />
          </View>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    top: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 80,

    paddingRight: 10,
  },

  image: {
    width: 50,
    height: 50,
  },
  botonLotes: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    marginLeft: '5%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7D9F3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerModal:{
    flex: 1,
    alignItems: 'center',
    marginTop:'18%'
  },
    viewModal:{
      backgroundColor: 'white',
      width: '90%',
      flexDirection: 'row',
      borderRadius: 20,
      alignItems:'center',
      paddingBottom: 20,
      paddingTop:10
    },
    textList:{
      color: 'black',
      marginLeft:10,
      marginRight: 15,
      fontSize: 18
    },
    pressableStyle:{
      marginTop: 10,
      marginBottom: 10,
    
    }
});