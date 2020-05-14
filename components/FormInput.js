import React from 'react'
import { Image, StyleSheet, View,Text,TextInput } from 'react-native'
import { Button, Icon, Divider} from 'react-native-elements';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from './GlobalFunction';
import styles from "./Style";
import NumericInput from '@wwdrew/react-native-numeric-textinput';
import DatePicker from 'react-native-datepicker';



const FormData = ({label,onChangeText,value, type='text', divider=true,secureTextEntry=false}) => (
    <View>
            <Text  style={{color:'#bdbbbb', textAlign:'left',fontWeight:'bold', fontSize:11, marginTop:10}}>
              {translate(label)}
            </Text>
            {type=='text' ?
            <TextInput
              ref={ref => (this.nameInput = ref)}
              value={value}
              onChangeText={onChangeText}
              style={styles.textInput}
              selectionColor={mainColor()}
              secureTextEntry={secureTextEntry}
              placeholder={translate(label)+ "..."}
              placeholderTextColor = "#e2e2e2"
            />
            : type=='datetime' ?
            <DatePicker
            date={value}
            style={{ borderWidth: 0,borderColor: '#ffffff'}}
            mode="datetime"
            placeholder={translate('Select Date')}
            format="D MMMM YYYY HH:mm"
            confirmBtnText={translate('Confirm')}
            cancelBtnText={translate('Cancel')}
            onDateChange={onChangeText}
            />
            : type=='view' ?
            <Text   onPress={onChangeText} style={{color:'#e2e2e2', textAlign:'left', fontSize:13, marginTop:10, marginBottom:10, marginLeft:7}}>
              {value}
            </Text>
            :
            <NumericInput
            value={value}
            type='decimal'
            decimalPlaces={0}
            onUpdate={onChangeText}
            style={styles.textInput}
            selectionColor={mainColor()}
            placeholder={translate(label)+ "..."}
            placeholderTextColor = "#e2e2e2"
            />
            }
            {divider==true ? <Divider style={{ backgroundColor: '#e2e2e2',marginTop:0, marginBottom:0 }} />:null }
    </View>
)

FormData.propTypes = {}

FormData.defaultProps = {}

export default FormData
