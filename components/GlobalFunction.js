import * as React from 'react';
import { Header, Badge, Icon, withBadge, Tile, Avatar, ListItem, Button  } from 'react-native-elements';
// import { TextLoader, DotsLoader } from 'react-native-indicator';
import { Alert, Platform,AsyncStorage,FlatList, ScrollView, Dimensions,ActivityIndicator, Image, StatusBar, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import GlobalSetting from './GlobalSetting';
import { translate } from 'react-native-translate';



export function currencyFormat(num,operator) {
  var num = parseInt(num);
    if(operator=='+'){
      return  num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }else{
      return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
}


export function  _retrieveData ()  {
    // AsyncStorage.getItem('mainColor', (error, result) => {
    //     console.log(result);
    //     if (result) {
    //     return result;
    //     }else{
    //         return 'red';
    //     }
    // });

   
  }

  export function setMainColor(color) {
    mainColor(color);

}

export  function CustomAlertView(title) {
  return (
    <View  style={{alignItems:'center', alignContent:'center',textAlign:'center'}}>
    <Image source={require('../assets/images/user_info.png')} style={{height:200,width:200, marginBottom:20}}/>  
    <Text  style={{   color:'#545454',fontSize:12, fontWeight:'normal',textAlign:'center'}}>{  translate(title) } </Text>
  </View>
  );

}
  export function mainColor(color) {
      if(color){
        return color;
      }else{
        return GlobalSetting.mainColor;

      }
}

export function dayCondition() {
  date = new Date(); 
  hour = date.getHours(); 
  if (hour < 4) {
    var condition = 'Good Night,';
  }else if (hour < 11) {
    var condition = 'Good Morning,';
  }else if (hour < 15) {
    var condition = 'Good Afternoon,';
  }else if (hour < 18) {
    var condition = 'Good Afternoon';
  }else{
    var condition = 'Good Night,';
  } 
    return condition;
}

// export function LoaderScreen() {
//   return (
//     <View style={{flex: 1, padding: 30, marginTop:200,alignItems:'center', alignContent:'center'}}>
//       <DotsLoader color='#25646d' size={15} betweenSpace={15} />
//     </View>
//   );
// }
