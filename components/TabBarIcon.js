import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import * as React from 'react';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  return (
    <AntDesign
      name={props.name}
      size={35}
      style={{ marginBottom: -28 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export function LogOutIcon(props) {
  return (
    <MaterialCommunityIcons
      name={props.name}
      size={30}
      style={{ marginRight: 9, marginBottom: 4 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
