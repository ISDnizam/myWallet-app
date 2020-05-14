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
import EmptyData from '../components/EmptyData';

class App extends React.Component {
    static navigationOptions= ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            headerTitle: (
                <View>
                    <Text  style={{color:'#ffffff',fontSize:17, marginLeft:-10, fontWeight:'bold'}}>{ translate('Financial Plan')}</Text>
                </View>
                ),
        headerRight: (
          <View style={styles.iconContainer}>
            <Icon  containerStyle={{marginLeft:65}}  onPress={() => navigation.navigate('InvestmentCategory')}  type="font-awesome" color='#ffffff' name="plus" />
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
            this.getBalance('progress');

            this.willFocusSubscription = this.props.navigation.addListener(
                'willFocus',
                () => {
                  this.setState({isLoading:true});
                  this.getBalance('progress');
                }
              );
        }
    });
    super(props);
    this.state = {
      isLoading: true,
      type: 'progress',
      currentDate: '',
      text:'',
      amount:'',
      loadingBtn: false,
      textAmount: 'Amount Investment',
      textButton: 'Invest'
    };
  }
  

  componentWillUnmount() {
    this.willFocusSubscription.remove();
   }


  getBalance(status) {
    var uri = GlobalSetting.url_api + '/investment?id_user=' + this.state.id_user+'&status='+status;
    return fetch(uri)
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
        isLoading: true,
      type: type,
    });
    this.getBalance(type);
  }

  
  openModal(id_investment,category_name,id_category,amount_investment,total_investment) {
    var maximum = parseInt(total_investment)-parseInt(amount_investment);
    if(id_category==55){
     var  textAmount= 'How much will be paid';
    }else{
     var  textAmount= 'Amount Investment';
    }
    this.setState({textAmount:textAmount,category_name:category_name,id_investment:id_investment,id_category:id_category,amount_investment:amount_investment,total_investment:total_investment,maximum:maximum});
    console.log(maximum);

    console.log('maximum');
    this.Status.open();
  }

  componentDidMount() {
    this.props.navigation.setParams({mainColor: mainColor()});
  }
  submitInvest= () =>{ 
      console.log(this.state.maximum);
      console.log(this.state.amount);
    if(this.state.amount <=this.state.maximum){
        if(this.state.amount==this.state.maximum){
            var status='completed';
        }else{
            var status='progress';
        }
        this.setState({loadingBtn: true});
        var data = {  
            id_investment: this.state.id_investment,
            id_user: this.state.id_user,
            amount: this.state.amount,
            status: status,
            description: translate('Invest'),
            id_category: this.state.id_category,
            date_usage : Moment().format('YYYY-MM-DD HH:mm:ss')
        }
        var uri = GlobalSetting.url_api + '/transaksi/store';
        fetch(uri, {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
        }).then((response) => response.json())
            .then((responseJson) => {
            this.getBalance(this.state.type);
            this.Status.close();
            this.setState({loadingBtn: false,amount:''});
            // this.props.navigation.push('FinancialPlan');
        });
    }else{
        alert('Maximum '+this.state.maximum);
    }
  }
    renderList() {
        let textRef = React.createRef();
        let menuRef = null;
        console.log(textRef);
        console.log(menuRef);
        const setMenuRef = ref => menuRef = ref;
        const hideMenu = () => menuRef.hide();
        const showMenu = () => menuRef.show(textRef.current, stickTo = Position.BOTTOM_RIGHT);
      return  (
        <View style={{marginTop:10}}>
        {this.state.dataSource[this.state.type].map((ro ,index)=> (
            // <TouchableOpacity  key={index} onPress={() => this.props.navigation.push('DetailPromotion', {'id_bazar' : ro.id_investmen})}>
        <Card  key={index}  containerStyle={{borderRadius:7}} imageStyle={{height:140}}
            image={require('../assets/images/illustration5.png')}>

           <View style={{ flex: 1,flexDirection: 'row',marginTop:-47, marginBottom:10}}>
               <View style={{backgroundColor:ro.color, marginLeft:-10,marginTop:12,	borderTopRightRadius: 18,}}>
           <Text  style={[styles.textGray, { fontWeight:'bold', fontSize:11, color:'white',padding:5}]}>
               {translate(ro.category_name)}
            </Text>
            </View>
            {ro.status=='progress' ? <Button 
              title={ro.id_category==55 ? translate('Pay'):translate('Invest')}
              buttonStyle={{borderRadius:5,height:27, padding:5,width:65,backgroundColor:mainColor()}}
              containerStyle={{marginRight :-3, marginLeft: 'auto'}}
              titleStyle={{color:'#fff', fontWeight:'normal',fontSize:12}}
              onPress={() => this.openModal(ro.id_investment, ro.category_name,ro.id_category,ro.amount_investment,JSON.parse(ro.additional_data).total_investment)}
            /> : null }

            </View>
            
           <View style={{ flex: 1,flexDirection: 'row', marginBottom:5, marginTop:1}} >
           {ro.id_category==51 ? <Text  style={[styles.textGray, {  marginBottom:5,fontSize:13, }]}>{translate(JSON.parse(ro.additional_data).status)}</Text> 
            : ro.id_category==52 ? <Text  style={[styles.textGray, {  marginBottom:5,fontSize:13, }]}>{translate(JSON.parse(ro.additional_data).item_name)}</Text> 
            : ro.id_category==56 ? <Text  style={[styles.textGray, {  marginBottom:5,fontSize:13, }]}>{translate(JSON.parse(ro.additional_data).destination)}</Text>
            : ro.id_category==57 ? <Text  style={[styles.textGray, {  marginBottom:5,fontSize:13, }]}>{translate(JSON.parse(ro.additional_data).bride_name)}</Text> 
            : <View></View> }
           
            {ro.id_category==52 || ro.id_category==55 || ro.id_category==56 || ro.id_category==57 || ro.id_category==59 ? <Text  style={[styles.textGray,{fontSize:12,marginTop:3,marginRight:5,marginLeft: 'auto',color:mainColor()}]}>{'Rp '+ currencyFormat(JSON.parse(ro.additional_data).monthly_investment)+'/'+translate('Month')}</Text>
            : <View></View> }
             
            </View>
          
            <View>
            <Progress.Bar progress={ro.progress} width={null} color={mainColor()} animated={true} borderColor='#ffffff' unfilledColor='#e0e0e0' />
            <Divider style={{ backgroundColor: '#e0e0e0',marginTop:5, marginBottom:5 }} />
            </View>

            <View style={{ flex: 1,flexDirection: 'row'}} >
            <Text style={styles.textGray}>{translate('Saved up')+' Rp '+ currencyFormat(parseInt(ro.amount_investment))}</Text>
            <Text style={[styles.textGray,{fontSize:12,marginLeft: 'auto'}]}>{'Rp '+ currencyFormat(JSON.parse(ro.additional_data).total_investment)}</Text>
            </View>
          </Card>
        //   </TouchableOpacity>
      
        ))}
      </View>
      );
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
        {this.state.dataSource[this.state.type].length >=1 ? <View>
            <ScrollView style={{height:'93%'}}>
            {this.renderList()}
            </ScrollView> 
        </View>  : <EmptyData string='Press + to create financial plan' type='investment'/>
        }
  </View>
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Tabs selected={this.state.type} style={{backgroundColor:'white', elevation:2}}
          selectedStyle={{color:mainColor()}} onSelect={el=>this.setTab(el.props.name)}>
          <Text name="progress" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{translate('On Progress')}</Text>
          <Text name="completed" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('Completed')}</Text>
        </Tabs>
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
          <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold', marginBottom:2}}>{ translate('Investment') } </Text>
          <Text  style={[styles.textGray,   {fontSize:12, marginBottom:7}]}>{translate(this.state.category_name)} </Text>
          <Divider style={{ backgroundColor: '#d4d2d2', marginBottom:10 }} />
          <ScrollView style={{marginBottom:20}}>
              
    <Text style={{color:'#bdbbbb', textAlign:'left'}}>
    {translate(this.state.textAmount)} 
        </Text>
        <NumericInput
          type='decimal'
          decimalPlaces={0}
          value={this.state.amount}
          placeholder={translate('Maximum')+ ' Rp '+currencyFormat(this.state.maximum)}
          placeholderTextColor = "#e2e2e2"
          selectionColor={mainColor()}
          onUpdate={(amount) =>  this.setState({amount : amount})}
        />
        

        <Button 
            onPress={this.submitInvest}
            title="Submit"
            buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
            containerStyle={{marginRight :0, marginTop:15}}
            titleStyle={{color:'#fff'}}
            loading={this.state.loadingBtn}
            /> 

            </ScrollView>
          
          </View>
        </RBSheet>
        {this.renderContent()}
      </View>
    )
  }
}
export default App;  
