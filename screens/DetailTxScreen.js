import React, { Component } from 'react';
import { Alert,FlatList, AsyncStorage, ScrollView, ActivityIndicator, Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import GlobalSetting from '../components/GlobalSetting';
import { Avatar, Header , Icon, Divider,ListItem} from 'react-native-elements';
import styles from "../components/Style";
import Tabs from 'react-native-tabs';
import { translate } from 'react-native-translate';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import Moment from 'moment';
import PureChart from 'react-native-pure-chart';
import EmptyData from '../components/EmptyData';

class DetailTxScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: translate('Detail Transaction'),
     headerTitleStyle : {fontSize:17, marginLeft:-10, fontWeight:'bold'},
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
           this.setTab('all');
        }
    });
    super(props);
    this.state ={ 
      isLoading: true,
      dataSource : '',
      showTx : false,
      showMonthlyTx:false,
    }
  }

   getTx(type) {
     return fetch(GlobalSetting.url_api + '/transaksi/all?id_user=' + this.state.id_user +'&type='+type+'&date='+this.props.navigation.getParam('date', ''))
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
      this.setState({
        type: type,
      });
      if(type=='income'){
        this.getTx('in');
      }else if(type=='expense'){
        this.getTx('out');
      }else{
        this.getTx('');
      }
    }
    
    renderBarChart(){
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

renderChart(){
  if(this.state.type!='all'){
  let sampleData = this.state.dataSource.historyChart;
  return null;
  }else{
    let sampleData = this.state.dataSource.categoryChart;
    if (this.state.dataSource.categoryChart.length>=1) {
    return(
        <View style={styles.cardHome}>
        <View style={{flex:1, flexDirectio:'row'}}>

          <View style={{flex: 2, flexDirection: 'column'}}>
          <Text  style={{color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Top Expense Category')}</Text>
          </View>
          <View style={{flex: 4, flexDirection: 'column', marginTop:-15}} >
          <Text  style={{color:'#4f70c2',fontSize:11, fontWeight:'bold',  textAlign:'right'}}   onPress={() => this.props.navigation.push('ReportCategory', { type: 'out',date:this.props.navigation.getParam('date', '') })}>{ translate('Detail')}</Text>
          </View>



          <View style={{marginTop:20,justifyContent:'center',textAlign:'center'}}>
          <PureChart data={sampleData} type='line' />
          </View>
          </View>
        </View>
    )
    }
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
      const { isFocused } =this.state;
      const { onFocus, onBlur, otherProps,navigation } =this.props;
      if (this.state.dataSource.history.length>=1) {
      return (
      <View>
        <ScrollView style={{height:'90%'}}>
        <View style={styles.containerDefault}>
        </View>
         
       <View style={[styles.cardHeaderHome2,{marginTop:-80}]} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <ListItem
            title={navigation.getParam('month', 'Detail').toUpperCase()}
            titleStyle={{ fontWeight: 'bold', color:'#4d4d4d' }}
            onPress={() => this.props.navigation.push('Report')}
            containerStyle={{marginTop:-15, marginLeft:-15,backgroundColor:'rgba(0,0,0,0)'}}
            subtitle={translate('Your financial records in this month')}
            leftIcon={
              <Icon
              name='calendar'
              type='font-awesome'
              color={mainColor()}
              size={22} />
            }
            />
          </View>
          <Divider style={{ backgroundColor: '#9c9c9c' }} />
          <View style={{flex: 1, flexDirection: 'row', marginTop:10}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, color:'#3b3a3a'}} >
              {translate('Income')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, textAlign:'right', color:'#3b3a3a'}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.incoming)}
              </Text>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop:8}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, color:'#3b3a3a'}} >
              {translate('Expense')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, textAlign:'right', color:'#3b3a3a'}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.expense)}
              </Text>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop:10}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, color:'#3b3a3a'}} >
              {translate('Deposit')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'300', textAlign:'right', color:'#3b3a3a'}} >
              {this.state.dataSource.deposit < 0 ? <Text style={{fontWeight :'600', fontSize:12, color :'red'}} >{this.state.dataSource.currency} {currencyFormat(this.state.dataSource.deposit)}</Text>
              : this.state.dataSource.deposit == 0 ? <Text style={{fontWeight :'600', fontSize:12, color :'black'}} >{this.state.dataSource.currency} {currencyFormat(this.state.dataSource.deposit)}</Text>
              : <Text  style={{fontWeight :'600', fontSize:12, color :'green'}} >+ {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.deposit)}</Text> }
              </Text>
            </View>
          </View>

        </View>


        {this.renderChart()}
        {/* {this.renderChartIncome()} */}
        {/* {this.renderBarChart()} */}
        
        <View style={styles.cardHome}>
          <View style={{flex:1, flexDirectio:'row'}}>
            <View style={{position: 'relative'}}>
              <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('HISTORY TRANSACTION')}</Text>
            </View>
            <FlatList
            data={this.state.dataSource.history}
            renderItem={({item}) =>
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
            }
            keyExtractor={item => item.id_balance.toString()} />
          </View>
        </View>
        </ScrollView>
      </View>
    )
    }else{
      return (
        <View>
          <EmptyData string="" type='detailTx'/>
      </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Tabs selected={this.state.type} style={{backgroundColor:'white', elevation:2}}
          selectedStyle={{color:mainColor()}} onSelect={el=>this.setTab(el.props.name)}>
          <Text name="all" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{translate('All Transaction')}</Text>
          <Text name="income" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('Income')}</Text>
          <Text name="expense" selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}}  style={[styles.textGray, styles.boldFont]}>{translate('Expense')}</Text>
        </Tabs>
        {this.renderContent()}
      </View>
    )
  }
}
 
export default DetailTxScreen;  