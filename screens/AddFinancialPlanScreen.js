import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView, TextInput, Image,Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon, Divider} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import Chevron from '../components/Chevron';
import { mainColor, currencyFormat,CustomAlertView }  from '../components/GlobalFunction';
import AwesomeAlert from 'react-native-awesome-alerts';
import RBSheet from "react-native-raw-bottom-sheet";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';
import { translate } from 'react-native-translate';

const win = Dimensions.get('window');

 class App extends React.Component {
  static navigationOptions= ({navigation}) => {
    var category_name =navigation.getParam('category_name', 'Add Financial Plan');
    const {params = {}} = navigation.state;
    return {
    headerTitle: (
        <View>
            <Text  style={{color:'#ffffff',fontSize:17, marginLeft:-10, fontWeight:'bold'}}>{ translate(category_name)}</Text>
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
                // lang: 'English',
            });
        }
    });
    super(props);
    this.state = {
      email: '',
      name: '',
      id_user: '',
      id_category: this.props.navigation.getParam('id_category', ''),
      isLoading: false,
      text_alert:'',

      status: 'Status',
      amount:'',
      showAlert:false,
      id_status:'',
      total:'',

      item_name:'',
      item_price:'',

      loan_principal:'',
      loan_interest:'',

      current_funds: 0,
      monthly_investment :'',
      investment_duration:'',
      destination:'',
      
      costs_needed: '',
      long_married: '',
      bride_name:'',
    };
  }

  setStatus(status,id_status){
    this.setState({status: status,id_status:id_status});
    this.Status.close();
  }
  Calculation= () =>{ 
    if(this.state.current_funds==NaN){
      this.setState({current_funds: 0});
    }
    console.log(this.state.current_funds);
    if(this.state.id_category==51){
      if(this.state.id_status==1){
       var sum = 6;
      }else if(this.state.id_status==2){
      var sum = 9;
      }else if(this.state.id_status==3){
      var sum = 12;
      }
     var total = this.state.amount*sum;
     var text_alert = translate('Emergency funds that you need is')+  ' Rp '+currencyFormat(parseInt(total));
    }else if(this.state.id_category==52){
      var less = this.state.item_price-this.state.current_funds;
      var monthly_investment = less/this.state.investment_duration;
      var total = this.state.item_price;
      var text_alert = translate('Kekurangan dana sebesar')+  ' Rp '+currencyFormat(parseInt(less))+', '+ 'anda harus menabung sebesar'+' Rp '+currencyFormat(parseInt(monthly_investment))+' '+'tiap bulan selama '+this.state.investment_duration+' '+'bulan';
      this.setState({monthly_investment: monthly_investment});
    }else if(this.state.id_category==53 ||  this.state.id_category==56){
      var less = this.state.total_investment-this.state.current_funds;
      var monthly_investment = less/this.state.investment_duration;
      var total = this.state.total_investment;
      if(this.state.id_category==53){
        var text_alert = translate('Kekurangan dana perjalanan umrah sebesar')+' Rp '+currencyFormat(parseInt(less))+', '+ 'anda harus menabung sebesar'+' Rp '+currencyFormat(parseInt(monthly_investment))+' '+'tiap bulan selama '+this.state.investment_duration+' '+'bulan';
      }else if(this.state.id_category==56){
        var text_alert = translate('Kekurangan dana perjalanan ke ')+this.state.destination+' sebesar Rp '+currencyFormat(parseInt(less))+', '+ 'anda harus menabung sebesar'+' Rp '+currencyFormat(parseInt(monthly_investment))+' '+'tiap bulan selama '+this.state.investment_duration+' '+'bulan';
      }
      this.setState({monthly_investment: monthly_investment});
    }else if(this.state.id_category==55){
      var pokok = this.state.loan_principal/this.state.investment_duration;
      var bunga = this.state.loan_principal*this.state.loan_interest/100;
      var angsuran = pokok+bunga;
      var total = angsuran*this.state.investment_duration;
      var text_alert = translate('Dengan bunga pinjaman jenis flat/fix, Angsuran tiap bulan yang harus dibayarkan adalah')+' Rp '+currencyFormat(parseInt(angsuran))+', angsuran dilakukan selama '+this.state.investment_duration+' '+'bulan';
      this.setState({monthly_investment: angsuran});
    }else if(this.state.id_category==57){
      var less = this.state.costs_needed-this.state.current_funds;
      var monthly_investment = less/this.state.long_married;
      var total = this.state.costs_needed;
      var text_alert = translate('Kekurangan dana pernikahan sebesar')+  ' Rp '+currencyFormat(parseInt(less))+', '+ 'anda harus menabung sebesar'+' Rp '+currencyFormat(parseInt(monthly_investment))+' '+'tiap bulan selama '+this.state.long_married+' '+'bulan';
      this.setState({monthly_investment: monthly_investment});
    }else if(this.state.id_category==59){
      var total = this.state.monthly_investment*this.state.investment_duration+this.state.current_funds;
     var text_alert = 'Jika anda sudah menabung sebesar  Rp '+currencyFormat(parseInt(this.state.current_funds))+', '+'dan tiap bulan rutin menabung sebesar  Rp '+currencyFormat(parseInt(this.state.monthly_investment))+',  maka selama '+this.state.investment_duration+' bulan anda akan mendapatkan  Rp '+currencyFormat(parseInt(total));

    }
     this.setState({total: total,showAlert: true,text_alert:text_alert});
  }


  submitFinancial(){
    var data = {  
      monthly_expenses: this.state.amount,
      status: this.state.status,
      id_category: this.state.id_category,
      id_user: this.state.id_user,
    
      item_name: this.state.item_name,
      item_price: this.state.item_price,
    
      destination: this.state.destination,

      name: this.state.name,

      loan_principal: this.state.loan_principal,
      loan_interest: this.state.loan_interest,

      costs_needed: this.state.costs_needed,
      long_married: this.state.long_married,
      bride_name: this.state.bride_name,

      current_funds: this.state.current_funds,
      monthly_investment: this.state.monthly_investment,
      investment_duration: this.state.investment_duration,
      total_investment: this.state.total,
    }
    console.log(data);

    var uri = GlobalSetting.url_api + '/investment/add_financial_plan';
    fetch(uri, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
    }).then((response) => response.json())
        .then((responseJson) => {
          this.setState({showAlert: false});
          this.props.navigation.push('FinancialPlan');
        });

  }
  componentDidMount() {
    this.props.navigation.setParams({mainColor: mainColor()});
  }
  renderFormEmergencyFund(){
    return  (
      <View>
        <FormInput label={'Monthly Expenses'} onChangeText={amount => this.setState({amount})}  value={this.state.amount} type="numeric"/>
        <FormInput label={'Status'} onChangeText={() => this.Status.open()}  value={this.state.status} type="view"/>
      </View>
    )
  }
  renderFormRoutineSavings(){
    return  (
      <View>
        <FormInput label={'Current Funds'} onChangeText={current_funds => this.setState({current_funds})}  value={this.state.current_funds} type="numeric"/>
        <FormInput label={'Monthly Investment'} onChangeText={monthly_investment => this.setState({monthly_investment})}  value={this.state.monthly_investment} type="numeric"/>
        <FormInput label={'Investment Duration (Month)'} onChangeText={investment_duration => this.setState({investment_duration})}  value={this.state.investment_duration} type="numeric"/>
      </View>
    )
  }
  renderFormBuyThings(){
    return  (
      <View>
        <FormInput label={'Item Name'} onChangeText={item_name => this.setState({item_name})}  value={this.state.item_name}/>
        <FormInput label={'Item Price'} onChangeText={item_price => this.setState({item_price})}  value={this.state.item_price} type="numeric"/>
        <FormInput label={'Current Funds'} onChangeText={current_funds => this.setState({current_funds})}  value={this.state.current_funds} type="numeric"/>
        <FormInput label={'Buy Duration (Month)'} onChangeText={investment_duration => this.setState({investment_duration})}  value={this.state.investment_duration} type="numeric"/>
      </View>
    )
  }
  renderFormHoliday(){
    return  (
      <View>
        <FormInput label={'Destination Location'} onChangeText={destination => this.setState({destination})}  value={this.state.destination}/>
        <FormInput label={'Travel Expense'} onChangeText={total_investment => this.setState({total_investment})}  value={this.state.total_investment} type="numeric"/>
        <FormInput label={'Current Funds'} onChangeText={current_funds => this.setState({current_funds})}  value={this.state.current_funds} type="numeric"/>
        <FormInput label={'How much longer you will be on vacation'} onChangeText={investment_duration => this.setState({investment_duration})}  value={this.state.investment_duration} type="numeric"/>
      </View>
    )
  }

  renderFormUmrah(){
    return  (
      <View>
        <FormInput label={'Your Name'} onChangeText={name => this.setState({name})}  value={this.state.name}/>
        <FormInput label={'Cost during Umrah'} onChangeText={total_investment => this.setState({total_investment})}  value={this.state.total_investment} type="numeric"/>
        <FormInput label={'Current Funds'} onChangeText={current_funds => this.setState({current_funds})}  value={this.state.current_funds} type="numeric"/>
        <FormInput label={'How much longer are you going  Umrah'} onChangeText={investment_duration => this.setState({investment_duration})}  value={this.state.investment_duration} type="numeric"/>
      </View>
    )
  }


  
  renderFormDebt(){
    return  (
      <View>
        <FormInput label={'Loan principal'} onChangeText={loan_principal => this.setState({loan_principal})}  value={this.state.loan_principal} type="numeric"/>
        <FormInput label={'Loan interest % per Month'} onChangeText={loan_interest => this.setState({loan_interest})}  value={this.state.loan_interest} type="numeric"/>
        <FormInput label={'Period of time (Month)'} onChangeText={investment_duration => this.setState({investment_duration})}  value={this.state.investment_duration} type="numeric"/>
      </View>
    )
  }

  renderFormMarried(){
    return  (
      <View>
        <FormInput label={'Bride and Groom Name'} onChangeText={bride_name => this.setState({bride_name})}  value={this.state.bride_name}/>
        <FormInput label={'Costs Needed'} onChangeText={costs_needed => this.setState({costs_needed})}  value={this.state.costs_needed} type="numeric"/>
        <FormInput label={'Current Funds'} onChangeText={current_funds => this.setState({current_funds})}  value={this.state.current_funds} type="numeric"/>
        <FormInput label={'How long you will be married (Month)'} onChangeText={long_married => this.setState({long_married})}  value={this.state.long_married} type="numeric"/>
      </View>
    )
  }
    renderContent() {
     var icon =  this.props.navigation.getParam('icon', '');
     var id_category =  this.props.navigation.getParam('id_category', '');
      return  (
      <View>
        <View style={[styles.cardProfileHeader60,{marginTop:50}]} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <View style={{alignItems:'center'}}>
              <Icon
              reverse
              containerStyle={{ marginTop: -50}}
              name={icon}
              type='font-awesome'
              color={mainColor()}
              size={30} />
            </View>
            {id_category==51 ? this.renderFormEmergencyFund() 
            : id_category==52 ? this.renderFormBuyThings()
            : id_category==53 ? this.renderFormUmrah()
            : id_category==55 ? this.renderFormDebt()
            : id_category==56 ? this.renderFormHoliday()
            : id_category==57 ? this.renderFormMarried()
            :  id_category==59 ? this.renderFormRoutineSavings()
            : this.renderFormEmergencyFund() }
            <Button 
              title={translate('Calculation')}
              buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
              containerStyle={{marginRight :0, marginTop:15}}
              titleStyle={{color:'#fff'}}
              onPress={this.Calculation}
              // loading={this.state.isLoading}
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
    return (
    <View style={[styles.containerGray]}>
      <AwesomeAlert
        show={this.state.showAlert}
        alertContainerStyle={{zIndex:9999,  height:win.height, width:win.width}}
        overlayStyle={{ flex: 1,
          position: 'absolute',
          opacity: 0.8,
          backgroundColor: 'black'}}
        contentContainerStyle={{height:win.height+5, width:win.width}}
        showProgress={false}
        customView={CustomAlertView(this.state.text_alert)}
        // message={translate('Are you sure you want to Sign Out ?')}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText={translate('Cancel')}
        confirmText={translate('Add & Save')}
        confirmButtonColor={mainColor()}
        cancelButtonColor='#9e0e0e'
        onCancelPressed={() => {
          this.setState({showAlert: false});
        }}
        confirmButtonTextStyle={{fontWeight:'bold'}}
        cancelButtonTextStyle={{fontWeight:'bold'}}
        onConfirmPressed={() => {
          this.submitFinancial();
        }}
      />
     <RBSheet
        ref={ref => {
          this.Status = ref;
        }}
        height={190}
        closeOnDragDown={false}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 15,
          }
        }}>
        <View>
          <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold', marginBottom:15}}>{ translate('Status') } </Text>
          <Divider style={{ backgroundColor: '#d4d2d2' }} />
          <ScrollView style={{marginBottom:20}}>
              <TouchableOpacity
                key={1}
                onPress={() => this.setStatus(translate('Single'),1)}
                >
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    color={mainColor()}
                    type='font-awesome'
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-12}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}>{translate('Single')}</Text>
                  </View>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                key={2}
                onPress={() => this.setStatus(translate('Married'),2)}>
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    color={mainColor()}
                    type='font-awesome'
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> 
                      {translate('Married')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                key={3}
                onPress={() => this.setStatus(translate('Married and have children'),3)}>
                <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                  <View style={{flex: 1, flexDirection: 'column'}}>
                    <Icon
                    name='circle'
                    color={mainColor()}
                    type='font-awesome'
                    size={20}/>
                  </View>
                  <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                    <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> 
                      {translate('Married and have children')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          
          </View>
        </RBSheet>
       
        <KeyboardAwareScrollView extraScrollHeight={100} scrollEnabled={true}
enableAutomaticScroll={true} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
        {this.renderContent()}
        </KeyboardAwareScrollView>
   
    </View>
    );
  }
}

export default App;  
