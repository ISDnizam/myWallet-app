import React from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import styles from "../components/Style";
import { Avatar, ListItem , Button, Icon} from 'react-native-elements';
import GlobalSetting from '../components/GlobalSetting';
import Chevron from '../components/Chevron';
import { Linking } from 'expo';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import Tabs from 'react-native-tabs';
import PureChart from 'react-native-pure-chart';
import DatePicker from 'react-native-date-ranges';
class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: translate('Report'),
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
            });
            this.getBalance('');
        }
    });
    super(props);
    this.state = {
      isLoading: true,
      type: 'all',
      currentDate: '',
    };
  }




  getBalance(value) {
    if(value){
    var uri = GlobalSetting.url_api + '/getBalance?id_user=' + this.state.id_user+'&startDate='+value.startDate+'&endDate='+value.endDate;
    }else{
      var uri = GlobalSetting.url_api + '/getBalance?id_user=' + this.state.id_user;
    }
    console.log(uri);

    return fetch(uri)
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

   setTab(type) {
    this.getBalance('');
    this.setState({
      type: type,
    });
  }

  UpdateChart(value) {
    this.setState(value);
    this.getBalance(value);
  }

  renderDepositChart(){
    let sampleData = [
      {
        seriesName: translate('Deposit'),
        data:this.state.dataSource.depositeChart,
        color: mainColor(),
      }
    ]
    if(this.state.dataSource.depositeChart){
    return(
      <View style={styles.cardHome}>
      <View style={{flex:1, flexDirectio:'row'}}>
        <View style={{position: 'relative'}}>
          <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Deposit')}</Text>
        </View>
        <View style={{marginTop:20}}>
  
        <PureChart data={sampleData} type='bar' height={150} width='100%'/>
        </View>
        </View>
      </View>
  
    )
    }
  }

  renderIncomeExpenseChart(){
    let sampleData = [
      {
        seriesName: translate('Income'),
        data:this.state.dataSource.incomeChart,
        color: '#71bf73'
      },
      {
        seriesName: translate('Expense'),
        data:this.state.dataSource.expenseChart,
        color: '#de7062'
      }
    ]
    return(
      <View style={styles.cardHome}>
      <View style={{flex:1, flexDirectio:'row'}}>
        <View style={{position: 'relative'}}>
          <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{translate('Income')} Vs {translate('Expense')}</Text>
        </View>
        <View style={{marginTop:20}}>
  
        <PureChart data={sampleData} type='bar'/>
        </View>
        </View>
      </View>
    )
  }
  renderCategoryOut(){
    let sampleData = this.state.dataSource.categoryChart;
    return(
      <View style={styles.cardHome}>
      <View style={{flex:1, flexDirectio:'row'}}>
      
        <View style={{flex: 2, flexDirection: 'column'}}>
        <Text  style={{color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Top Expense Category')}</Text>
        </View>
        <View style={{flex: 4, flexDirection: 'column', marginTop:-15}} >
        <Text  style={{color:'#4f70c2',fontSize:11, fontWeight:'bold',  textAlign:'right'}}   onPress={() => this.props.navigation.push('ReportCategory', { type: 'out',startDate:this.state.startDate,endDate:this.state.endDate })}>{ translate('Detail')}</Text>
        </View>


        <View style={{marginTop:20,justifyContent:'center',textAlign:'center'}}>
        <PureChart data={sampleData} type='line' />
        </View>
        </View>
      </View>
  
    )
  }
  renderCategoryIn(){
    let sampleData = this.state.dataSource.categoryChartIn;
    return(
      <View style={styles.cardHome}>
      <View style={{flex:1, flexDirectio:'row'}}>
        <View style={{flex: 2, flexDirection: 'column'}}>
        <Text  style={{color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Top Income Category')}</Text>
        </View>
        <View style={{flex: 4, flexDirection: 'column', marginTop:-15}} >
        <Text  style={{color:'#4f70c2',fontSize:11, fontWeight:'bold',  textAlign:'right'}}   onPress={() => this.props.navigation.push('ReportCategory', { type: 'in',startDate:this.state.startDate,endDate:this.state.endDate })}>{ translate('Detail')}</Text>
        </View>

        <View style={{marginTop:20,justifyContent:'center',textAlign:'center'}}>
        <PureChart data={sampleData} type='line' />
        </View>
        </View>
      </View>
  
    )
  }
    renderList() {
      if(this.state.type=='monthly'){
      return  (
        <View style={{marginTop:10}}>
        {this.state.dataSource.report.map((ro ,index)=> (
          <View style={styles.cardProfile2}   key={index} >
            <View style={{flex:1, flexDirectio:'row',}}>
                <ListItem
                title={translate(ro.month)}
                subtitle={'Deposite '+ this.state.dataSource.currency+' '+ currencyFormat(ro.total_deposit)}
                titleStyle={{ fontWeight: 'bold', color:'#4d4d4d' }}
                onPress={() => this.props.navigation.push('DetailTx', { month: ro.month.toUpperCase(), date: ro.date, })}
                containerStyle={styles.listItemContainerNoBorder}
                leftAvatar={<Avatar rounded large   overlayContainerStyle={{backgroundColor: mainColor()}}  height={45} width={45}  title={ro.year} titleStyle={{color:'white', fontSize:12, position:'relative'}} />}
               
                  
                rightIcon={<Chevron />}
                />
            </View>
          </View> 
        ))}
      </View>
      );
      }else{
        return  (
          <View style={{marginTop:10}}>
          <DatePicker
            style={ { width: 350, height: 45 } }
            customStyles = { {
              placeholderText:{ fontSize:12 }, // placeHolder style
              headerStyle : { backgroundColor:mainColor() }	,
              headerMarkTitle : { color:'#ffffff'  },
              ButtonStyle: {color: mainColor()},
              selectedTextColor: '#9c9c9c',		// title container style
            } } // optional 
            centerAlign // optional text will align center or not
            allowFontScaling = {false} // optional
            placeholder={translate('Select Date')}
            onConfirm ={(value) => this.UpdateChart(value)}
            mode={'range'}
          />

        {this.renderDepositChart()}
        {this.renderIncomeExpenseChart()}
        {this.renderCategoryOut()}
        {this.renderCategoryIn()}
          </View> 

        );
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
      <ScrollView style={{height:'83%'}}>
      {this.renderList()}
    </ScrollView>
  </View>
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Tabs selected={this.state.type} style={{backgroundColor:'white', elevation:2}}
          selectedStyle={{color:mainColor()}} onSelect={el=>this.setTab(el.props.name)}>
          <Text name="monthly" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{translate('Monthly')}</Text>
          <Text name="all" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('All Transaction')}</Text>
        </Tabs>
        {this.renderContent()}
      </View>
    )
  }
}

export default ProfileScreen;  
