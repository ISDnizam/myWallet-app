import React from 'react';
import FaIcon from '@expo/vector-icons/FontAwesome';
import { mainColor }  from '../components/GlobalFunction';
import GlobalSetting from './GlobalSetting';
import {NetInfo, Alert, BackHandler, Platform,AsyncStorage,FlatList, ScrollView, Dimensions,ActivityIndicator, Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  if(props.action=='AddTx'){
    return (
      <FaIcon
        name={props.name} 
        size={props.size}
        style={{ marginBottom: -3 }}
        color={GlobalSetting.mainColor}
      />
    );
  }else{
  return (
    <View style={{justifyContent:'center',alignItems: 'center',}}>    
      <FaIcon
      name={props.name} 
      size={18}
      color={props.focused ? GlobalSetting.mainColor : Colors.tabIconDefault}
    />
    <Text style={{fontSize:11,textAlign:'center',color:props.focused ? GlobalSetting.mainColor : Colors.tabIconDefault}}>{props.label}</Text>
    </View>

  );
  }
}