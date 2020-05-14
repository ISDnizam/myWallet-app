import * as React from 'react';
import {NetInfo, Alert, BackHandler, Platform,AsyncStorage,FlatList, ScrollView, Dimensions,ActivityIndicator, Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { createAppContainer,createDrawerNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GlobalSetting from '../components/GlobalSetting';
import { mainColor, currencyFormat,CustomAlertView,dayCondition }  from '../components/GlobalFunction';
import { Avatar, Header , Badge,  withBadge, Icon, Divider,ListItem} from 'react-native-elements';
import Chevron from '../components/Chevron';
import styles from "../components/Style";
import { translate } from 'react-native-translate';
import AwesomeAlert from 'react-native-awesome-alerts';
import Moment from 'moment';
import { Notifications } from 'expo';
import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
import EmptyData from '../components/EmptyData';
import AlertModal from '../components/AlertModal';
import Colors from '../constants/Colors';
import { Linking } from 'expo';
 
const { width } = Dimensions.get('window');
const height = width * 0.8;
let textRef = React.createRef();
let menuRef = null;
const setMenuRef = ref => menuRef = ref;
const hideMenu = () => menuRef.hide();
const showMenu = () => menuRef.show(textRef.current, stickTo = Position.BOTTOM_RIGHT);
class HomeScreen extends React.Component {
  static navigationOptions= ({navigation}) => {
    const {params = {}} = navigation.state;
    const BadgedIcon = withBadge(params.totalNotif)(Icon);
    return {
    headerTitle: (
      <Image source={require('../assets/images/logo-title.png')} style={{width:169,height:39,marginLeft:10}}/>
    ),
     headerLeft: null,
    headerRight: (
      <View style={styles.iconContainer}>
               { params.totalNotif!=0 ? <BadgedIcon  type="font-awesome" name="bell" onPress={() => navigation.push('Notification')} containerStyle={{marginLeft:15}} size={18} color='#ffffff' />
        :  <Icon  type="font-awesome" name="bell" onPress={() => navigation.push('Notification')} containerStyle={{marginLeft:15}} size={18} color='#ffffff' /> }
      </View>
    ),
     headerStyle: {
      elevation : 0,
    backgroundColor: params.mainColor,
    },
    headerTintColor: '#fff',
    }
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
        this.getNotif();
         this.getTx(this.state.id_user);
         this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({isLoading:true});
            this.getTx(this.state.id_user);
        this.getNotif();

          }
        );
      }else{
        console.log('Not Authorized');
        this.props.navigation.push('Login');
      }
  });
    super(props);
    this.state ={ 
      isLoading: true,
      email : 'red',
      password : '',
      name : '',
      showTx : false,
      showMonthlyTx:true,
      showAlertExit :false,
      lang:'eng',
      condition :'',
      showAlert: false,
      customView: '',
      cancelText: '',
      confirmText: '',
    }
  }
 
  getNotif() {
    const { navigation } =this.props;
    return fetch(GlobalSetting.url_api + '/notification?status=unread&id_user='+this.state.id_user)
    .then((response) => response.json())
    .then((responseJson) => {
        if(responseJson.status=='success'){
        this.props.navigation.setParams({totalNotif: responseJson.result.length});
        }else{
        this.props.navigation.setParams({totalNotif: 0});
        }

    })
    .catch((error) =>{
      console.error(error);
    });
   }

  _handleNotification = notification => {
    console.log(notification);
    if(notification){
      this.props.navigation.push(notification.data.redirect);
    }
  };
  getTx(id_user) {
    return fetch(GlobalSetting.url_api + '/transaksi?id_user=' +id_user)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        condition: dayCondition(),
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
          this.getTx(this.state.id_user);
          this.hideAlert();
        });
    }
    editAction(id_balance) {
      this.hideAlert();
      this.props.navigation.push('AddTx',{action:'edit', 'id_balance':id_balance});
    }
    componentDidMount() {
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
      this.props.navigation.setParams({mainColor: mainColor()});
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
      NetInfo.isConnected.addEventListener(
        "connectionChange",
        this.handleConnectivityChange
      );
    }
  showAlert = (id_balance) => {
    this.setState({
      showAlert: true,
      id_balance: id_balance,
    });
  };

  handleBackButton = () => {
  let exit =   this.props.navigation.goBack(null);
  if(exit==false){
    this.setState({
      showAlertExit: true,
      customView: 'Are you sure you want to exit ?',
      cancelText: 'Cancel',
      confirmText: 'Exit',
    });

  }
    return true;
  } 
  _exportExcel(){
    hideMenu();
    Linking.openURL('http://api.nizam.id/api/v1/transaksi/export_excel?id_user='+this.state.id_user);
  };
   componentWillUnmount() {
    this.willFocusSubscription.remove();
     BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
     NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
   }

   

   handleConnectivityChange = isConnected => {
     console.log(isConnected);
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      alert("Oops!! No Internet Connection Available");
      this.setState({ isConnected });
    }
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
      showAlertExit: false,
      id_balance: false,
    });
  };
  
  renderMonthlyHistory() {
 
   
    if (this.state.dataSource.monthly_balance.length>=1) {
      return  (
        <View style={styles.cardHome}>
          <View style={{flex:1, flexDirectio:'row'}}>
            <View style={{ marginBottom:5}}>
              <Text  style={{marginLeft: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}  ref={textRef}>{ translate('Monthly Transaction')}</Text>
              <Text  style={[styles.textGray, {marginLeft: 0,marginTop: 2,fontSize:12}]}>{ translate('Transaction history for this month')}</Text>
              <View style={{ marginLeft:'auto',marginTop:-25}}>
              <Icon    onPress={() => showMenu()}   type="ionicon" color={Colors.gray} name="md-print"/>
              </View>
            </View>
            {this.state.dataSource.monthly_balance.length>=1 ? <View>
            <Menu ref={setMenuRef}>
              <MenuItem onPress={() => this._exportExcel()}>{translate('Export to excel')}</MenuItem>
              <MenuItem onPress={hideMenu} disabled>{translate('Export to PDF')}</MenuItem>
              <MenuDivider />
              <MenuItem onPress={hideMenu}>{translate('Cancel')}</MenuItem>
            </Menu>
            <FlatList
            data={this.state.dataSource.monthly_balance}
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
                    {item.type == 'in'? <Text style={[styles.textSmall,{textAlign:'right',color: 'green', fontWeight:'bold', fontSize:10}]}> + {this.state.dataSource.currency} {currencyFormat(item.amount)}</Text>
                    : item.type == 'investment'? <Text style={[styles.textSmall,{textAlign:'right',color: '#128ce3', fontWeight:'bold', fontSize:10}]}> {this.state.dataSource.currency} {currencyFormat(item.amount)}</Text>
                    : <Text style={{textAlign:'right', color:'red', fontWeight:'bold', fontSize:10}}> - {this.state.dataSource.currency} { currencyFormat(item.amount)} </Text>}
                  </View>
                </View>
              </View>
            </View>  
          </TouchableOpacity>
          }
          keyExtractor={item => item.id_balance.toString()} />
          </View>
          :
          <EmptyData string="Let's create that !" type='home'/> }
         
          </View>
        </View>
      );
    }
  }

  render() {
    const { width } = Dimensions.get('window');
    const height = width * 0.8;
     if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator color={mainColor()}/>
        </View>
      )
    }
    return (
      <View style={[styles.container, {height:'100%'}]}>
         <AlertModal
          show={this.state.showAlertExit}
          customView={CustomAlertView(this.state.customView)}
          cancelText={translate(this.state.cancelText)}
          confirmText={translate(this.state.confirmText)}
          onCancelPressed={() => {
            this.setState({showAlertExit: false});
          }}
          onConfirmPressed={() => {
            BackHandler.exitApp();
          }}
        />
           <AlertModal
          show={this.state.showAlert}
          customView={CustomAlertView('Do you want to delete or edit ?')}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText={translate('Edit Transaction')}
          confirmText={translate('Delete Transaction')}
          onCancelPressed={() => {
            this.editAction(this.state.id_balance);
          }}
          onConfirmPressed={() => {
            this.removeAction(this.state.id_balance);
          }}
        />
        <ScrollView>
          <View style={[styles.containerIb2,{backgroundColor:mainColor()}]}>
          </View>
   
      
          <View style={styles.cardHeaderHome} >
            <View style={{flex: 1, flexDirectio:'column',justifyContent:'center'}}>
              <Text style={{  color:'#fff', fontSize:12, textAlign:'center' }}>
                {translate(this.state.condition)} {this.state.name}
              </Text>
              <Text style={{  color:'#fff', fontSize:12, textAlign:'center', marginTop:10 }}>
                {translate('Have you recorded your financial transaction today ?')}
              </Text>
            </View>
          </View>
        <View style={styles.cardHeaderHome2} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <ListItem
            title={translate('Overview')}
            titleStyle={{ fontWeight: 'bold', color:'#4d4d4d' }}
            onPress={() => this.props.navigation.push('Report')}
            containerStyle={{marginTop:-15, marginLeft:-15,backgroundColor:'rgba(0,0,0,0)'}}
            subtitle={translate('See your financial report')}
            leftIcon={
              <Icon
              name='line-chart'
              type='font-awesome'
              color={mainColor()}
              size={22} />
            }
            rightIcon={<Chevron />}
            />
          </View>
          <Divider style={{ backgroundColor: '#9c9c9c' }} />
          <View style={{flex: 1, flexDirection: 'row', marginTop:10}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:11, color:'#3b3a3a'}} >
              {translate('Income')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:10, textAlign:'right', color:'green'}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.monthly_incoming)}
              </Text>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop:8}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:11, color:'#3b3a3a'}} >
              {translate('Expense')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:10, textAlign:'right', color:'red'}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.monthly_outgoing)}
              </Text>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop:10}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:11, color:'#3b3a3a'}} >
              {translate('Deposit')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'300', textAlign:'right', color:'#3b3a3a'}} >
              {this.state.dataSource.monthly_deposit < 0 ? <Text style={{fontWeight :'600', fontSize:10, color :'red'}} >{this.state.dataSource.currency} {currencyFormat(this.state.dataSource.monthly_deposit)}</Text>
              : this.state.dataSource.monthly_deposit == 0 ? <Text style={{fontWeight :'600', fontSize:10, color :'black'}} >{this.state.dataSource.currency} {currencyFormat(this.state.dataSource.monthly_deposit)}</Text>
              : <Text  style={{fontWeight :'600', fontSize:10, color :mainColor()}} >+ {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.monthly_deposit)}</Text> }
              </Text>
            </View>
          </View>
          <Divider style={{ backgroundColor: '#e8e8e8', marginTop:10 }} />

          <View style={{flex: 1, flexDirection: 'row', marginTop:8}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:11, color:'#3b3a3a'}} >
              {translate('Total Balance')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:10, textAlign:'right', color:mainColor()}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.current_balance)}
              </Text>
            </View>
          </View>


        </View>
        <View style={[styles.cardProfile,{marginBottom:10,marginTop:-1}]}>
          <View style={{flex:1, flexDirectio:'row',}}>
              <ListItem
              title={translate('Financial Plan')}
              titleStyle={styles.titleStyle}
              subtitleStyle={styles.subtitleStyle}
              onPress={() => this.props.navigation.push('FinancialPlan')}
              containerStyle={[styles.listItemContainerNoBorder,{padding:10}]}
              subtitle={translate('Record your financial plan')}
              leftIcon={
                <Icon
                name='edit'
                type='font-awesome'
                color={mainColor()}
                size={22} />
              }
              rightIcon={<Chevron />}
              badge={{  status:'warning', value: translate('New'), textStyle: { color: 'white' }, badgeStyle: { backgroundColor:mainColor(), marginTop: 0 } }}
            />
          </View>
        </View> 


        {this.renderMonthlyHistory()}
      </ScrollView>
      {/* <TouchableOpacity
          activeOpacity={0.7}
           onPress={() => this.props.navigation.push('AddTx')}
          style={styles.TouchableOpacityStyle}>
            <View style={styles.FloatingButtonStyle}>
            <Icon
            reverse
                name='plus'
                type='font-awesome'
                color={mainColor()}
                size={20} />
          </View>
        </TouchableOpacity> */}
      </View>
    );
  }
}

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  }
});
const MyApp = createAppContainer(MyDrawerNavigator);
const RootStack = createStackNavigator({
  Home: HomeScreen,
},
  {
    initialRouteName: 'Home',
  },
  {
    headerMode: 'none',
  });
export default createAppContainer(RootStack);
