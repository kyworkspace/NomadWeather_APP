import moment from 'moment';
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
  Platform,
  ActivityIndicator
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';

const {height,width:SCREEN_WIDTH} = Dimensions.get('window')

const API_KEY = 'API_KEYS';

const App = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(false);
  const [timeZone, setTimeZone] = useState('Loading...')

  const ask = async() =>{
    if(!location){
      Geolocation.getCurrentPosition((position)=>{
        setLocation(position);
        getWeather(position.coords.latitude,position.coords.longitude)
        setOk(true);
      },
      (error)=>{
        console.log(error)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
    }
  }

  const getWeather=async(lat, lon)=>{
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await result.json();
    setTimeZone(json.timezone);
    setDays(json.daily)
  }

  const requestPermission = async ()=>{
    if(Platform.OS === 'android'){
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ])
      .then((result)=>{
        if(result['android.permission.ACCESS_FINE_LOCATION'] && result['android.permission.ACCESS_COARSE_LOCATION'] ==='granted'){
          ask();
        }else{
          setErrorMsg('위치 접근 권한이 없습니다.');
          alert('위치 접근 권한이 없습니다.')
          setOk(false)
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
        <Text style={styles.cityName}>{timeZone.toUpperCase()}</Text>
      </View>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}

        >
        {days.length === 0 ?
          <View style={styles.day}>
            <ActivityIndicator size={'large'} color={'white'} />
          </View>
          : days.map((item, idx) => {
            const date = moment(item.dt*1000);
            return (
              <View style={styles.day} key={idx}>
                <Text>{`${date.month()+1}월 ${date.date()}일`}</Text>
                <Text style={styles.temp}>{parseFloat(item.temp.day).toFixed(1)}</Text>
                <Text style={styles.description}>{item.weather[0].main}</Text>
                <Text style={styles.tinyText}>{item.weather[0].description}</Text>
              </View>
            )
          })}
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
  },
  tinyText:{
    fontSize:20
  }

})

export default App;
