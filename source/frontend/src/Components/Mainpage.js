import React from "react";
import { Dashboard } from "./Dashboard/Dashboard";

export default function Mainpage() {
  return (
    <div
      id="main-page"
      style={{
        //display: "grid",
        /*flexDirection:'row',*/
        //justifyContent: "flex-start",
      }}
    >
      <Dashboard />
    </div>
  );
}