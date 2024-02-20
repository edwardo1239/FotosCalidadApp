/* eslint-disable prettier/prettier */
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import {DataServer, fotoData} from '../types/types';
import {AppState} from 'react-native';

type propsType = {
  id: string;
  guardarFoto: (data: fotoData) => Promise<number>;
};



export default function Camara(props: propsType): JSX.Element {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [imageSource, setImageSource] = useState<string>('');
  const [nomnbreFoto, setNombreFoto] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [mensajeError, setMensajeError] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    async function getPermission() {
      await Camera.requestCameraPermission();
      //console.log(`Camera permission status: ${permission}`);
    }
    getPermission();
  }, []);

  const appState = useRef(AppState.currentState);
  const [, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|backgorund/) && nextAppState === 'active')
      {
        console.log('app has come to the foreground');
        //setShowCamera(false)
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('appState', appState.current);
      restartCamera();
    });
    return () => {
      subscription.remove();
    };
  }, []);


  const capturarFoto = async () => {
    if (camera.current !== null) {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'speed',
      });

      setImageSource(photo.path);
      setShowCamera(false);
      console.log(imageSource);
    }
  };

  const sendImage = async () => {
    try {
      if (props.id !== '') {
        if (nomnbreFoto !== '') {
          setLoader(true);
          setModalVisible(true);
          var data = await RNFS.readFile(`file://'${imageSource}`, 'base64');

          // const response = await fetch(
          //   'https://script.google.com/macros/s/AKfycbz5RrynHcCWvDCvl1NUvqqj3pgxCNSV2nUZamkeeM-8DY_egQmhhS7dvlY5aen-wp7h/exec',
          //   {
          //     method: 'POST',
          //     body: JSON.stringify({
          //       action: 'guardarFoto',
          //       foto: data,
          //       name: nomnbreFoto,
          //       enf: props.enf,
          //     }),
          //     headers: {
          //       'Content-type': 'application/json; charset=UTF-8',
          //     },
          //   },
          // );
          // const dataR = await response.json();

          // let dataServer = {
          //   enf: props.enf,
          //   fotoID: dataR.fotoID,
          //   fotoName: dataR.nombreFoto,
          // };

          let dataServer: DataServer = {
            _id:props.id,
            fotoName:nomnbreFoto,
            foto:data,
          };

          const server = await props.guardarFoto(dataServer);
          console.log(server);
          if (server === 200) {
            Alert.alert('Guardado con exito');
          } else {
            Alert.alert('Error al guardar');
          }

          setLoader(false);
          setModalVisible(false);
          setNombreFoto('');
          //setMensajeError('Foto guardada con exito');
          setShowCamera(true);
          return 0;
        } else {
          setLoader(false);
          setMensajeError('Ingrese una descripcion de la foto');
          setModalVisible(true);
        }
      } else {
        setLoader(false);
        setMensajeError('Seleccione un lote de la lista de informes');
        setModalVisible(true);
      }
    } catch (e: any) {
      setLoader(false);
      setMensajeError(`${e.name}: ${e.message}`);
      setModalVisible(true);
    }
  };

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  const restartCamera = () => {
    setKey(Math.random());
  };

  //   const saveIcon = <Icon name="share-apple" size={30} color="#fff" />;
  //   const deleteIcon = <Icon name="trash" size={30} color="#FF4000" />;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {loader === true ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : (
              <>
                <Text style={styles.modalText}>{mensajeError}</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Cerrar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
      {showCamera ? (
        <>
          <Camera
            key={key}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={showCamera}
            ref={camera}
            photo={true}
            enableDepthData
            orientation="portrait"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.camButton} onPress={capturarFoto} />
          </View>
        </>
      ) : (
        <>
          {imageSource !== '' ? (
            <Image
              style={styles.image}
              source={{
                uri: `file://'${imageSource}`,
              }}
            />
          ) : null}

          <View style={styles.backButton} />
          <View style={styles.buttonContainer}>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#9E3C29',
                }}
                onPress={() => setShowCamera(true)}>
                <Text style={{color: '#9E3C29', fontWeight: '500'}}>
                  delete
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                onChangeText={text => setNombreFoto(text)} />
              <TouchableOpacity
                onPress={sendImage}
                style={{
                  backgroundColor: '#9E3C29',
                  padding: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: 'white',
                }}>
                <Text style={{color: 'white', fontWeight: '500'}}>save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    elevation: 0,
  },

  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 0,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    //ADD backgroundColor COLOR GREY
    backgroundColor: '#49659E',

    alignSelf: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 10 / 16,
  },
  textInput: {
    backgroundColor: '#9E9331',
    borderRadius: 10,
    width: 150,
    color: 'white',
    borderWidth: 2,
    borderColor: '#9E3C29',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'gray',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
