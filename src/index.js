import React from "react";
import ReactDOM from "react-dom";
import UseDesktop from "./UseDesktop"

import registerServiceWorker from "./registerServiceWorker";

import "glamor/reset";
import "./css/index.css";

ReactDOM.render(<UseDesktop />, document.getElementById("root"));
registerServiceWorker();
