import React, {Component} from 'react';
import {TouchableOpacity, Image, Text, View, StyleSheet, Button } from 'react-native';
import { Constants } from 'expo';
import AWS from "aws-sdk";

import Item from "./Item.js"
import Inventory from "./Inventory.js"


export default class Home extends React.Component {
  static headerShown = {header: false} 

  constructor(props) {
    super(props);
    this.state = {
      fridgeList: [],
    }
  }

  componentDidMount() {
    AWS.config.update({region: "us-east-2", credentials:{secretAccessKey: "LvtfTtrz/gSM/fXAaUh/xrqBJLvHLqAYRV3PhMU3", accessKeyId: "AKIA5GSQCVJRPQYHA7VT"}})
    var ddb = new AWS.DynamoDB({apiVersion: "2012-08-10"})

    var params = {
      ProjectionExpression: 'FridgeId, Exp, quant',
      TableName: 'Fridge'
    };
    
    ddb.scan(params, (err, data) => {
      let tempList = []
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Items);
        data.Items.forEach(function(element, index, array) {
          tempList = tempList.concat(element)
        });
      }
      this.setState({
        fridgeList: tempList,
      })
    });

  }

  renderItems() {
    return (this.state.fridgeList.sort((a,b) => (a.FridgeId.S > b.FridgeId.S) ? 1: -1).map((fridgeItem, index) => {
      return (
        <View style = {styles.data}>
          <Item key={index} name={fridgeItem.FridgeId.S} expiration={fridgeItem.Exp.S} quantity={fridgeItem.quant.N}/>
        </View> 
        //<Text key={index} style = {{fontSize: 25, paddingBottom: 6, alignContent: 'center', color: '#fff'}}>{fridgeItem.FridgeId.S}</Text>
      )
    }))
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style = {styles.container}>
        <TouchableOpacity
          style={{
          borderWidth: 1,
          borderColor:'rgba(0,0,0,0.2)',
          alignItems:'center',
          justifyContent:'center',
          width: 70,
          position: 'absolute',                                          
          bottom: 130,                                                    
          right: 20,
          height: 70,
          backgroundColor:'#9AB4FD',
          borderRadius:100,}}
          onPress={() => navigate('Inventory')}>
          <Text style = {{fontSize: 42, paddingBottom: 6, alignContent: 'center', color: '#fff'}}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
          borderWidth: 1,
          borderColor:'rgba(0,0,0,0.2)',
          alignItems:'center',
          justifyContent:'center',
          width: 70,
          position: 'absolute',                                          
          bottom: 40,                                                    
          right: 20,
          height: 70,
          backgroundColor:'#9AB4FD',
          borderRadius:100,}}
          onPress={() => navigate('Inventory')}>
          <Text style = {{fontSize: 45, alignContent: 'center', paddingBottom: 36, color: '#fff'}}>_</Text>
        </TouchableOpacity>
        <Text style = {{fontSize: 30, alignContent: 'center', paddingLeft: 15, paddingTop: 25, lineHeight: 48, paddingBottom: 8, color: '#fff'}}>welcome back! here's your current inventory:</Text>  
        <View>{this.renderItems()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    width: '100%',
    color: 'white',
    height: '100%',
  },
  data: {
    paddingLeft: 50,
    color: 'white',
    paddingTop: 20,
  }
});