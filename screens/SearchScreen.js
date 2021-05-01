import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';



export default class SearchScreen extends React.Component {
    constructor() {
      super()
  
      console.log("HI! I need some state here so I can show lots of posts!")
    }
  
    render() {
      return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View>
                    <Text>This is a Search Page</Text>
                </View>
            </ScrollView>
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      
    },
    contentContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center'
    }
})