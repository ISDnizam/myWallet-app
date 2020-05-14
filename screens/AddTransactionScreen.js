import React, { Component } from 'react';
import { Alert, AsyncStorage, TouchableOpacity, View, Text,StyleSheet,ActivityIndicator,ScrollView, TextInput, Image,Picker } from 'react-native';
import { Avatar, ListItem , Button, Icon, Divider} from 'react-native-elements';
import { createAppContainer,StackActions, NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { mainColor, currencyFormat }  from '../components/GlobalFunction';
import GlobalSetting from '../components/GlobalSetting';
import Tabs from 'react-native-tabs';
import { translate } from 'react-native-translate';
import RBSheet from "react-native-raw-bottom-sheet";
import styles from "../components/Style";
import Moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';

class AddTxScreen extends React.Component {
  static navigationOptions= ({navigation}) => {
    var type =navigation.getParam('type', '');
    if(type=='asset'){
      var title = 'Add Asset';
      var marginLeft = -10;
    }else{
      var title = 'Add Transaction';
      var marginLeft = 13;
    }
    const {params = {}} = navigation.state;
    return {
    headerTitle: (
        <View>
            <Text  style={{color:'#ffffff',fontSize:17, marginLeft:marginLeft, fontWeight:'bold'}}>{ translate(title)}</Text>
        </View>
        ),
     headerStyle: {
      elevation : 0,
    backgroundColor: params.mainColor,
    },
    // headerLeft: null,
    headerTintColor: '#fff',
    }
  };

 
    constructor(props) {
      AsyncStorage.getItem('user', (error, result) => {
        if (result) {
          let resultParsed = JSON.parse(result)
          this.setState({
                id_user: resultParsed.id_user,
                name: resultParsed.name,
            });
          let id_balance = this.props.navigation.getParam('id_balance', '');
          let type = this.props.navigation.getParam('type', '');
          if(id_balance){
            this.getDetail(id_balance);
          }else{
            if(type=='asset'){
              this.getCategory('asset');
              this.setState({textAmount: 'Price'});
            }else{
              this.getCategory('out');
              this.setState({textAmount: 'Amount'});
            }
          }
        }
      });
      super(props)
      this.state = {
        show: false,
        amount: '',
        description: '',
        category: translate('Category')+'...',
        type: 'out',
        isFocused: false,
        isLoading: true,
        loadingBtn: false,
        opacity: 0,
        date: '',
        detail: [],
        view:'list',
        heightModal:400,
        category_name:'',
      }
    }
    componentDidMount() {
      this.props.navigation.setParams({mainColor: mainColor()});
    }
  
    showLoader = () => {
      this.setState({ opacity: 1, isLoading:true, });
    };
    hideLoader = () => {
      this.setState({ opacity: 0, isLoading:false, });
    };
    setCategory = (cat,id_category) => {
      this.setState({ 
          category: cat,
          id_category: id_category
      });
      this.Category.close();
    };
    InsertData = () =>{
      this.showLoader();
      let id_balance = this.props.navigation.getParam('id_balance', '');
      if(id_balance){
        var uri = GlobalSetting.url_api + '/transaksi/edit/'+id_balance;
      }else{
        var uri = GlobalSetting.url_api + '/transaksi/store';
      }
      // console.log(this.state.id_category);
      fetch(uri, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount : this.state.amount,
        id_category : this.state.id_category,
        description : this.state.description,
        id_user: this.state.id_user,
        date_usage: this.state.date,
      })
 
      }).then((response) => response.json())
          .then((responseJson) => {
            var date_usage = Moment(this.state.date, 'D MMMM YYYY HH:mm', true).format('YYYY-MM');
            var dateNow = Moment().format('YYYY-MM');

              if(this.state.type=='asset'){
              this.props.navigation.push('Assets');
              }else{
              this.props.navigation.push('App');
              }
          });
    }
    InsertCategory = () =>{
      this.setState({loadingBtn:true});

        var uri = GlobalSetting.url_api + '/category/create';
      fetch(uri, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category_name : this.state.category_name,
        type : this.state.type,
        id_user : this.state.id_user,
        icon: 'info'
      })
 
      }).then((response) => response.json())
          .then((responseJson) => {
            this.setState({view: 'list',category_name:'',loadingBtn:false});
            this.getCategory(this.state.type);
          });
    }
    getCategory(type) {
      return fetch(GlobalSetting.url_api + '/category?type='+type+'&id_user='+this.state.id_user)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            type: type,
            dataSource: responseJson.result,
          }, function(){
          });
        })
        .catch((error) =>{
          console.error(error);
      });
    }

    getDetail(id_balance) {
      return fetch(GlobalSetting.url_api + '/transaksi/detail?id_balance='+id_balance)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setTab(responseJson.result.type);
          var date = responseJson.result.date_usage;
          this.setState({
            detail: responseJson.result,
            amount: responseJson.result.amount.toString(),
            description: responseJson.result.description,
            date:  Moment(date).format('D MMMM YYYY HH:mm'),
            category: translate(responseJson.result.category_name),
            id_category: responseJson.result.id_category,
          }, function(){
          });
        })
        .catch((error) =>{
          console.error(error);
      });
    }

    setTab(type) {
        this.setState({
          id_category: '',
          category: translate('Category')+'...',
        });
        this.getCategory(type);
    }
    renderButton() {
      if(this.state.isLoading==false){
        return (
            <TouchableOpacity 
            onPress={this.InsertData} >
          <View style={styles.formLogin}>
            <View style={styles.button}>
            <Text style={styles.buttonText} >{translate('Submit')}</Text>
            </View>
          </View>
            </TouchableOpacity>
        )
      }else{
        return null;
      }
    }
    renderContent() {
    const { isFocused } =this.state;
    const { onFocus, onBlur, otherProps } =this.props;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator color={mainColor()}/>
        </View>
      )
    }
    return (
      <View>
          <KeyboardAwareScrollView extraScrollHeight={100} scrollEnabled={true} enableAutomaticScroll={true} enableOnAndroid={true} keyboardShouldPersistTaps='handled'>
        <View style={styles.containerDefault}>
        </View>
      
        <View style={styles.cardProfileHeader} >
          <View style={{flex:1, flexDirectio:'row'}}>
            <FormInput label="Category" onChangeText={() => this.Category.open()}   value={this.state.category}  type="view"/>
            {this.state.type!='asset' ? <View>
            <FormInput label="Date" onChangeText={date => this.setState({date})}  value={this.state.date} type="datetime" />
            </View> : null }
            <FormInput label={this.state.textAmount} onChangeText={amount => this.setState({amount})}  value={this.state.amount} type="numeric"/>
            <FormInput label="Description" onChangeText={description => this.setState({description})}  value={this.state.description}/>
           
            <Button 
            title={translate('Submit')}
            buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
            containerStyle={{marginRight :0, marginTop:15}}
            titleStyle={{color:'#fff'}}
            onPress={this.InsertData}
            loading={this.state.loadingBtn}
            />
          </View>
        </View>
          
        </KeyboardAwareScrollView>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <RBSheet
          ref={ref => {
            this.Category = ref;
          }}
          height={this.state.heightModal}
          closeOnDragDown={false}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              padding: 15,
            }
          }}>
          <View>
          <View>
            <View style={{flex: 2, flexDirection: 'column'}}>
              <Text  style={{   color:'#545454',fontSize:15, fontWeight:'bold'}}>
                { translate('Category') } 
              </Text>
            </View>
            <View style={{flex: 4, flexDirection: 'column'}}>
              {this.state.view=='list' ? <Text  style={{   color:mainColor(),fontSize:12, fontWeight:'bold',textAlign:'right',  marginLeft:'auto'}} onPress={() =>this.setState({view: 'form'})}>
                {'+'+ translate('Create New Category') } 
              </Text> :<Text  style={{   color:mainColor(),fontSize:12, fontWeight:'bold',textAlign:'right',  marginLeft:'auto'}} onPress={() =>this.setState({view: 'list'})}>
                {translate('Cancel') } 
              </Text>  }
            </View>
          </View>
        
          <View style={{marginTop:35}}>
            <Divider style={{ backgroundColor: '#d4d2d2' }} />
            <ScrollView style={{marginBottom:20}}>
            {this.state.view=='list' ? <View>
            {this.state.dataSource.map((ro ,index)=> (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.setCategory(translate(ro.category_name), ro.id_category)}>
                  <View style={{flex: 1, flexDirection: 'row', marginTop:10, marginLeft:-5, marginRight:10}}>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                      <Icon
                      name={ro.icon}
                      type='font-awesome'
                      color={mainColor()}
                      size={20}/>
                    </View>
                    <View style={{flex: 5, flexDirection: 'column',marginLeft:-10}}>
                      <Text style={{ fontSize: 15, paddingTop: 0,color:'#9c9c9c', marginBottom:7}}> {translate(ro.category_name)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View> : <View>
            <FormInput label="Category Name" onChangeText={category_name => this.setState({category_name})}  value={this.state.category_name}/>
            <Button 
            title={translate('Create')}
            buttonStyle={{borderRadius:7,backgroundColor:mainColor()}}
            containerStyle={{marginRight :0, marginTop:15}}
            titleStyle={{color:'#fff'}}
            onPress={this.InsertCategory}
            loading={this.state.loadingBtn}
            />
            </View> } 
            </ScrollView>
          </View>
      </View>

          </RBSheet>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container]}>
        {this.state.type!='asset'? <Tabs selected={this.state.type}  style={{backgroundColor:'white', elevation:2}}
            selectedStyle={{color:mainColor()}}  onSelect={el=>this.setTab(el.props.name)}>
            <Text name="in"  selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{ translate('Income')} </Text>
            <Text name="out"  selectedIconStyle={{borderTopWidth:2,borderTopColor:mainColor()}} style={[styles.textGray, styles.boldFont]}>{ translate('Expense')}</Text>
        </Tabs>
        : null }
        {this.renderContent()}
      </View>
    )
  }
}


export default AddTxScreen;  