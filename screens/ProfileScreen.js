import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView, TextInput, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon, Divider} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import Chevron from '../components/Chevron';
import { Linking } from 'expo';
import { setLocalization,translate } from 'react-native-translate';
import RBSheet from "react-native-raw-bottom-sheet";
import idTranslation from '../src/id.json';
import engTranslation from '../src/eng.json';
import { mainColor, currencyFormat,CustomAlertView }  from '../components/GlobalFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as GoogleSignIn from 'expo-google-sign-in';
import FormInput from '../components/FormInput';


 class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: translate('Profile'),
    headerTitleStyle : {fontSize:17, fontWeight:'bold'},
     headerStyle: {
      backgroundColor: mainColor(),
      elevation : 0,
    },
    headerLeft: null,
    headerTintColor: '#fff',
    });
  constructor(props) {
    AsyncStorage.getItem('user', (error, result) => {
        if (result) {
           let resultParsed = JSON.parse(result)
           this.setState({
                id_user:  resultParsed.id_user,
                email: resultParsed.email,
                name: resultParsed.name,
                // lang: 'English',
            });
            this.setState({isLoading:true});
            this._retrieveData();
            this.getBalance();
            this.willFocusSubscription = this.props.navigation.addListener(
              'willFocus',
              () => {
                this.setState({isLoading:true});
                this._retrieveData();
                this.getBalance();
              }
            );
      
        }
    });
    super(props);
    this.state = {
      email: '',
      name: '',
      id_user: 1,
      isLoading: true,
      view: 'profile',
    };
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('lang');
      if (value == null) {
            let value = 'English';
      }
      if(value=='Indonesia'){
        this.setState({
          colorID: mainColor(),
          colorENG: '#9c9c9c',
          lang: value,
         });
        setLocalization(idTranslation);
      }else{
        this.setState({
          colorID: '#9c9c9c',
          colorENG: mainColor(),
          lang: 'English',
         });
        setLocalization(engTranslation);
      }
      console.log(value);
    } catch (error) {
      // Error retrieving data
    }
  };
  componentWillUnmount() {
    this.willFocusSubscription.remove();
   }
  _openWA = () => {
    Linking.openURL('https://wa.me/+62856-9664-0323?text=Hello Nizam. I need your help... ');
  };

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
  editProfile(){
    this.setState({
      view: 'editProfile',
    });
  };
  backProfile(){
    this.setState({
      view: 'profile',
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
   
      await AsyncStorage.clear();
      this.props.navigation.push('Login');
  }
  setLang = (lang) => {
  AsyncStorage.setItem('lang', lang);
    if(lang=='Indonesia'){
      this.setState({
        colorID: mainColor(),
        colorENG: '#9c9c9c',
      });
      setLocalization(idTranslation);
    }else{
      this.setState({
        colorID: '#9c9c9c',
        colorENG: mainColor(),
      });
      setLocalization(engTranslation);
    }
    this.Category.close();
    this.props.navigation.push('App');
  };
  
  setCurrency = (currency) => {
    fetch(GlobalSetting.url_api + '/user/edit?type=currency', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
      },
      body: JSON.stringify({
        currency : currency,
        id_user : this.state.id_user,
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson.code==200){
          this.props.navigation.push('App');
        }else{
          Alert.alert(
            'Warning !',
            'Failed Change Currency',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        }
      });
      this.Currency.close();
    }
  
 

  getBalance() {
    return fetch(GlobalSetting.url_api + '/getBalance?id_user=' + this.state.id_user)
     .then((response) => response.json())
     .then((responseJson) => {
        if(responseJson.result.currency=='Rp.'){
          this.setState({
            colorIDR: mainColor(),
            colorDollar: '#9c9c9c',
            currencyName: 'IDR',
          });
        }else{
          this.setState({
            colorIDR: '#9c9c9c',
            colorDollar: mainColor(),
            currencyName: 'Dollar',
          });
        }
       this.setState({
         isLoading: false,
         dataSource: responseJson.result,
       }, function(){
       });
     })
     .catch((error) =>{
       console.error(error);
     });
   }
  onPressOptions = () => {
    alert('Under Development !!');
  }

  SubmitUpdate= () =>{ 
    if(this.state.email==''){
      Alert.alert(
        '',
        'Please input your email',
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
      fetch(GlobalSetting.url_api + '/user/edit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQwNWRlMGJmODJlZWQwMGFkMTJjNTY3MzJhNWU1YThmMjYyNWNmZTJhN2NlMDljZTVkOGNiYWYwMWE1MTFlNWUzZGRiNjFhNWVhZGMzMzkzIn0.eyJhdWQiOiIxIiwianRpIjoiZDA1ZGUwYmY4MmVlZDAwYWQxMmM1NjczMmE1ZTVhOGYyNjI1Y2ZlMmE3Y2UwOWNlNWQ4Y2JhZjAxYTUxMWU1ZTNkZGI2MWE1ZWFkYzMzOTMiLCJpYXQiOjE1NjI4MjYwNDcsIm5iZiI6MTU2MjgyNjA0NywiZXhwIjoxNTk0NDQ4NDQ3LCJzdWIiOiI0NSIsInNjb3BlcyI6W119.BOMTDbLX8_5de6fn396MCWqc6MID7d8M30I0z5Ow3LZFXpfMrjnMMr22KyRWSKcprmqJ5QyuZbMgNdwjaSwArbs9W76QG0y3CVjAGuZGj7mb2Wdw6Pf5_vRMAlgvR48jIN7QZyoTPaBBmJ8n8nklYKKuP1Co--bLjdeYuTJOGzeef_i1d61yaRUDrG06i_-LFLr41cKYGJfw44Ubm75lUI2XHT5wqY1cje6orHBqgmps0EgH-8yYGlnMEFDVQGuMHhnZl3fOawZ466QE0qZ08AZmc4G60U87Jqy-VAKu_Prjges2YfsXVfBBt-Zs60JS2NG6bnz5F1l5Q5lz89K0nN304u87tUv7_CjAp9nrpka6WaNh4XrrUMUozT_ze-6EU2WWJlEswHbjcJZK12RmmG8N_yrJXZ08q5Bpy5xpH5QA9VmDCrBcqmbggOgzbtmBbPrLIvTmF1mpi__HKGdcCi-tSg1h0VdOWznWliEH6pg7IklwX5xHhw-nIVCP8zuYpOO-vWskF7X_lNNUeGHDu7BwtyyUD7R1sJ56LzA6rQDyQCMt3xErgJRal6Dqj7EegK0RLsSwJc31K2Gc6Bf1tReZ4gxuu_gyNRkbo7WAuOjPzufjnL34xqqtU0XdBTqxWiH6GtlYHZopNHcfmgFuYye1ZI4ZIasDtXGA8Y49U0k',
        },
        body: JSON.stringify({
          email : this.state.email,
          name : this.state.name,
          id_user : this.state.id_user,
        })
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.code==200){
            let data = {  
                id_user: responseJson.result.id,
                email: responseJson.result.email,
                name: responseJson.result.name,
            }
            console.log(responseJson);
            AsyncStorage.setItem('user', JSON.stringify(data));
            this.hideLoader();
            this.backProfile();
          }else{
            Alert.alert(
              'Warning !',
              'Failed Update Profile',
              [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
              ],
              {cancelable: false},
            );
          }
        });
      }
  }
  renderProfile() {
    return  (
      <View>
        <View style={styles.cardProfileHeader60} >
          <View style={{flex:1, flexDirectio:'row',}}>
            <ListItem
              title={this.state.name}
              subtitle={this.state.email}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              containerStyle={styles.listItemContainer}
              leftAvatar={
                <Icon
                reverse
                containerStyle={{marginLeft:-15}}
                name='user'
                type='font-awesome'
                color={mainColor()}
                size={32} />
              }
              bottomDivider
              rightIcon={
                <Icon
                onPress={() => this.editProfile()}
                name='pencil'
                type='font-awesome'
                color={mainColor()}
                size={18} />
              }
            />

            <ListItem
              // chevron
              title= {(this.state.dataSource.currency)+' '+currencyFormat(this.state.dataSource.current_balance)}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              onPress={() => this.onPressOptions()}
              containerStyle={styles.listItemContainerNoBorder}
              leftIcon={
                <Icon
                name='toggle-on'
                type='font-awesome'
                color={mainColor()}
                size={22} />
              }
            />
          </View>
        </View>
            
        <View style={styles.cardProfile} >
          <View style={{flex:1, flexDirectio:'row',}}>
              <ListItem
              title={translate('Report')}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              onPress={() => this.props.navigation.push('Report')}
              containerStyle={styles.listItemContainerNoBorder}
              subtitle={translate('See your financial report')}
              leftIcon={
                <Icon
                name='edit'
                type='font-awesome'
                color={mainColor()}
                size={22} />
              }
              rightIcon={<Chevron />}
            />
          </View>
        </View> 
            
        <View style={styles.cardProfile} >
          <View style={{flex:1, flexDirectio:'row',}}>
            <ListItem
              // chevron
              title={translate('Currency')}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              subtitle={translate('Set up your currency')}
              rightTitle={(this.state.currencyName)}
              rightTitleStyle={{ fontSize: 13 }}
              onPress={() => this.Currency.open()} 
              containerStyle={styles.listItemContainer}
              leftIcon={
                <Icon
                name='money'
                type='font-awesome'
                color={mainColor()}
                size={22} />
              }
            />
            <ListItem
            // chevron
            title={translate('Language')}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={translate('Change your Language')}
            rightTitle={this.state.lang}
            rightTitleStyle={{ fontSize: 13 }}
            onPress={() => this.Category.open()} 
            containerStyle={styles.listItemContainer}
            leftIcon={
              <Icon
              name='language'
              type='material'
              color={mainColor()}
              size={22} />
            }
            />
            <ListItem
            title={translate('Change Password')}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={translate("Enhance your account's security")}
            rightTitleStyle={{ fontSize: 14 }}
            onPress={() => this.props.navigation.push('ChangePassword')}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <Icon
              name='security'
              type='material'
              color={mainColor()}
              size={22} />
            }
            />
            {/* <ListItem
            title={translate('Settings')}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={translate('View and set your account preferences')}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainerNoBorder}
            leftIcon={
              <Icon
              name='gear'
              type='font-awesome'
              color={mainColor()}
              size={22} />
            }
            /> */}


            <ListItem
            title={translate('Change Theme')}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={translate('Change theme color for this application')}
            onPress={() => this.props.navigation.push('ChangeColor')}
            containerStyle={styles.listItemContainerNoBorder}
            leftIcon={
              <Icon
              name='magic'
              type='font-awesome'
              color={mainColor()}
              size={22} />
            }
            />
        
            <ListItem
            // chevron
            title={translate('Help Center')}
            titleStyle={styles.titleStyle}
            subtitleStyle={styles.subtitleStyle}
            subtitle={translate('Find the best answer to your question')}
            rightTitleStyle={{ fontSize: 13 }}
            onPress={this._openWA}
            containerStyle={styles.listItemContainerNoBorder}
            leftIcon={
              <Icon
              name='question-circle'
              type='font-awesome'
              color={mainColor()}
              size={22} />
            }
            />
          </View>
        </View>
      
        <View style={styles.cardProfile} >
          <View style={{flex:1, flexDirectio:'row',}}>
            <ListItem
              title={translate('Log Out')}
              onPress={() => this.showAlert()}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              containerStyle={styles.listItemContainerNoBorder}
              leftIcon={
                <Icon
                name='power-off'
                type='font-awesome'
                color={mainColor()}
                size={22} />
              }
            />
          </View>
        </View>
      </View>
      );
    }

    
    renderEditProfile() {
      return  (
      <View>
        <View style={styles.cardProfileHeader60} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <View style={{alignItems:'center'}}>
              <Icon
              reverse
              containerStyle={{ marginTop: -50}}
              name='user'
              type='font-awesome'
              color={mainColor()}
              size={30} />
    
              <View style={styles.textRight}>
                <Icon
                onPress={() => this.backProfile()}
                iconStyle ={{marginTop:0}}
                containerStyle ={styles.textRight}
                name='close'
                type='font-awesome'
                color={mainColor()}
                size={18} />
              </View>
            </View>
            <FormInput label="Name" onChangeText={name => this.setState({name})}  value={this.state.name}/>
            <FormInput label="Email" onChangeText={email => this.setState({email})}  value={this.state.email}/>
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
    if(this.state.view=='profile'){
    return (
      <View style={[styles.containerGray]}>
          <AwesomeAlert
            show={this.state.showAlert}
            alertContainerStyle={{zIndex:9999,  height:400}}
            overlayStyle={{ flex: 1,
              position: 'absolute',
              opacity: 0.8,
              backgroundColor: 'black'}}
            contentContainerStyle={{width:300}}
            showProgress={false}
            customView={CustomAlertView('Are you sure you want to Sign Out?')}
            // message={translate('Are you sure you want to Sign Out ?')}
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={true}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText={translate('Cancel')}
            confirmText={translate('Log Out')}
            cancelButtonColor={mainColor()}
            confirmButtonColor='#9e0e0e'
            onCancelPressed={() => {
              this.hideAlert();
            }}
            onConfirmPressed={() => {
              this.SignOut();
            }}
          />
        <ScrollView>
          <View style={[styles.containerIb,{backgroundColor:mainColor(),borderTopRightRadius:18}]}>
          </View>
          {this.renderProfile()}
    
        </ScrollView>
        {this.renderModal()}
      </View>
      );
    }else if(this.state.view=='editProfile'){
      return (
        <View style={[styles.containerGray]}>
          <ScrollView>
            <View style={[styles.containerIb,{backgroundColor:mainColor()}]}>
            </View>
            {this.renderEditProfile()}
          </ScrollView>
        </View>
      );
    }
  }


  renderModal(){
    return (
      <View>
      <RBSheet
        ref={ref => {
          this.Category = ref;
        }}
        height={150}
        closeOnDragDown={false}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 15,
          }
        }}>
        <View>
          <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold', marginBottom:15}}>{ translate('Language') } </Text>
          <Divider style={{ backgroundColor: '#d4d2d2' }} />
          <ScrollView style={{marginBottom:20}}>
              <TouchableOpacity
                key={1}
                onPress={() => this.setLang(translate('English'))}
                >
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    type='font-awesome'
                    color={this.state.colorENG}
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> {translate('English')}</Text>
                  </View>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                key={2}
                onPress={() => this.setLang(translate('Indonesia'))}>
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    type='font-awesome'
                    color={this.state.colorID}
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> 
                      {translate('Indonesia')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          
          </View>
        </RBSheet>

        <RBSheet
        ref={ref => {
          this.Currency = ref;
        }}
        height={150}
        closeOnDragDown={false}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 15,
          }
        }}>
        <View>
          <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold', marginBottom:15}}>{ translate('Currency') } </Text>
          <Divider style={{ backgroundColor: '#d4d2d2' }} />
          <ScrollView style={{marginBottom:20}}>
              <TouchableOpacity
                key={1}
                onPress={() => this.setCurrency(translate('Rp.'))}
                >
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    type='font-awesome'
                    color={this.state.colorIDR}
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> {translate('Rp (IDR)')}</Text>
                  </View>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                key={2}
                onPress={() => this.setCurrency(translate('$'))}>
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    type='font-awesome'
                    color={this.state.colorDollar}
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> 
                      {translate('$ (Dollar)')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          
          </View>
        </RBSheet>
        </View>

    )
  }
}

export default ProfileScreen;  
