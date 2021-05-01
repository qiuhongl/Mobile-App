import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { MonoText } from '../components/StyledText';
import { formatDate } from '../functionalities/Post.js';

function Post(props) {
  const author = props.username ? props.username : props.email;
  const [month, day, year, time] = formatDate(props.date);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardDescription}>{props.content}</Text>
      <View
        style={{borderBottomColor: 'gray', borderBottomWidth: 0.8, marginTop: 5}}
      />
      <View style={styles.row}>
        <Text style={[styles.author, styles.other]}>-</Text>
        <Text style={styles.author}> {author}</Text>
        <Text style={[styles.author, styles.other]}> {month} {day} '{year} at {time}</Text>
      </View>
    </View>
  )
}

function PostList(props) {
  if (props.error) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.defaultMessage, styles.error]}>Error: {props.error.message}</Text>
      </ScrollView>
    )
  }
  else if (props.isLoaded) {
    if (props.posts.length > 0) {
      const posts = props.posts;

      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {posts.map(post => {
            return <Post key = {post.id} 
                         title = {post.type} 
                         content = {post.content} 
                         email = {post.author.email} 
                         username = {post.author.username} 
                         date = {post.updatedAt}
                         />
          })}
        </ScrollView>
      )
      // No posts on the app
    } else {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.defaultMessage}>Get started making a post!</Text>
        </ScrollView>
      )
    }
    // Loading the posts
  } else {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.defaultMessage}>Loading posts...</Text>
        </ScrollView>
      )
  }
} 

export default class HomeScreen extends React.Component {
  constructor() {
    super()

    // variable used to fetch the latest post from the back-end
    var intervalId;

    this.state = {
      session: null,
      subModalVisible: false,
      modalVisible: false,
      userID: "",
      post_title: "",
      post_message: "",
      posts: [],
      isLoaded: false,
      error: null,
      warning: "",
    }

    console.log("HI! I need some state here so I can show lots of posts!")
  }

  componentDidMount () {
    this.loadInfo();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
}

  loadInfo = () => {
    SecureStore.getItemAsync('session').then(sessionToken => {
      this.setState({
        session: sessionToken
      }
      , () => {
        this.loadPost()
        // fetch messages every second so that the user receives the latest message
        this.intervalId = setInterval(this.loadPost, 1000);
      }
      );
    });
    SecureStore.getItemAsync('userID').then(userID => {
      this.setState({
        userID: userID
      });
    });
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible});
  }

  setSubModalVisible = (visible) => {
    this.setState({ subModalVisible: visible});
  }

  makePost = () => {
    if (this.state.post_title && this.state.post_message) {
      import("../functionalities/Post.js").then(posts =>{
        posts.post(this);
      })
      this.setModalVisible(!this.state.modalVisible, this.state.warning);
    } else {
      this.setState({warning: "Error: Cannot leave the title or the content empty."}, () => {this.setSubModalVisible(true);});
    }
  }

  loadPost = () => {
    import("../functionalities/Post.js").then(posts => {
      posts.getPost(this);
    })
  }

  render() {
    const { subModalVisible, modalVisible, post_title, post_message, posts, isLoaded, error, warning} = this.state;
    return (
    <View style={styles.container}>

      {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Card Title</Text>
          <Text style={styles.cardDescription}>Card Description</Text>
        </View>
      </ScrollView> */}

      <PostList posts = {posts} isLoaded = {isLoaded} error = {error}/>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setModalVisible(!modalVisible);
        }}
      >

        <Modal
          animationType="slide"
          transparent={true}
          visible={subModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setSubModalVisible(!subModalVisible);
          }}
        >
          <View style={styles.innerCenteredView}>
            <View style={styles.innerModalView}>
              <Text style={styles.modalText}>{warning}</Text>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setSubModalVisible(!subModalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>

              <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor={'gray'}
                autoCapitalize={'words'}
                onChangeText={text => this.setState({post_title: text})}
                value={post_title}
                textContentType="emailAddress"
              />

              <TextInput
                style={styles.messageInput}
                multiline={true}
                placeholder="Share something"
                placeholderTextColor={'gray'}
                autoCapitalize={'sentences'}
                onChangeText={text => this.setState({post_message: text})}
                value={post_message}
                textContentType="emailAddress"
              />

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.postButton}
                onPress={() => this.makePost()}
              >
                <Text style={styles.textStyle}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => this.setModalVisible(true)}
        >
          <Text style={styles.plusTextStyle}>Make my own post</Text>
        </TouchableOpacity>

    </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 15,
  },
  card: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'lightgray',
    padding: 10,
    marginBottom: 15
  },
  cardTitle: {
    color: 'gray',
    fontSize: 20,
    marginBottom: 10
  },
  cardDescription: {
    color: 'gray',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex:1,
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 9,
  },
  author: {
    textAlign: 'right',
    color: 'green',
    fontSize: 12,
  },
  other: {
    color: 'gray',
  },

  titleInput: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'gray',
    borderRadius: 10,
    width: '100%',
    height: '10%',
    top: '5%',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
  },

  messageInput: {
    position: 'absolute',
    backgroundColor: 'white',
    color: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%',
    height: '75%',
    bottom: '16%',
    textAlign: 'left',
    fontSize: 16
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: '80%',
    height: '50%',
    margin: 20,
    backgroundColor: "lightgreen",
    borderRadius: 20,
    padding: 20,
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
  plusButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '1.5%',
    right: '1.5%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    backgroundColor: "orange",
  },
  cancelButton: {
    position: 'absolute',
    width: '47.5%',
    bottom: '3%',
    right: '8%',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "red",
  },
  postButton: {
    position: 'absolute',
    width: '47.5%',
    bottom: '3%',
    left: '8%',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "gray",
  },
  plusTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  defaultMessage: {
    color: "lightgreen",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 18,
  },
  error: {
    color: "red"
  },

  innerCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  innerModalView: {
    width: '40%',
    height: '15%',
    backgroundColor: "gray",
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  button: {
    position: 'absolute',
    bottom: '10%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "red",
  },
  modalText: {
    position: 'absolute',
    top: '10%',
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: 'red'
  }
});