import * as React from 'react';
import {NetInfo, Alert, BackHandler, Platform,AsyncStorage,FlatList, ScrollView, Dimensions,ActivityIndicator, Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { createAppContainer,createDrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GlobalSetting from '../components/GlobalSetting';
import { mainColor, currencyFormat,CustomAlertView }  from '../components/GlobalFunction';
import { Avatar, Header , Badge,  withBadge, Icon, Divider,ListItem} from 'react-native-elements';
import Chevron from '../components/Chevron';
import styles from "../components/Style";
import { translate } from 'react-native-translate';
import AwesomeAlert from 'react-native-awesome-alerts';
import Moment from 'moment';
import { Notifications } from 'expo';

import EmptyData from '../components/EmptyData';

import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
 

class App extends React.Component {
    static navigationOptions= ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            headerTitle: (
              <View>
              <Text style={{fontWeight:'bold', color:'white', fontSize:17}}>Notification</Text>
              </View>
            ),
            headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
            headerStyle: {
              backgroundColor: params.mainColor,
              elevation : 0,
            },
            headerTintColor: '#fff',
        };
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
            this.getData();
            this.willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                  this.setState({isLoading:true});
                  this.getData();
                }
            );
        }
    });
    super(props);
    this.state ={ 
      isLoading: true,
      name : '',
      type:'confirm'
    }
  }
  
  componentDidMount(){
    this.props.navigation.setParams({mainColor: mainColor()});
  }
 
  componentWillUnmount() {
    this.willFocusSubscription.remove();
   }
 
  
  getData() {
    const { navigation } =this.props;
   
    return fetch(GlobalSetting.url_api + '/notification?id_user='+this.state.id_user)
    .then((response) => response.json())
    .then((responseJson) => {
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
   
   readNotif(id_notification,url_mobile,status){
    if(status=='read'){
        this.props.navigation.push(url_mobile);
    }else{
     var data = {  
        id_notification: id_notification,
      }
      console.log(data);

      var uri =GlobalSetting.url_api + '/notification/readNotif';
      fetch(uri, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
                this.props.navigation.push(url_mobile);
        });
   }
}
    renderContent() {
    const { navigation } =this.props;

    
      return (
      <View style={[styles.container]}>
        <ScrollView style={{height:'83%'}}>
        {this.state.dataSource.map((ro ,index)=> (
          <View style={[styles.cardProfile2,{backgroundColor:ro.status=='read' ? '#fff' : '#eee'}]}   key={index} >
          <View style={{flex:1, flexDirectio:'row',}}>
              <ListItem
              title={ro.created_at}
              subtitle={ro.content}
              titleStyle={{ fontSize: 11, color:'#4d4d4d'}}
              subtitleStyle={{ fontSize:12 }}
              onPress={() => this.readNotif(ro.id_notification, ro.url_mobile, ro.status)}
              containerStyle={[styles.listItemContainerNoBorder,{backgroundColor:ro.status=='read' ? '#fff' : '#eee'}]}
              leftAvatar={<Avatar rounded large   overlayContainerStyle={{backgroundColor: mainColor()}}  height={45} width={45}  title={''} titleStyle={{color:'white', fontSize:12, position:'relative'}} />}
             
                
              rightIcon={<Chevron />}
              />
          </View>
        </View> 
              ))}
      </ScrollView>
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
     <View style={[styles.container]}>
        {this.state.dataSource.length >=1 ?  this.renderContent() : <EmptyData string='' type='notification'/>}
      </View>
    );
  }
}

export default App;  
