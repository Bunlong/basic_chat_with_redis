import React, { Component } from 'react'
import Form from './Form'
import io from "socket.io-client"
let socket = io(`http://192.168.88.246:8000`)

class App extends Component {
  state = {
    data: [],
    username: 'anonymous'
  }

  submit = values => {
    if ( values.pill === 'setusername' ) {
      let msg = {type: 'setUsername', user: "username"};
      socket.json.send(msg);
    }

    if ( values.pill === 'submit' ) {
      let msg = {type: 'chat', message: "message"}
      socket.json.send(msg);
    }
  }

  componentDidMount = () => {
    socket.on('connect', function () {
      console.log("Connected")
    })

    socket.on('message', function (message) {
      console.log(message)
    })

    socket.on('disconnect', function () {
      console.log('Disconnected')
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.submit} />
      </div>
    );
  }
}

export default App;
