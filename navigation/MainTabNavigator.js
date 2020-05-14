import React from 'react';
import { Platform } from 'react-native';
import { createDrawerNavigator,createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import TabBarIcon from '../components/TabBarIcon';
import AddButton from '../components/AddButton';
import HomeScreen from '../screens/HomeScreen';
import AddTxScreen from '../screens/AddTransactionScreen';
import IncomingScreen from '../screens/IncomingScreen';
import OutgoingScreen from '../screens/OutgoingScreen';
import ProfileScreen from '../screens/ProfileScreen';


import AssetsScreen from '../screens/AssetsScreen';
import BudgetingScreen from '../screens/BudgetingScreen';

const config = Platform.select({
  web: { headerMode: 'none' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  { 
    headerMode: 'none' 
  },
  config
);
HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      size={26}
      label="Home"
      name={"home"}
    />
  ),
};
HomeStack.path = '';






const IncomingStack = createStackNavigator(
  {
    Income: AssetsScreen,
  },
  config
);
IncomingStack.navigationOptions = {
  tabBarLabel: 'Asset',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} size={26} name="file-text-o"  label="Asset"/>
  ),
};
IncomingStack.path = '';



const OutgoingStack = createStackNavigator(
  {
    Expenses: BudgetingScreen,
  },
  config
);
OutgoingStack.navigationOptions = {
  tabBarLabel: 'eBudgeting',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused}  size={26} name="wpforms" label="e-Budgeting"/>

  ),
};
OutgoingStack.path = '';




const ProfileStack = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config
);
ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} size={26} name="user-o"  color="#000"  action='Profile'  label="Profile"/>
  ),
};
ProfileStack.path = '';




// const AddingStack = createStackNavigator(
//   {
//     Add: () => false,
//   },
// );
// AddingStack.navigationOptions = {
//   showLabel: false,
//   tabBarIcon:<AddButton />,
// };
const AddingStack = createStackNavigator(
  {
    AddTXx: AddTxScreen,
  },
  config
);
AddingStack.navigationOptions = {
  tabBarLabel: '',
  inactiveTintColor: '#000',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} size={80} name="plus-circle"  color="#F8F8F8" action='AddTx' label="Add"/>
  ),
};
AddingStack.path = '';


const tabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    OutgoingStack,
    Add: {
      screen: AddingStack,
      navigationOptions: {
        tabBarOnPress: ({ navigation, defaultHandler }) => {
          // navigation.push('AddTx');
          // if (navigation.isFocused()) {
          //   alert('subsequent focus');
          //   return;
          // } else {
          //   alert('focused');
          // }
          defaultHandler();
        },
      },
    },
    IncomingStack,
    ProfileStack,
  }
  ,
{ 
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showLabel: false,
   showIcon: true,
   activeTintColor: '#000',  //Not working for icons.
   inactiveTintColor: '#FFF',  //Not working for icons.
   inactiveBackgroundColor: '#fff', // Not working at all.
   style: {backgroundColor: '#fff', height: 50, padding:0, margin:0, borderColor:'#000',
   borderTopWidth: 0 ,
   shadowColor: '#000',
   elevation: 3,
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.8,
  }
 }
});

tabNavigator.path = '';
export default tabNavigator;
