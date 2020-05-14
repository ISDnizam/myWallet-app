import React from 'react';
import { Alert, Platform,AsyncStorage,Image, StatusBar, Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import { createAppContainer, createSwitchNavigator,createStackNavigator } from 'react-navigation';
import styles from "../components/Style";
import { Header, Icon } from 'react-native-elements';

import MainTabNavigator from './MainTabNavigator';
import AppNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import IncomingScreen from '../screens/IncomingScreen';
import OutgoingScreen from '../screens/OutgoingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddTxScreen from '../screens/AddTransactionScreen';
import DetailTxScreen from '../screens/DetailTxScreen';
import LoginScreen from '../screens/LoginScreen';
import ReportScreen from '../screens/ReportScreen';
import ChangeColorScreen from '../screens/ChangeColorScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import ReportCategoryScreen from '../screens/ReportCategoryScreen';
import ReportDetailCategoryScreen from '../screens/ReportDetailCategoryScreen';
import FinancialPlanScreen from '../screens/FinancialPlanScreen';
import InvestmentCategoryScreen from '../screens/InvestmentCategoryScreen';
import AddFinancialPlanScreen from '../screens/AddFinancialPlanScreen';
import AssetsScreen from '../screens/AssetsScreen';
import BudgetingScreen from '../screens/BudgetingScreen';
import NotificationScreen from '../screens/NotificationScreen';

const AppStack = createStackNavigator({
  App: {
    screen: MainTabNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (args) => {
        console.log('ddd');
        if (args.scene.focused) { // if tab currently focused tab
          if (args.scene.route.index !== 0) { // if not on first screen of the StackNavigator in focused tab.
              navigation.dispatch(NavigationActions.reset({
              index: 0,
              actions: [
                  NavigationActions.navigate({ routeName: args.scene.route.routes[0].routeName }) // go to first screen of the StackNavigator
              ]
              }))
          }
        } else {
            args.jumpToIndex(args.scene.index) // go to another tab (the default behavior)
        }
    },
    header :null,
    }),
  },
  
  AddTx: AddTxScreen, 
  Login: LoginScreen, 
  Incoming: IncomingScreen, 
  DetailTx: DetailTxScreen, 
  Expense: OutgoingScreen, 
  Report: ReportScreen, 
  ReportCategory: ReportCategoryScreen, 
  ChangeColor: ChangeColorScreen, 
  ChangePassword: ChangePasswordScreen, 
  ReportDetailCategory: ReportDetailCategoryScreen, 
  FinancialPlan: FinancialPlanScreen, 
  InvestmentCategory: InvestmentCategoryScreen, 
  AddFinancialPlan: AddFinancialPlanScreen, 
  Assets: AssetsScreen, 
  Budgeting: BudgetingScreen, 
  Notification: NotificationScreen, 
  
  });
export default createAppContainer(
  createSwitchNavigator(
    {
      Main: MainTabNavigator,
      App: AppStack,
      AddTx: AddTxScreen,
    },
    {
      initialRouteName: 'Main',
    }
  )
);

