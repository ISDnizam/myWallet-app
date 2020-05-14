import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView,FlatList,Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon,Card,Divider} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import Chevron from '../components/Chevron';
import { Linking } from 'expo';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import Tabs from 'react-native-tabs';
import PureChart from 'react-native-pure-chart';
import DatePicker from 'react-native-date-ranges';
import Moment from 'moment';
import RBSheet from "react-native-raw-bottom-sheet";
import NumericInput from '@wwdrew/react-native-numeric-textinput';
import EmptyData from '../components/EmptyData';
import FormInput from '../components/FormInput';

class App extends React.Component {
  static navigationOptions= ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
        headerTitle: (
            <View>
                <Text  style={{color:'#ffffff',fontSize:17, marginLeft:15, fontWeight:'bold'}}>{ translate('Asset')}</Text>
            </View>
            ),
    headerRight: (
      <View style={styles.iconContainer}>
        <Icon  containerStyle={{marginLeft:65}}  onPress={() => navigation.push('AddTx',{type:'asset'})}  type="font-awesome" color='#ffffff' name="plus" />
      </View>
    ),

     headerStyle: {
      elevation : 0,
    backgroundColor: params.mainColor,
    },
    headerTintColor: '#fff',
    }
  };
  constructor(props) {
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
    this.state = {
      isLoading: true,
      price: '',
      description:'',
      id_balance:'',
      loadingBtn:false
    };
  }
  getData() {
    return fetch(GlobalSetting.url_api + '/transaksi/assets?id_user=' + this.state.id_user)
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


  componentDidMount() {
    this.props.navigation.setParams({mainColor: mainColor()});
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
   }
 
  openModal(id_balance,description) {
    console.log(id_balance);
    this.setState({id_balance:id_balance,description:description});
    console.log('maximum');
    this.Status.open();
  }
  sellAsset= () =>{ 
      this.setState({loadingBtn: true});
      var data = {  
          id_user: this.state.id_user,
          amount: this.state.price,
          id_balance: this.state.id_balance,
          description: translate('Sell Asset')+' '+this.state.description,
          id_category: 16,
          date_usage : Moment().format('YYYY-MM-DD HH:mm:ss')
      }
      var uri = GlobalSetting.url_api + '/transaksi/edit/'+this.state.id_balance;
      fetch(uri, {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
      }).then((response) => response.json())
          .then((responseJson) => {
          this.Status.close();
          this.setState({loadingBtn: false,amount:''});
          // this.props.navigation.push('FinancialPlan');
          this.getData();
          console.log(responseJson);
      });
}
  renderContent() {
    return (
    <View style={[styles.container]}>
      <ScrollView style={{height:'83%'}}>
      <View style={{marginTop:10}}>
      {this.state.dataSource.history.map((ro ,index)=> (
            // <TouchableOpacity  key={index} onPress={() => this.props.navigation.push('DetailPromotion', {'id_bazar' : ro.id_investmen})}>
        <Card  key={index}  containerStyle={{borderRadius:7}} imageStyle={{height:120}}
            image={require('../assets/images/asset.png')}>

           <View style={{ flex: 1,flexDirection: 'row',marginTop:-47, marginBottom:10}}>
               <View style={{backgroundColor:ro.color, marginLeft:-10,marginTop:12,	borderTopRightRadius: 18,}}>
           <Text  style={[styles.textGray, { fontWeight:'bold', fontSize:11, color:'white',padding:5}]}>
               {translate(ro.category_name)}
            </Text>
            </View>
             <Button 
              title={translate('Sell')}
              buttonStyle={{borderRadius:5,height:27, padding:5,width:65,backgroundColor:mainColor()}}
              containerStyle={{marginRight :-3, marginLeft: 'auto'}}
              titleStyle={{color:'#fff', fontWeight:'normal',fontSize:12}}
              onPress={() => this.openModal(ro.id_balance,ro.description)}
            /> 
            </View>
          

            <View style={{ flex: 1,flexDirection: 'row'}} >
            <Text style={styles.textGray}>{ro.description}</Text>
            <Text style={[styles.textGray,{fontSize:12,marginLeft: 'auto',fontWeight:'bold'}]}>{'Rp '+ currencyFormat(ro.amount)}</Text>
            </View>
          </Card>
        //   </TouchableOpacity>
        ))}
      </View>
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
          <View style={[styles.tabBarInfoContainer,{padding:10, height:50}]}  >
            
            <View style={{flex: 1, flexDirection: 'row', marginTop:2}}>
            
            <View style={{flex: 2, flexDirection: 'column'}}>
            {/* <Icon
            reverse
            name='user'
            type='font-awesome'
            color='#e8e9eb'
            containerStyle={{marginTop:-30}}
            // style={{marginTop:-40}}
            size={12} /> */}
              <Text style={{fontWeight :'600',  padding:5, fontSize:12, color:'#3b3a3a'}} >
              {translate('Total Asset')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, textAlign:'right', padding:5,  color:mainColor()}} >
              {'Rp '+currencyFormat(this.state.dataSource.total_asssets)}
              </Text>
            </View>
          </View>

          </View>

        <RBSheet
        ref={ref => {
          this.Status = ref;
        }}
        height={200}
        closeOnDragDown={false}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 15,
          }
        }}>
        <View>
          <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold', marginBottom:2}}>{ translate('Sell Asset') } </Text>
          <Text  style={[styles.textGray,   {fontSize:12, marginBottom:7}]}>{translate(this.state.description)} </Text>
          <Divider style={{ backgroundColor: '#d4d2d2', marginBottom:10 }} />
          <ScrollView style={{marginBottom:20}}>
          <FormInput label={'Price'} onChangeText={price => this.setState({price})}  value={this.state.price} type="numeric" divider={false}/>
        
        <Button 
            onPress={this.sellAsset}
            title={translate('Sell Asset')}
            buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
            containerStyle={{marginRight :0, marginTop:15}}
            titleStyle={{color:'#fff'}}
            loading={this.state.loadingBtn}
            /> 

            </ScrollView>
          
          </View>
        </RBSheet>

        {this.state.dataSource.history.length >=1 ?  this.renderContent() : <EmptyData string='Press + to add your currently asset' type='asset'/>}
      </View>
    )
  }
}
export default App;  
