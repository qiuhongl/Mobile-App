import * as SecureStore from 'expo-secure-store';

export function post(props) {
    const myHeaders = new Headers();
    const url = "https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/posts"
    myHeaders.append("Authorization", "Bearer " + props.state.session);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "authorID": props.state.userID,
        "content": props.state.post_message,
        "type": props.state.post_title,
        "thumbnailURL": ""
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result =>{
            // Clear the value
            props.setState({
                post_title: "",
                post_message: ""
            })
            console.log("Post is created");
        })
        .catch(error => console.log('error', error));
    console.log(props.state.posts);
}

export function getPost(props) {
    const myHeaders = new Headers();

        myHeaders.append("Authorization", "Bearer " + props.state.session);
        const url = "https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/posts?skip=0&take=100&sort=newest";
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result =>{
                props.setState({
                    isLoaded: true,
                    posts: result[0]
                })
                console.log("Got Posts");
            },
            error => {
                this.setState({
                  isLoaded: true,
                  error
                });
                console.log("ERROR loading Posts")
              })
            .catch(error => console.log('error', error));
}

export function formatDate(date) {
    var months = new Map();
    months.set('01',  'Jan');
    months.set('02',  'Feb');
    months.set('03',  'Mar');
    months.set('04',  'Apr');
    months.set('05',  'May');
    months.set('06',  'Jun');
    months.set('07',  'Jul');
    months.set('08',  'Aug');
    months.set('09',  'Sep');
    months.set('10',  'Oct');
    months.set('11',  'Nov');
    months.set('12', 'Dec');
    
    const m = date.slice(5, 7)
    const month = months.get(m);
    const day = date.slice(8, 10);
    const year = date.slice(2, 4);
    const time = date.slice(11, 16);

    return [month, day, year, time];
}