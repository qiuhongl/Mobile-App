import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';

function ShowWarning(props) {
  // display warning message to the user if there is one
  if (props.warning) {
      return (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>{props.warning}</Text>
        </View>
      )
  } else {
      return (
          <View className = "paddingBelowTitle"/>
      )
  }
}

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    // Initialize our login state
    this.state = {
      email: '',
      password: '',
      fontsLoaded: false,
      warning: ''
    }
    // this.loadFonts = this.loadFonts.bind.bind(this);
  }

  async loadFonts() {
    await Font.loadAsync({
      // Load a font `RockSalt` from a static resource
      RockSalt: require('../assets/fonts/RockSalt-Regular.ttf')
    });
    this.setState({fontsLoaded: true});
    }

  componentDidMount() {
    this.loadFonts();
  }

  // On our button press, attempt to login
  // this could use some error handling!
  onSubmit = () => {
    const { email, password } = this.state;

    fetch("https://webdev.cse.buffalo.edu/hci/lacking/api/api/auth/login", {
      method: "POST",
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(json => {
      if (json.body) {
        this.setState({warning: "Please enter a valid email address: \"username@example.com\""});
      } else {
        console.log(`Logging in with session token: ${json.token}`);

        // enter login logic here
        SecureStore.setItemAsync('session', json.token).then(() => {
        this.props.route.params.onLoggedIn();
        });
      }
    })
    .catch(exception => {
        console.log("Error occured", exception);
        this.setState({warning: "Invalid email address and/or password. Please try again."});
    })
  }
  render() {
    const { email, password } = this.state

    // this could use some error handling!
    // the user will never know if the login failed.
    if (!this.state.fontsLoaded) {
      return (
        <View style={(styles.loadingContainer)}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )
    } else {
    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>{`After School\nSociety`}</Text>

          <ShowWarning warning={this.state.warning}/>

          <TextInput
            style={styles.emailInput}
            placeholder="Email Address"
            placeholderTextColor={'white'}
            onChangeText={text => this.setState({ email: text })}
            value={email}
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor={'white'}
            onChangeText={text => this.setState({ password: text })}
            value={password}
            textContentType="password"
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.onSubmit()} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.message}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.register}>Sign up</Text>
            </TouchableOpacity>
          </View>

      </View>
      
    );
    }
  }
}

// Our stylesheet, referenced by using styles.container or styles.loginText (style.property)
const styles = StyleSheet.create({
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'lightgray',
  },
  loadingText: {
    fontSize: 24,
    color: 'white'
  },

  warningContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  warningText:{
    color: 'red',
    fontSize: 16
  },

  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
  },
  loginText: {
    fontSize: 41,
    fontFamily: 'RockSalt',
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: '11%',
    marginBottom: '5%',
  },
  emailInput: {
    width: '80%',
    height: '6%',
    backgroundColor: 'lightgray',
    color: 'white',
    borderColor: 'gray',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: '5%',
    marginBottom: '3.5%',
    paddingLeft: '4%'
  },
  passwordInput: {
    width: '80%',
    height: '6%',
    backgroundColor: 'lightgray',
    borderColor: 'gray',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: '3%',
    marginBottom: '5%',
    paddingLeft: '4%'
  },
  buttonContainer: {
    backgroundColor: 'lightgreen',
    borderRadius: 20,
    width: '30%',
    height: '8%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 20
  },
  forgotPasswordContainer:{
    alignItems: 'flex-end'
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    fontSize: 18,
    paddingStart: '48%',
    marginBottom: '10%'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    width: '100%',
    justifyContent: 'center',
    marginTop: '42%',
  },
  message: {
    fontSize: 20
  },
  register: {
    fontSize: 20,
    color: 'lightgreen'
  }
});