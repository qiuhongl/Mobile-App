import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Dimensions, Modal} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';


const {height, width} = Dimensions.get('window');

export default class ProfileScreen extends React.Component {
    constructor() {
      super()
      
      this.state = {
        userID: "",
        session: null,
        email: "",
        username: "",
        birthday: "",
        interest: "",
        profilePicURL: "http://cdn.onlinewebfonts.com/svg/img_258083.png",
        subModalVisible: false,
        message: ""
      }

      console.log("HI! I need some state here so I can show lots of posts!")
    }

    componentDidMount() {
      this.loadInfo();
    }

    loadInfo = () => {
      SecureStore.getItemAsync('userID').then(userID => {
              this.setState({
                userID: userID
              }
              , () => {
                SecureStore.getItemAsync('session').then(sessionToken => {
                  this.setState({
                    session: sessionToken
                  }
                  , () => {
                    this.loadProfile()
                  });
                });
              });
      });
    }

    loadProfile = () => {
      import("../functionalities/Profile.js").then(users => {
        users.getInfo(this);
        users.getPic(this);
      })
    }

    postPic = () => {
      import("../functionalities/Profile.js").then(users => {
        users.postPic(this);
      })
      this.setState({message: "New picture is successfully uploaded!"}, () => {this.setSubModalVisible(true);});
    }

    updateProfile = () => {
      import("../functionalities/Profile.js").then(users => {
        users.patchInfo(this);
      })
      this.setState({message: "Your profile is successfully updated!"}, () => {this.setSubModalVisible(true);});
    }

    setSubModalVisible = (visible) => {
      this.setState({ subModalVisible: visible});
    }

    render() {
      const {email, username, birthday, interest, profilePicURL, subModalVisible, message} = this.state;
      return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                <Modal
                  animationType="none"
                  transparent={true}
                  visible={subModalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    this.setSubModalVisible(!subModalVisible);
                  }}
                >
                  <View style={styles.innerCenteredView}>
                    <View style={styles.innerModalView}>
                      <Text style={styles.modalText}>{message}</Text>
                      <TouchableOpacity
                        style={[styles.modalButton, styles.buttonClose]}
                        onPress={() => this.setSubModalVisible(!subModalVisible)}
                      >
                        <Text style={styles.closeText}>Great!</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <View style={styles.profileView}>

                  <View style={styles.infoRow}>
                    
                    <View style={styles.myProfile}>
                      <Text style={styles.info}>Username: {username}</Text>
                      <Text style={styles.info}>Birthday: {birthday}</Text>
                      <Text style={styles.info}>Email: {email}</Text>
                    </View>

                    <Image style={styles.profilePic} source = {{uri: profilePicURL}}/>

                  </View>

                  <View style={styles.row}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="Put your favourite picture here"
                      placeholderTextColor={'gray'}
                      onChangeText={text => this.setState({profilePicURL: text})}
                      value={profilePicURL}
                    />
                    <TouchableOpacity
                      style={[styles.button, styles.otherButton]}
                      onPress={() => this.postPic()}
                    >
                      <Text style={[styles.textStyle, styles.buttonText]}>Upload</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.textStyle, styles.description]}>Profile Picture URL</Text>

                  <View style={styles.row}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="Create your username"
                      placeholderTextColor={'gray'}
                      onChangeText={text => this.setState({username: text})}
                      value={username}
                    />
                  </View>
                  <Text style={[styles.textStyle, styles.description]}>Username</Text>

                  <View style={styles.row}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="MM/DD/YYYY"
                      placeholderTextColor={'gray'}
                      onChangeText={text => this.setState({birthday: text})}
                      value={birthday}
                    />
                  </View>
                  <Text style={[styles.textStyle, styles.description]}>Birthday</Text>

                  <View style={styles.row}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="Add your interest now"
                      placeholderTextColor={'gray'}
                      onChangeText={text => this.setState({interest: text})}
                      value={interest}
                    />
                    <TouchableOpacity style={[styles.button, styles.otherButton]}>
                      <Text style={[styles.textStyle, styles.buttonText]}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.textStyle, styles.description]}>Interests</Text>

                  <TouchableOpacity 
                    style={[styles.button, styles.update]}
                    onPress={() => this.updateProfile()}
                  >
                    <Text style={[styles.textStyle, styles.buttonText, styles.updateText]}>Update My Profile</Text>
                  </TouchableOpacity>

                </View>

                {/* <View style={styles.profileView}>
                  
                  <Text>This is a Profile Page</Text>
                  
                </View> */}

            </ScrollView>
      )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    contentContainer: {
      padding: 15,
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    profileView: {
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: "lightgray",
      borderRadius: 20,
      padding: 20,
      marginBottom: 15,
      alignItems: "center",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    infoRow: {
      flex: 0.38,
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginLeft: '5%'
    },
    profilePic: {
      backgroundColor: 'white',
      height: width * 0.30, 
      width: width * 0.30, 
      borderRadius: 75, 
      borderWidth: 1,
      alignSelf: 'flex-start',
      borderColor: "black",
      marginBottom: '5%',
    },
    myProfile: {
      width: '61%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    info: {
      fontSize: 16,
      marginVertical: 15,
    },
    row: {
      flex: 0.08,
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: '1.5%'
    },
    urlInput: {
      width: '75%',
      height: '100%',
      backgroundColor: 'white',
      color: 'gray',
      borderColor: 'gray',
      fontSize: 16,
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: '4%'
    },
    textStyle: {
      fontSize: 16,
      alignSelf: 'center',
    },
    buttonText: {
      alignSelf: 'center',
      color: 'white',
      marginLeft: 0,
    },
    description: {
      alignSelf: 'flex-start',
      marginLeft: '3%',
      marginBottom: '5%'
    },
    updateText: {
      fontWeight: "bold",
      fontSize: 18
    },
    button: {
      position: 'absolute',
      width: '21%',
      height: '100%',
      justifyContent: 'center',
      borderRadius: 10,
      padding: 0,
      elevation: 2,
      shadowOffset: { width: 1, height: 2 },
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: 2,
      backgroundColor: "lightgreen",
    },
    otherButton: {
      right: 0
    },
    update: {
      width: '50%',
      height: '7%',
      left: 20,
      alignItems: 'center',
      bottom: 20,
      backgroundColor: 'orange',
      padding: 10,
    },
    innerCenteredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    innerModalView: {
      width: '80%',
      height: '10%',
      backgroundColor: "lightgreen",
      borderRadius: 20,
      paddingVertical: 20,
      alignItems: "center",
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalButton: {
      position: 'absolute',
      bottom: '20%',
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      shadowOffset: { width: 1, height: 2 },
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    buttonClose: {
      backgroundColor: "white",
    },
    modalText: {
      position: 'absolute',
      top: '30%',
      fontSize: 16,
      marginBottom: 15,
      textAlign: "center",
      color: 'white'
    },
    closeText: {
      color: 'lightgreen',
      fontSize: 16,
    }
})