import React from "react";
import "./policyselect.css";

export default function DropdownBox(props) {
  const { handleChange } = props;
  return (
    <div
      style={{
        display:'flex',
        justifyContent:'space-between',
        width: "fit-content",
         height: "fit-content",
      }}
    >
      <select
        defaultValue={"chart"}
        onChange={handleChange}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <option value="chart">All Policies</option>
        <option value="chart-1.2">CIS-V1.2.0</option>
        <option value="chart-1.5">CIS-V1.5.0</option>
      </select>
    </div>
  );
}
 