import React from 'react'
import { Image, StyleSheet, View,Text,TextInput } from 'react-native'
import { Button, Icon, Divider} from 'react-native-elements';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from './GlobalFunction';
import styles from "./Style";
import AwesomeAlert from 'react-native-awesome-alerts';



const App = ({show,customView,showCancelButton=true,cancelText,confirmText,showConfirmButton=true,onCancelPressed,onConfirmPressed}) => (
    <View>
           <AwesomeAlert
          show={show}
          alertContainerStyle={{zIndex:9999,  height:400}}
          overlayStyle={{ flex: 1,
            position: 'absolute',
            opacity: 0.8,
            backgroundColor: 'black'}}
          contentContainerStyle={{width:300}}
          showProgress={false}
          customView={customView}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={showCancelButton}
          showConfirmButton={showConfirmButton}
          cancelText={translate(cancelText)}
          confirmText={translate(confirmText)}
          cancelButtonColor={mainColor()}
          confirmButtonColor='#9e0e0e'
          onCancelPressed={onCancelPressed}
          onConfirmPressed={onConfirmPressed}
        />
    </View>
)

App.propTypes = {}

App.defaultProps = {}

export default App
