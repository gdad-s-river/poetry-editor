import React from "react";
import ReactDOM from "react-dom";
import UseDesktop from "./UseDesktop";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<UseDesktop />, div);
});
