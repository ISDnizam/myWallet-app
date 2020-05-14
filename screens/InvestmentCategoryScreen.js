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
class App extends React.Component {
    static navigationOptions= ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
        headerTitle: (
            <View>
                <Text  style={{color:'#ffffff',fontSize:17, marginLeft:-10, fontWeight:'bold'}}>{ translate('Select Category')}</Text>
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
        }
    });
    super(props);
    this.state = {
      isLoading: true,
      type: 'progress',
      currentDate: '',
    };
  }
  getCategory() {
    return fetch(GlobalSetting.url_api + '/category?type=investment')
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
    // this.getBalance('progress');
    this.setState({
      type: type,
    });
  }

  UpdateChart(value) {
    this.setState(value);
    this.getBalance(value);
  }
  componentDidMount() {
    this.props.navigation.setParams({mainColor: mainColor()});
  }

  redirectDetail(id_category,icon,category_name) {
    this.props.navigation.navigate('AddFinancialPlan', { id_category: id_category, icon:icon,category_name:category_name });
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
      <View style={{marginTop:10}}>
        {this.state.dataSource.map((ro ,index)=> (
          <View style={styles.cardProfile2}   key={index} >
            <View style={{flex:1, flexDirectio:'row',}}>
                <ListItem
                title={translate(ro.category_name)}
                subtitle={translate(ro.description)}
                titleStyle={{ fontWeight: 'bold', color:'#4d4d4d', fontSize:13,marginBottom:5, marginLeft:-10  }}
                subtitleStyle={{fontSize:11, marginLeft:-10 }}
                onPress={() => this.redirectDetail(ro.id_category,ro.icon,ro.category_name)}
                containerStyle={{padding:5}}
                leftIcon={
                    <Icon
                    reverse
                    name={ro.icon}
                    type='font-awesome'
                    color={ro.color}
                    size={15} />
                  }
                />
            </View>
          </View> 
        ))}
      </View>
    </ScrollView>
  </View>
    );
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
