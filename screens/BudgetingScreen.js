import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView,Image,TextInput } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon,Card,Divider} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import Tabs from 'react-native-tabs';
import PureChart from 'react-native-pure-chart';
import DatePicker from 'react-native-date-ranges';
import * as Progress from 'react-native-progress';
import RBSheet from "react-native-raw-bottom-sheet";
import Moment from 'moment';
import NumericInput from '@wwdrew/react-native-numeric-textinput';
import Menu, { MenuItem, MenuDivider, Position } from "react-native-enhanced-popup-menu";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';

class App extends React.Component {
    static navigationOptions= ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            headerTitle: (
                <View>
                    <Text  style={{color:'#ffffff',fontSize:17, marginLeft:15,  fontWeight:'bold'}}>{ translate('e-Budgeting')}</Text>
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
            this.getCategory();
            this.willFocusSubscription = this.props.navigation.addListener(
              'willFocus',
              () => {
                this.setState({isLoading:true});
                this.getCategory();
              }
            );
        }
    });
    super(props);
    this.state = {
      isLoading: true,
      type: 'category',
      currentDate: '',
      text:'',
      amount:[],
      amount2:[],
      loadingBtn: false
    };
  }


  set_amount(index,value,id_category){
      const updatedArray = [...this.state.amount];
      const updatedArray2 = [...this.state.amount2];
    updatedArray[index] = value;
    updatedArray2[index] = id_category;
      this.setState({
        amount: updatedArray,
        amount2: updatedArray2,
      });
  }
    

  getCategory() {
    return fetch(GlobalSetting.url_api + '/category?type=out&view=ebudgeting&id_user='+this.state.id_user)
     .then((response) => response.json())
     .then((responseJson) => {
        this.setState({dataSource: responseJson.result}) 
        this.setState({
         isLoading: false,
        }, function(){
            console.log('data');
       });

     })
     .catch((error) =>{
       console.error(error);
     });
   }

   setTab(type) {
    this.setState({
      type: type,
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({mainColor: mainColor()});
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
   }
 
  submitInvest= () =>{ 
        this.setState({loadingBtn: true});
        var data = {  
            id_user: this.state.id_user,
            amount: this.state.amount,
            category: this.state.amount2,
        }
      console.log(data);

        var uri = GlobalSetting.url_api + '/transaksi/add_budgeting';
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
            this.getCategory();
            this.setState({loadingBtn: false,type:'category'});
            // this.props.navigation.push('FinancialPlan');
        });
  }
    renderList() {
        if(this.state.type=='category'){
      return  (
        <View style={{marginTop:10}}>
        <Card  containerStyle={{borderRadius:7}}>
        <View style={{ marginBottom:5}}>
              <Text  style={{marginLeft: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Expense Category')}</Text>
              <Text  style={[styles.textGray, {marginLeft: 0,marginTop: 2,fontSize:12}]}>{ translate('Give a limit budget for each expense category')}</Text>
            </View>
        {this.state.dataSource.map((ro ,index)=> (
        <View  key={index}  containerStyle={{borderRadius:7}}>
        
            <Divider style={{ backgroundColor: '#e0e0e0',marginTop:5, marginBottom:5 }} />

           <View style={{ flex: 1,flexDirection: 'row', marginBottom:5, marginTop:1}} >
           <View style={{flex: 1, flexDirection: 'column',marginLeft:-15}}>
                      <Icon
                      name={ro.icon}
                      type='font-awesome'
                      color={ro.color}
                      size={20}/>
                    </View>
                    <View style={{flex: 5, flexDirection: 'column',marginLeft:-5}}>
           <Text  style={[styles.textGray, {  marginBottom:5,fontSize:13, }]}>{translate(ro.category_name)}</Text> 
                    </View>
            {ro.budget_left!='' ? <Text  style={[styles.textGray,{fontSize:11,marginTop:3,marginRight:5,marginLeft: 'auto',color:mainColor()}]}>{translate('left')+' Rp '+ currencyFormat(ro.budget_left)}</Text>: null}
            </View>
          
            <View>
            <Progress.Bar progress={ro.progress} width={null} color={ro.color} animated={true} borderColor='#ffffff' unfilledColor='#e0e0e0' />
            </View>

            <View style={{ flex: 1,flexDirection: 'row',marginBottom:5}} >
            <Text style={[styles.textGray,{fontSize:11}]}>{'Rp '+ currencyFormat(parseInt(ro.expense))}</Text>
            {ro.limitation!='' ? <Text style={[styles.textGray,{fontSize:11,marginLeft: 'auto'}]}>{'Rp '+ currencyFormat(ro.limitation)}</Text>: <Text style={[styles.textGray,{fontSize:11,marginLeft: 'auto'}]}>{'Unlimited'}</Text>}
            
            </View>
        </View>
      
        ))}
        </Card>
      </View>
      )
    }else{  
        return  (
            <View style={{marginTop:10}}>
                     
            <Card  containerStyle={{borderRadius:7}}>
            <View style={{ marginBottom:5}}>
            <Text  style={{marginLeft: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Expense Category')}</Text>
              <Text  style={[styles.textGray, {marginLeft: 0,marginTop: 2,fontSize:12}]}>{ translate('Give a limit budget for each expense category')}</Text>
                </View>
            {this.state.dataSource.map((ro ,index)=> (
            <View  key={index}  containerStyle={{borderRadius:7}}>
            <FormInput label={ro.category_name} onChangeText={(amount) =>  this.set_amount(index,amount,ro.id_category)} value={this.state.amount[index] ? this.state.amount[index] : null} type="numeric"/>
            </View>
          
            ))}
             <Button 
            title={translate('Submit')}
            buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
            containerStyle={{marginRight :0, marginTop:15}}
            titleStyle={{color:'#fff'}}
            onPress={this.submitInvest}
            loading={this.state.loadingBtn}
            />
            </Card>
          </View>
          )  
    }
    }

  renderContent() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator color={mainColor()}/>
        </View>
      )
    }
    return (
    <View style={[styles.container]}>
        <View>
        <KeyboardAwareScrollView extraScrollHeight={100} scrollEnabled={true}
enableAutomaticScroll={true} enableOnAndroid={true} keyboardShouldPersistTaps='handled'  style={{height:'93%'}}>
            {this.renderList()}
            </KeyboardAwareScrollView> 
        </View> 
  </View>
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Tabs selected={this.state.type} style={{backgroundColor:'white', elevation:2}}
          selectedStyle={{color:mainColor()}} onSelect={el=>this.setTab(el.props.name)}>
          <Text name="category" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{translate('Category')}</Text>
          <Text name="settings" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('Settings')}</Text>
        </Tabs>
        {this.renderContent()}
      </View>
    )
  }
}
export default App;  
