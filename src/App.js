import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:8080", { transports: ["websocket"] });

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      input: ""
    };
  }

  componentDidMount() {
    socket.on("chat message", msg => {
      this.setState(
        state => ({
          messages: [...state.messages, msg]
        }),
        () => {
          window.scrollTo(0, document.body.scrollHeight);
        }
      );
    });
  }

  handleChange = event => {
    const { value } = event.target;
    this.setState(() => ({
      input: value
    }));
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("SUBMITTING FORM");
    socket.emit("chat message", this.state.input);
    this.setState(() => ({
      input: ""
    }));
  };

  render() {
    const { messages, input } = this.state;
    return (
      <div className="App">
        {messages.map((message, idx) => (
          <li key={idx}>{message}</li>
        ))}
        <form onSubmit={this.handleSubmit}>
          <input value={input} onChange={this.handleChange} />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default App;
