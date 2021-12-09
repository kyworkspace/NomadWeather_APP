import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Dimensions,
  View,
  PermissionsAndroid,
  Platform
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

const {height,width:SCREEN_WIDTH} = Dimensions.get('window')










const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  const ask = async() =>{
    if(!location){
      Geolocation.getCurrentPosition((position)=>{
        console.log(position)
      },
      (error)=>{
        console.log(error)
        const {code} = error;
        if(code === 1){
          setErrorMsg('위치 접근 권한이 없습니다.');
          alert('위치 접근 권한이 없습니다.')
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
    }
  }

  const requestPermission = async ()=>{
    if(Platform.OS === 'android'){
      console.log('안드로이드');
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ])
      .then((result)=>{
        console.log('result',result)
        if(result['PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION'] ==='granted'){
          console.log('카메라')
        }
      })
    }
  }

  useEffect(() => {
    requestPermission();
    // ask();
  }, [])
  

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar color={'tomato'} hidden={false} />
      <View style={styles.city}>
        <Text style={styles.cityName}>서울</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}

        >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 68,
    fontWeight: '600',
  },
  weather: {
  },
  day : {
    alignItems:'center',
    width:SCREEN_WIDTH,
  },
  temp:{
    fontSize : 168,
    marginTop:50
    
  },
  description:{
    fontSize:60,
    marginTop:-30
  }

})

export default App;
