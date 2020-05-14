import React, {Component} from 'react';
import {Animated, TouchableHighlight, View} from "react-native";
import Icon from '@expo/vector-icons/FontAwesome';
const SIZE = 40;
class HomeButton extends React.Component {
    constructor(props){
        super(props);
      }
    mode = new Animated.Value(0);
    toggleView = () => {
        Animated.timing(this.mode, {
            toValue: this.mode._value === 0 ? 1 : 0,
            duration: 300
        }).start();
    };
    render() {
        const { onFocus, onBlur, otherProps,navigation } =this.props;
        const rotation = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg']
        });
        return (
            <View style={{
                position: 'absolute',
                alignItems: 'center'
            }}>
           
                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="#2882D8"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: SIZE,
                        height: SIZE,
                        borderRadius: SIZE / 2,
                        backgroundColor: '#48A2F8'
                    }}
                >
                    <Animated.View style={{
                        transform: [
                            {rotate: rotation}
                        ]
                    }}>
                        <Icon name="plus" size={16} color="#F8F8F8"/>
                    </Animated.View>
                </TouchableHighlight>
            </View>
        );
    }
}
export default HomeButton;