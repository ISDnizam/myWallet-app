import * as React from 'react';
import { Alert,FlatList,AsyncStorage, ScrollView, ActivityIndicator, Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Ionicons } from '@expo/vector-icons';
import GlobalSetting from '../components/GlobalSetting';
import Tabs from 'react-native-tabs';
import { translate } from 'react-native-translate';
import { Avatar, Header , Icon, Divider,ListItem} from 'react-native-elements';
import styles from "../components/Style";
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import Moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';

class OutgoingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: translate('Expense Transactions'),
    headerLeft: null,
    headerTitleStyle : {fontSize:17,  fontWeight:'bold'},
     headerStyle: {
      backgroundColor: mainColor(),
      elevation : 0,
    },
    headerTintColor: '#fff',
    });
   constructor(props){
    AsyncStorage.getItem('user', (error, result) => {
        if (result) {
           let resultParsed = JSON.parse(result)
           this.setState({
                id_user: resultParsed.id_user,
                email: resultParsed.email,
                name: resultParsed.name,
            });
           this.setTab('THIS MONTH');
        }
    });
    super(props);
    this.state ={ 
      isLoading: true,
      email : '',
      password : '',
      showAlert:false,

      name : '',
      type: 'THIS MONTH',

    }
  }
  

    getTx(date) {
      return fetch(GlobalSetting.url_api + '/transaksi/all?type=out&date='+date+'&id_user=' + this.state.id_user)
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
   

    removeAction(id_balance) {
    fetch(GlobalSetting.url_api + '/transaksi/delete/'+id_balance, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      }).then((response) => response.json())
          .then((responseJson) => {
          this.setTab(this.state.type);
          this.hideAlert();

        });
    }
  
    setTab(type) {
      var d = new Date();
      var n = d.getMonth();
      var year = d.getUTCFullYear();
      if(type=='THIS MONTH'){
        var date = n+1;
        if(date<10){
          var date = '0'+date;
        }else{
          var date = date;
        }
      }else if(type=='LAST MONTH'){
        if(n==0){
          var date = 12;
          var year = year-1;
        }else{
          var date = n;
          if(date<10){
            var date = '0'+date;
          }
        }
      }else{
        var date = '';
      }

      this.setState({
        type: type,
      });
      if(date){
        this.getTx(year+'-'+date);
      }else{
        this.getTx('');
      }
      console.log(year+'-'+date);
    }
    editAction(id_balance) {
      this.hideAlert();
      this.props.navigation.push('AddTx',{action:'edit', 'id_balance':id_balance});
    }
    showAlert = (id_balance) => {
      this.setState({
        showAlert: true,
        id_balance: id_balance,
      });
    };
    
    hideAlert = () => {
      this.setState({
        showAlert: false,
        id_balance: false,
      });
    };
    renderContent() {
     if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator color={mainColor()}/>
        </View>
      )
    }
    if(this.state.dataSource.history.length>=1){
    return (
      <View>
        <ScrollView style={{height:'90%'}}>
        <View style={styles.containerDefault}>
        </View>
      
      <View style={styles.cardProfileHeader} >
        <View style={{position: 'absolute'}}>
          <Text  style={{marginBottom: 75,marginLeft: 10,marginTop: 10,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{translate('TOTAL EXPENSE')}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'column',marginTop: 20}}>
          <Ionicons name="ios-stats" color={mainColor()} size={50} />
        </View>
        <View style={{flex: 2.5, flexDirection: 'column',marginTop: 20}}>
        <Text style={{color:'#918e8e',fontSize:12, fontWeight:'bold'}}>{ translate(this.state.type) }   </Text>
        <Text style={{fontWeight :'bold',fontSize:12}} >
        {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.expense)}
        </Text>
        </View>
        <View style={{flex: 2.5, flexDirection: 'column',marginTop: 20}}>
        <Text style={{color:'#918e8e',fontSize:12, fontWeight:'bold'}}>{translate('DEPOSIT')} </Text>
        <Text style={{fontWeight :'600',fontSize:12}} >
        {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.deposit)}
        </Text>
        </View>
      </View>

   
      <View style={styles.cardHome}>
        <View style={{flex:1, flexDirectio:'row'}}>
          <View style={{position: 'relative'}}>
            <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('HISTORY TRANSACTION')}</Text>
          </View>
          <FlatList
          data={this.state.dataSource.history}
          renderItem={({item}) =>
          <TouchableOpacity  onLongPress={() => this.showAlert(item.id_balance)}>
          <View style={styles.viewFlat}> 
            <View style={styles.viewData}>
              <View style={{flex:0.3,flexDirection:'column'}}>
                <Icon
                name={item.icon}
                type='font-awesome'
                color={mainColor()}
                iconStyle={{marginTop:5}}
                size={20} />
              </View>

              <View style={{flex:2,flexDirection:'column'}}>
                <Text style={styles.titleStyle2} >
                  {item.description}
                </Text>
                <Text style={styles.subtitleStyle2}> 
                {translate(item.category_name)}
                </Text>
              </View>
              <View style={styles.textRight}>
                <View style={{flex:3.7, flexDirectio:'row',marginTop:0}}>
                  <Text style={[styles.textSmall,{textAlign:'right'}]}>
                  {Moment(item.date_usage).format('DD MMMM YYYY HH:mm')}
                  </Text>
                  {item.type == 'in'? <Text style={[styles.textSmall,{textAlign:'right',color: 'green', fontWeight:'bold', fontSize:12}]}>+ {this.state.dataSource.currency} {currencyFormat(item.amount)}</Text>
                  : <Text style={{textAlign:'right', color:'red', fontWeight:'bold', fontSize:12}}>- {this.state.dataSource.currency} {currencyFormat(item.amount)} </Text>}
                </View>
              </View>
            </View>
          </View>  
          </TouchableOpacity>
          }
          keyExtractor={item => item.id_balance.toString()} />
        </View>
        </View>
        </ScrollView>
      </View>
    );
  }else{
    return  (
      <View style={{marginTop:10,flexDirection: 'row'}}>
        <View style={{flex:1, flexDirectio:'row'}}>
        <Image source={require('../assets/images/empty-logo4.png')} style={{width:'100%'}}/>
          <View style={{position: 'relative'}}>
            <Text  style={{marginBottom: 2,color:'#3b3a3a',fontSize:18, textAlign:'center'}}>{ translate("Aaaaah!")}</Text>
          </View>
          <View style={{position: 'relative'}}>
            <Text  style={{marginBottom: 2,color:'#3b3a3a',fontSize:13, textAlign:'center'}}>{ translate("You don't have any activity yet.")}</Text>
          </View>
        </View>
      </View>
    );
  }
  }

  render() {
    return (
      <View style={[styles.container]}>
             <AwesomeAlert
          show={this.state.showAlert}
          alertContainerStyle={{zIndex:9999,  height:400}}
          overlayStyle={{ flex: 1,
            position: 'absolute',
            opacity: 0.8,
            backgroundColor: 'black'}}
          contentContainerStyle={{width:300}}
          showProgress={false}
          title={translate('Alert Confirm')}
          message={translate('Do you want to delete or edit ?')}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText={translate('Edit Transaction')}
          confirmText={translate('Delete Transaction')}
          cancelButtonColor={mainColor()}
          confirmButtonColor='#9e0e0e'
          onCancelPressed={() => {
            this.editAction(this.state.id_balance);
          }}
          onConfirmPressed={() => {
            this.removeAction(this.state.id_balance);
          }}
        />
          <Tabs selected={this.state.type} style={{backgroundColor:'white', elevation:2}}
              selectedStyle={{color:mainColor()}} onSelect={el=>this.setTab(el.props.name)}>
            <Text name="LAST MONTH" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{translate('Last Month')}</Text>
            <Text name="THIS MONTH" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('This Month')}</Text>
            <Text name="TOTAL" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('All Expense')}</Text>
        </Tabs>
        {this.renderContent()}
        </View>
    )
  }
       
}


export default OutgoingScreen;  
