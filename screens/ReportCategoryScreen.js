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

class App extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '',
    headerTitleStyle : {fontSize:17, marginLeft:-10, fontWeight:'bold'},
     headerStyle: {
      backgroundColor: mainColor(),
      elevation : 0,
    },
    headerLeft: null,
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
            this.getBalance();
        }
    });
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  

  getBalance() {
    let type= this.props.navigation.getParam('type', '');
    let startDate= this.props.navigation.getParam('startDate', '');
    let endDate= this.props.navigation.getParam('endDate', '');
    if(startDate){
    var uri = GlobalSetting.url_api + '/transaksi/category?id_user=' + this.state.id_user+'&type='+type+'&startDate='+startDate+'&endDate='+endDate;
    this.setState({
        startDate: startDate,
        endDate: endDate,
    });
    }else{
    var uri = GlobalSetting.url_api + '/transaksi/category?id_user=' + this.state.id_user+'&type='+type+'&date='+this.props.navigation.getParam('date', '');
    }
    console.log(uri);
    return fetch(uri)
     .then((response) => response.json())
     .then((responseJson) => {
        let typeTx= this.props.navigation.getParam('type', '');
        if(typeTx=='in'){
            var type= 'Income';
        }else if(typeTx=='out'){
            var type= 'Expense';
        }
        console.log(type);
        this.setState({
         isLoading: false,
         title: 'Total '+type,
         dataSource: responseJson.result,
        }, function(){

       });

     })
     .catch((error) =>{
       console.error(error);
     });
   }

    
    renderContent() {
      return  (
      <View>
        {this.state.dataSource.list.map((ro ,index)=> (
          <View style={styles.cardProfile2}   key={index} >
            <View style={{flex:1, flexDirectio:'row',}}>
                <ListItem
                title={translate(ro.category_name)}
                subtitle={'Total '+this.state.dataSource.currency+' '+currencyFormat(ro.amount)}
                titleStyle={{ fontWeight: 'bold', color:'#4d4d4d' }}
                onPress={() => this.props.navigation.push('ReportDetailCategory', { id_category: ro.id_category,startDate:this.state.startDate,endDate:this.state.endDate, date:this.props.navigation.getParam('date', '')})}
                containerStyle={styles.listItemContainerNoBorder}
                leftAvatar={<Avatar rounded large  overlayContainerStyle={{backgroundColor: mainColor()}} icon={{name: ro.icon, color: 'white', type: 'font-awesome'}} />}
                rightIcon={<Chevron />}
                />
            </View>
          </View> 
        ))}
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
      <ScrollView style={{height:'90%'}}>

      <View style={[styles.containerIb,{backgroundColor:mainColor()}]}>
      </View>

      <View style={styles.cardProfileHeaderBlank} >
      <View style={{flex:1, flexDirectio:'row',}}>
   
       <Text style={{ fontWeight: 'bold', color:'#fff', fontSize:17 }}>
       {translate(this.state.title)}
    </Text>
    <Text style={{ fontWeight: 'bold', color:'#fff', fontSize:17 }}>
    {this.state.dataSource.currency} { currencyFormat(this.state.dataSource.total)}
    </Text>
        </View>
      </View>
      {this.renderContent()}
    </ScrollView>
  </View>
    );
  }
}

export default App;  
