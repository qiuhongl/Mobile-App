export function getInfo(props) {
    fetch("https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/users/" + props.state.userID, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.state.session
        }
      })
        .then(res => res.json())
        .then(
          result => {
            if (result) {
              console.log(result);
  
              props.setState({
                // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                // try and make the form component uncontrolled, which plays havoc with react
                username: result.username || "",
                birthday: result.status || "",
                email: result.email || "",
              });
            }
          },
          error => {
            alert("Error for fetching user's profile!");
          }
        );
}

export function patchInfo(props) {
        // make the api call to the user controller
        fetch("https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/users/" + props.state.userID, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + props.state.session
            },
            body: JSON.stringify({
              username: props.state.username,
              status: props.state.birthday,
              email: props.state.email,
              firstName: "",
              lastName: "",
              role: ""
            })
          })
            .then(res => res.json())
            .then(
              result => {
                console.log(result);
                props.setState({
                  username: result.username,
                  birthday: result.status,
                  email: result.email,
                });
              },
              error => {
                alert("Error for updating user's profile!");
              }
          );
}

export function postPic(props) {
    fetch ("https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/user-artifacts", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.state.session
        },
        body: JSON.stringify({
          ownerID: props.state.userID,
          type: "image",
          url: props.state.profilePicURL,
          category: "profilePic"
        })
      })
        .then(res =>res.json())
        .then(
          result => {
            props.setState({
              profilePicURL: result.url
            })
          },
          error => {
            alert("Error for uploading a picture!");
          }
        );
}

export function getPic(props) {
    fetch("https://webdev.cse.buffalo.edu/hci/lacking/api/api" + "/user-artifacts?ownerID=" + props.state.userID, {
        headers: {
          'Authorization': 'Bearer ' + props.state.session
        }
      })
        .then(res => res.json())
        .then(
          result => {
            if (result[0].length > 0) {
              let images;
              let img;
              
              images = result[0];
  
              img = images[images.length - 1].url;
  
              props.setState({
                profilePicURL: img ? img : "http://cdn.onlinewebfonts.com/svg/img_258083.png"
              });
            } else {
                props.setState({
                    profilePicURL: "http://cdn.onlinewebfonts.com/svg/img_258083.png"
                });
            }
          },
          error => {
            alert("Error for fetching user's picture!");
          }
        );
}