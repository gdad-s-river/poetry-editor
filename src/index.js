import React from "react";
import ReactDOM from "react-dom";
import PoetryEditor from "./PoetryEditor";
import registerServiceWorker from "./registerServiceWorker";

import "glamor/reset";
import "./index.css";

ReactDOM.render(<PoetryEditor />, document.getElementById("root"));
registerServiceWorker();
