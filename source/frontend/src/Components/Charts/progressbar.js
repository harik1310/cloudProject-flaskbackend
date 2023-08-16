import React, { useState, useEffect } from "react";
import axios from "axios";

import { ProgressBar as Progress_bar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProgressBar = () => {
  const awsCountProgress = [];
  const gcpCountProgress = [];
  const azureCountProgress = [];
  const [awspass, setawsPass] = useState(0);
  const [awsfail, setawsFail] = useState(0);
  const [gcppass, setgcpPass] = useState(0);
  const [gcpfail, setgcpFail] = useState(0);
  const [azurepass, setazurePass] = useState(0);
  const [azurefail, setazureFail] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:8000/chart/aws")
      .then((response) => response.data.rows)
      .then((rows) => {
        let pass_count = 0;
        let fail_count = 0;
        for (let row of rows) {
          if (row.status === "pass") {
            pass_count += 1;
          } else {
            fail_count += 1;
          }

          awsCountProgress.push({
            status: row.status,
          });
        }
        setawsPass(pass_count);
        setawsFail(fail_count);
      });

    axios
      .get("http://localhost:8000/chart/gcp")
      .then((response) => response.data.rows)
      .then((rows) => {
        let pass_count = 0;
        let fail_count = 0;
        for (let row of rows) {
          if (row.status === "pass") {
            pass_count += 1;
          } else {
            fail_count += 1;
          }

          gcpCountProgress.push({
            status: row.status,
          });
        }
        setgcpPass(pass_count);
        setgcpFail(fail_count);
      });

    axios
      .get("http://localhost:8000/chart/azure")
      .then((response) => response.data.rows)
      .then((rows) => {
        let pass_count = 0;
        let fail_count = 0;
        for (let row of rows) {
          if (row.status === "pass") {
            pass_count += 1;
          } else {
            fail_count += 1;
          }

          azureCountProgress.push({
            status: row.status,
          });
        }
        setazurePass(pass_count);
        setazureFail(fail_count);
      });
  }, [awsCountProgress, gcpCountProgress, azureCountProgress]);

  let awstotal;
  let gcptotal;
  let azuretotal;

  awstotal = awspass + awsfail;
  gcptotal = gcppass + gcpfail;
  azuretotal = azurepass + azurefail;

  const awspercentage = () => {
    let awspercentage = (awspass / awstotal) * 100;
    return awspercentage;
  };

  const gcppercentage = () => {
    let gcppercentage = (gcppass / gcptotal) * 100;
    return gcppercentage;
  };

  const azurepercentage = () => {
    let azurepercentage = (azurepass / azuretotal) * 100;
    return azurepercentage;
  };

  return (
    <>
      <div style={{}}>
        <h5 style={{ margin: "0" }}>Regulatory Compliance</h5>
        <br></br>
        <div
          style={{
            width: "17vw",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p>AWS</p>
          <p>
            {awspass}/{awstotal}
          </p>
        </div>
        <div className="progressBar" style={{ height: "20px", width: "17vw" }}>
          <Progress_bar now={awspercentage()} />
        </div>
        <div
          style={{
            width: "17vw",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p>GCP</p>
          <p>
            {gcppass}/{gcptotal}
          </p>
        </div>
        <div className="progressBar" style={{ height: "20px", width: "17vw" }}>
          <Progress_bar style={{ marginBottom: "7px" }} now={gcppercentage()} />
        </div>
        <div
          style={{
            width: "17vw",
            justifyContent: "space-between",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <p>Azure</p>
          <p>
            {azurepass}/{azuretotal}
          </p>
        </div>
        <div className="progressBar" style={{ height: "20px", width: "17vw" }}>
          <Progress_bar now={azurepercentage()} />
        </div>
      </div>
    </>
  );
};
export default ProgressBar;
