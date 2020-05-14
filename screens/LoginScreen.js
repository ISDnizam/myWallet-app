import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GlobalSetting from '../components/GlobalSetting';
import HomeScreen from './HomeScreen';
import stylesLogin from "../components/StyleLogin";
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon, Divider,Input } from 'react-native-elements';
import { mainColor, currencyFormat, setMainColor }  from '../components/GlobalFunction';
import { translate } from 'react-native-translate';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Facebook from 'expo-facebook';
class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    AsyncStorage.getItem('user', (error, result) => {
        if (result) {
           let resultParsed = JSON.parse(result)
           this.setState({
                id_user: resultParsed.id_user,
                email: resultParsed.email,
                name: resultParsed.name,
            });
        }
    });
    super(props);
    this.state ={ 
      isLoading: false,
      opacity: 0,
      opacityButton: 1,
      email : '',
      password : '',
      c_password : '',
      id_user : '',
      name : '',
      view : 'Login',
    }
  }

   showLoader = () => {
    this.setState({ isLoading: true});
  };
    hideLoader = () => {
    this.setState({ isLoading: false});
  };

  onLoginPress= () =>{ 
    this.setState({
      view : 'Login',
    }); 
  }
  onRegisterPress = () =>{ 
    this.setState({
      view : 'Register',
    }); 
  }
  _scrollToInput (reactNode: any) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }
  
  initAsync = async () => {
    await GoogleSignIn.initAsync({
      // You may ommit the clientId when the firebase `googleServicesFile` is configured
      clientId: 'com.googleusercontent.apps.138036802788-63u4r4npll7nl7ou0m2bcoi7obb11b80',
    });
    this._syncUserWithStateAsync();
  };

  _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    var myJSON = JSON.stringify(user);
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    let token = await Notifications.getExpoPushTokenAsync();
    fetch(GlobalSetting.url_api + '/auth/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
    },
    body: JSON.stringify({
      email : user.email,
      id_social : user.uid,
      name : user.displayName,
      expo_token : token,
      type : 'google',
    })
    }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.code==200){
              let data = {  
                  id_user: responseJson.result.id,
                  email: responseJson.result.email,
                  name: responseJson.result.name,
              }
              AsyncStorage.setItem('user', JSON.stringify(data));
              this.hideLoader();
              this.props.navigation.push('App');
              }else{
                Alert.alert(
                  'Warning !',
                  'Username and password doesnt match',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                this.hideLoader();
              }
        });
  };
  async  facebookLogIn() {
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('509309863332183', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    this.setState({ user: null });
  };

  signInAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        this.showLoader();
        this._syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  };

  googleSignin = () => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      this.signInAsync();
    }
  };
 
async AccessLogin(){ 
      this.showLoader();
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      fetch(GlobalSetting.url_api + '/auth/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
      },
      body: JSON.stringify({
        email : this.state.email,
        password : this.state.password,
        expo_token : token,
        type : 'email',
      })
      }).then((response) => response.json())
          .then((responseJson) => {
              if(responseJson.code==200){
                let data = {  
                    id_user: responseJson.result.id,
                    email: responseJson.result.email,
                    name: responseJson.result.name,
                }
                AsyncStorage.setItem('user', JSON.stringify(data));
                this.props.navigation.push('App');
                }else{
                  Alert.alert(
                    'Warning !',
                    'Username and password doesnt match',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                  );
                  this.hideLoader();
                }
          });
    }

    async AccessRegister(){ 
      this.showLoader();
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      fetch(GlobalSetting.url_api + '/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
      },
      body: JSON.stringify({
        name : this.state.name,
        email : this.state.email,
        password : this.state.password,
        c_password : this.state.c_password,
        expo_token : token,
      })
      }).then((response) => response.json())
          .then((responseJson) => {
                if(responseJson.code==200){
                let data = {  
                    id_user: responseJson.result.id,
                    email: responseJson.result.email,
                    name: responseJson.result.name,
                }
                AsyncStorage.setItem('user', JSON.stringify(data));
                this.props.navigation.push('App');
                }else{
                  Alert.alert(
                    'Warning !',
                    'Failed, please try again',
                    [
                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    {cancelable: false},
                  );
                  this.hideLoader();
                }
          });
    }

    
  renderFormLogin() {
    return  (
    <View>
      <View style={{marginBottom:30}}>
          <Text style={{color:mainColor(), textAlign:'left',fontSize:11,fontWeight:'bold'}}>
            {translate('EMAIL')}
          </Text>
          <TextInput
          onChangeText={email => this.setState({email})}
          style={styles.textInput}
          placeholder={translate('Email Address')+ "..."}
          placeholderTextColor = "#e2e2e2"
          />
          
          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />

          <Text style={{color:mainColor(), textAlign:'left',fontWeight:'bold', fontSize:11, marginTop:10}}>
            {translate('PASSWORD')}
          </Text>
          <TextInput
          onChangeText={password => this.setState({password})}
          style={styles.textInput}
          placeholder={translate('Password')+ "..."}
          placeholderTextColor = "#e2e2e2"
          secureTextEntry={true}
          ref={(input) => this.password = input}
          />
          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />
      </View>
    </View>
      );
    }
  
  
    renderFormRegister() {
      return  (
      <View>
        

        <View  style={{marginBottom:30}}>
          <Text style={{color:mainColor(), textAlign:'left',fontSize:11,fontWeight:'bold'}}>
            {translate('NAME')}
          </Text>
          <TextInput style={styles.textInput}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Name"
          placeholderTextColor = "#e2e2e2"
          selectionColor={mainColor()}
          onChangeText={name => this.setState({name})}
          ref={(input) => this.password = input}

          />

          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />

          <Text style={{color:mainColor(), textAlign:'left',fontWeight:'bold', fontSize:11, marginTop:10}}>
            {translate('EMAIL')}
          </Text>
          <TextInput style={styles.textInput}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Email Address"
          placeholderTextColor = "#e2e2e2"
          selectionColor={mainColor()}
          onChangeText={email => this.setState({email})}
          />

          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />
   
          <Text style={{color:mainColor(), textAlign:'left',fontWeight:'bold', fontSize:11, marginTop:10}}>
            {translate('PASSWORD')}
          </Text>
          <TextInput style={styles.textInput}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor = "#e2e2e2"
          selectionColor={mainColor()}
          onChangeText={password => this.setState({password})}
          ref={(input) => this.password = input}
          />

          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />
   
          <Text style={{color:mainColor(), textAlign:'left',fontWeight:'bold', fontSize:11, marginTop:10}}>
            {translate('REPEAT PASSWORD')} {this.state.keyboardOpen}
          </Text>
          <TextInput style={styles.textInput}
          underlineColorAndroid='rgba(0,0,0,0)'
          placeholder="Repeat Password"
          secureTextEntry={true}
          placeholderTextColor = "#e2e2e2"
          selectionColor={mainColor()}
          onChangeText={c_password => this.setState({c_password})}
          ref={(input) => this.c_password = input}
          />

          <Divider style={{ backgroundColor: '#e2e2e2',marginBottom:10 }} />


          {/* <ActivityIndicator style={{height: 80, marginTop: -30, opacity: this.state.opacity }} size="large" color="#fff" /> */}
        </View>
      
      </View>
      );
    }

    
    renderButtonSocialLogin() {
      return  (
      <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={[styles.textGray,{borderBottomWidth: 0.5, borderBottomColor: '#9c9c9c', flex: 1,marginLeft:25 }]}/>
                  <Text style={[styles.textGray,{fontSize:12,padding:5}]}> OR CONNECT WITH </Text>
                  <View style={[styles.textGray,{borderBottomWidth: 0.5, borderBottomColor: '#9c9c9c', flex: 1,marginRight:25 }]}/>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop:10 }}>
          <TouchableOpacity
                    style={{alignItems: 'center', backgroundColor:'#3d5fd1', width: '40%',
                      flexDirection: 'row',
                      justifyContent: 'center' , borderRadius: 5, padding:10, marginRight:5}}
                      onPress={() => {
                        this.facebookLogIn();
                      }}
                  >
                    <Icon
                           name='facebook'
                           type='font-awesome'
                           color='white'
                    />
                    <Text size='mini' weight={500}  style={{ color:'white',marginLeft: 10, fontWeight:'bold' }} >Facebook</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={this.googleSignin}
                    style={{ alignItems: 'center',backgroundColor:'#e84f31',width: '40%',
                      flexDirection: 'row', 
                      justifyContent: 'center', borderRadius: 5, padding:10, marginLeft:5}}
                  >
                    <Icon
                           name='google'
                           type='font-awesome'
                           color='white'
                    />
                    <Text size='mini' weight={500} style={{ color:'white',marginLeft: 10, fontWeight:'bold' }} >Google</Text>
                  </TouchableOpacity>
                </View>

      </View>
      );
    }

      
  render() {
    if(this.state.view=='Login'){
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView extraScrollHeight={50} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
          <View style={[styles.containerIbDefault,{backgroundColor:mainColor(), height:200}]}>
          </View>
   
        


          <View style={[styles.cardHeaderHome]} >
            <View style={{flex: 1, flexDirectio:'column',justifyContent:'center'}}>
              <View style={stylesLogin.welcomeContainer}>
                <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>
                {/* {translate('LOGIN SCREEN')} */}
                </Text>
              </View>
            </View>
          </View>


          <View style={styles.cardHeaderHome2} >
            <View style={{flex: 1, flexDirectio:'column',justifyContent:'center',marginBottom:30}}>
              <View style={{alignItems:'center'}}>
                <Icon
                reverse
                containerStyle={{ marginTop: -50}}
                name='user'
                type='font-awesome'
                color={mainColor()}
                size={30} />
                <Text style={{color:mainColor(), fontSize:13, fontWeight:'bold'}}>
                {translate('LOGIN SCREEN')}
                </Text>
              </View>
            </View>
            {this.renderFormLogin()}
          </View>
          <View style={{	elevation: 3,paddingLeft:30,paddingRight:30,marginTop:-30}} >
            <Button 
              title={translate('LOGIN')}
              buttonStyle={{borderRadius: 20,backgroundColor:mainColor(),	shadowColor: '#000',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,  
              elevation: 4}}
              containerStyle={{paddingLeft:50,paddingRight:50
              }}
              titleStyle={{color:'#fff'}}
              onPress={() => {
                this.AccessLogin();
              }}
              loading={this.state.isLoading}
            />
          </View>

          <TouchableOpacity onPress={this.onRegisterPress}>
            <View style={{padding: 20,alignItems: 'center'}} >
              <Text   style={[styles.textGray,{fontSize:12}]}>Dont have account ? REGISTER</Text>
            </View>
          </TouchableOpacity>

            {this.renderButtonSocialLogin()}
          </KeyboardAwareScrollView>
        </View>
      );
    }else if(this.state.view=='Register'){
      return (
        <View style={styles.container}>
          <KeyboardAwareScrollView extraScrollHeight={150} scrollEnabled={true}
          enableAutomaticScroll={true} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
          <View>
            <View style={[styles.containerIbDefault,{backgroundColor:mainColor(), height:200}]}>
            </View>
 
    
            <View style={[styles.cardHeaderHome]} >
              <View style={{flex: 1, flexDirectio:'column',justifyContent:'center'}}>
                <View style={stylesLogin.welcomeContainer}>
                  <Text style={{color:'#fff', fontSize:20, fontWeight:'bold'}}>
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardHeaderHome2} >
            <View style={{flex: 1, flexDirectio:'column',justifyContent:'center',marginBottom:30}}>
              <View style={{alignItems:'center'}}>
                <Icon
                reverse
                containerStyle={{ marginTop: -50}}
                name='user'
                type='font-awesome'
                color='#0f83d1'
                size={30} />
                <Text style={{color:mainColor(), fontSize:13, fontWeight:'bold'}}>
                {translate('REGISTER SCREEN')}
                </Text>
              </View>
            </View>


              {this.renderFormRegister()}
            </View>
            
            <View style={{	elevation: 3,paddingLeft:30,paddingRight:30,marginTop:-30}} >
              <Button 
                title={translate('REGISTER')}
                buttonStyle={{borderRadius: 20,backgroundColor:mainColor(),	shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,  
                elevation: 4}}
                containerStyle={{paddingLeft:50,paddingRight:50
                }}
                titleStyle={{color:'#fff'}}
                onPress={() => {
                  this.AccessRegister();
                }}
                loading={this.state.isLoading}
              />
            </View>
            <TouchableOpacity onPress={this.onLoginPress}>
              <View style={{padding: 20,alignItems: 'center'}} >
                <Text   style={[styles.textGray,{fontSize:12}]}>Have an account ? LOGIN</Text>
              </View>
            </TouchableOpacity>
            <View style={{marginBottom:30}} >

            {this.renderButtonSocialLogin()}

          </View>
          </View>
        </KeyboardAwareScrollView>

      </View>
      );
    }
  }
}
export default  LoginScreen;

