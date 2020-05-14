import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView, TextInput, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon, Divider} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import Chevron from '../components/Chevron';
import { setLocalization,translate } from 'react-native-translate';
import idTranslation from '../src/id.json';
import engTranslation from '../src/eng.json';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';


 class App extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: translate('Change Password'),
     headerTitleStyle : {fontSize:17, marginLeft:-10, fontWeight:'bold'},
     headerStyle: {
      backgroundColor: mainColor(),
      elevation : 0,
    },
    headerTintColor: '#fff',
    });
  constructor(props) {
    AsyncStorage.getItem('user', (error, result) => {
        if (result) {
           let resultParsed = JSON.parse(result)
           this.setState({
                id_user: resultParsed.id_user,
                email: resultParsed.email,
                name: resultParsed.name,
                // lang: 'English',
            });
            this.hideLoader();
        }
    });
    super(props);
    this.state = {
      email: '',
      name: '',
      id_user: '',
      isLoading: true,
    };
  }

  showLoader(){
    this.setState({
      isLoading: true,
    });
  };
  hideLoader(){
    this.setState({
      isLoading: false,
    });
  };
  
  
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };
 

  async SignOut(){ 
    try {
      await AsyncStorage.clear();
      this.props.navigation.push('Login');
    }
    catch(exception) {
      return false;
    }
  }

  SubmitUpdate= () =>{ 
    if(this.state.newPassword!=this.state.repeatNewPassword){
      Alert.alert(
        '',
        translate('Password doesnt match'),
        [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'OK',
          },
        ],
        {cancelable: false},
      );   
    }else{
      this.showLoader();
      fetch(GlobalSetting.url_api + '/auth/changePassword', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
        },
        body: JSON.stringify({
          email : this.state.email,
          password : this.state.password,
          new_password : this.state.newPassword,
        })
      }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);

          if(responseJson.code==200){
            this.SignOut();
          }else{
            Alert.alert(
              translate('Warning !'),
              translate('Wrong old password'),
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
            this.hideLoader();
          }
        });
      }
  }

    
    renderEditProfile() {
      return  (
      <View style={{zIndex:9999999, position:'relative'}}>
        <KeyboardAwareScrollView extraScrollHeight={100} scrollEnabled={true} enableAutomaticScroll={true} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
        <View style={[styles.cardProfileHeader60,{marginTop:0}]} >
          <View style={{flex:1, flexDirectio:'row'}}>
            
            <FormInput label="Password" onChangeText={password => this.setState({password})}  value={this.state.password} secureTextEntry={true}/>
            <FormInput label="New Password" onChangeText={newPassword => this.setState({newPassword})}  value={this.state.newPassword} secureTextEntry={true}/>
            <FormInput label="Repeat Password" onChangeText={repeatNewPassword => this.setState({repeatNewPassword})}  value={this.state.repeatNewPassword} secureTextEntry={true}/>
            <Button 
              title={translate('Update')}
              buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
              containerStyle={{marginRight :0, marginTop:15}}
              titleStyle={{color:'#fff'}}
              onPress={this.SubmitUpdate}
              loading={this.state.isLoading}
            />
          </View>
        </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
  

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator color={mainColor()}/>
        </View>
      )
    }
    return (
    <View style={[styles.containerGray]}>
        <ScrollView>
        <View style={[styles.containerIb,{backgroundColor:mainColor(), height:200}]}>
        <Image source={require('../assets/images/privacy_policy.jpg')} style={{width:'100%',height:200,marginTop:20}}/>
        </View>
        {this.renderEditProfile()}
        </ScrollView>
    </View>
    );
  }
}

export default App;  
