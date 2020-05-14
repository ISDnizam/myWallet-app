import React from 'react';
import {  Button, View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import FaIcon from '@expo/vector-icons/FontAwesome';
import styles from "../components/Style";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AddTxScreen from '../screens/AddTxScreen';
class StickyAddButton extends React.Component {
  render() {
  return (
    <TouchableOpacity
    activeOpacity={0.7}
     onPress={() => this.props.navigation.push('AddTx')}
    style={styles.TouchableOpacityStyle}>
      <View style={styles.FloatingButtonStyle}>
    <FaIcon name="plus-circle" size={44} color="#128ce3"/>
    </View>
    </TouchableOpacity>
  );
  }
}

AddTxScreen.navigationOptions = {rStyle: {
        backgroundColor: '#128ce3',
      },
    headerTintColor: '#fff',
  };
  
  const RootStack = createStackNavigator({
    AddTx: AddTxScreen,
  });
  
  export default createAppContainer(RootStack);

