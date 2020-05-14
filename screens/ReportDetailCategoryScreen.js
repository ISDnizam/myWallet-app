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

class App extends React.Component {
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
           this.getTx();
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

   getTx() {
    let startDate= this.props.navigation.getParam('startDate', '');
    let endDate= this.props.navigation.getParam('endDate', '');
    if(startDate){
    var uri = GlobalSetting.url_api + '/transaksi/detail?id_user=' + this.state.id_user +'&id_category='+this.props.navigation.getParam('id_category', '')+'&date='+this.props.navigation.getParam('date', '')+'&startDate='+startDate+'&endDate='+endDate;
    }else{
    var uri = GlobalSetting.url_api + '/transaksi/detail?id_user=' + this.state.id_user +'&id_category='+this.props.navigation.getParam('id_category', '')+'&date='+this.props.navigation.getParam('date', '');
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
    


// renderChart(){
//   if(this.state.type!='all'){
//   let sampleData = this.state.dataSource.historyChart;
//   return null;
//   }else{
//     let sampleData = this.state.dataSource.categoryChart;
//     if (this.state.dataSource.categoryChart.length>=1) {
//     return(
//         <View style={styles.cardHome}>
//         <View style={{flex:1, flexDirectio:'row'}}>
//           <View style={{position: 'relative'}}>
//             <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('Top Expense Category')}</Text>
//           </View>
//           <View style={{marginTop:20,justifyContent:'center',textAlign:'center'}}>
//           <PureChart data={sampleData} type='line' />
//           </View>
//           </View>
//         </View>
//     )
//     }
//   }
// }


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
      if (this.state.dataSource.list.length>=1) {
      return (
      <View>
        <ScrollView style={{height:'100%'}}>
        <View style={styles.containerDefault}>
        </View>
         
       <View style={[styles.cardHeaderHome2,{marginTop:-80}]} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <ListItem
            title={translate(this.state.dataSource.category_name).toUpperCase()}
            titleStyle={{ fontWeight: 'bold', color:'#4d4d4d' }}
            onPress={() => this.props.navigation.push('Report')}
            containerStyle={{marginTop:-15, marginLeft:-15,backgroundColor:'rgba(0,0,0,0)'}}
            subtitle={translate('Your financial records in this category')}
            leftIcon={
              <Icon
              name={this.state.dataSource.icon}
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
              {translate('Transaction')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, textAlign:'right', color:'#3b3a3a'}} >
             {this.state.dataSource.total_transaction}  {translate('Transaction')}
              </Text>
            </View>
          </View>

          <View style={{flex: 1, flexDirection: 'row', marginTop:8}}>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, color:'#3b3a3a'}} >
              {translate('Total')}
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              <Text style={{fontWeight :'600', fontSize:12, textAlign:'right', color:'#3b3a3a'}} >
              {this.state.dataSource.currency} {currencyFormat(this.state.dataSource.total)}
              </Text>
            </View>
          </View>
        </View>


        {/* {this.renderChart()} */}
        
        <View style={styles.cardHome}>
          <View style={{flex:1, flexDirectio:'row'}}>
            <View style={{position: 'relative'}}>
              <Text  style={{marginBottom: 5,marginLeft: 0,marginTop: 0,color:'#3b3a3a',fontSize:12, fontWeight:'bold'}}>{ translate('HISTORY TRANSACTION')}</Text>
            </View>
            <FlatList
            data={this.state.dataSource.list}
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
        <EmptyData string='' type='report'/>
      </View>
      )
    }
  }

  render() {
    return (
      <View style={[styles.container]}>
        {this.renderContent()}
      </View>
    )
  }
}
 
export default App;  