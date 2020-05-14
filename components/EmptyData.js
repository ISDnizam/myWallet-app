import React from 'react'
import { Image, StyleSheet, View,Text } from 'react-native'
import { translate } from 'react-native-translate';

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
  },
  headerText: {
    marginVertical: 5,
  },
  contentText: {

  },
})

const EmptyNotification = ({string,type}) => (
    <View style={{marginTop:0,flexDirection: 'row'}}>
          <View style={{flex:1, flexDirectio:'row'}}>
         {type=='home' ? <Image source={require('../assets/images/empty-logo3.png')} style={{width:'100%',height:200,marginTop:20}}/> : <Image source={require('../assets/images/empty-logo4.png')} style={{width:'100%'}}/>}
          <View style={{position: 'relative'}}>
          {type!='home' ? <Text  style={{marginBottom: 2,color:'#3b3a3a',fontSize:18, textAlign:'center'}}>{ translate("Aaaaah!")}</Text> : null}
            </View>
            <View style={{position: 'relative'}}>
              <Text  style={{marginBottom: 2,color:'#3b3a3a',fontSize:13, textAlign:'center'}}>{ translate("You don't have any activity yet.")}</Text>
            </View>
            <View style={{position: 'relative'}}>
              <Text  style={{marginBottom: 2,color:'#3b3a3a',fontSize:13, textAlign:'center'}}>{ translate(string)}</Text>
            </View>
        </View>
    </View>
)

EmptyNotification.propTypes = {}

EmptyNotification.defaultProps = {}

export default EmptyNotification
