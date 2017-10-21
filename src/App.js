import React, { Component } from "react";
import g from "glamorous";
import ImageSelector from "./components/ImageSelector";
import "./App.css";

// S for styled
const SApp = g.div({
  height: "100%"
});

class App extends Component {
  render() {
    return (
      <SApp className="App">
        <ImageSelector />
      </SApp>
    );
  }
}

export default App;
