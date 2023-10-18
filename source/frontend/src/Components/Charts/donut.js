import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { url } from '../../config.js'
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import ProgressBar from './progressbar.js'
import BoltIcon from '@mui/icons-material/Bolt';
import SyncIcon from '@mui/icons-material/Sync';
import StorageIcon from '@mui/icons-material/Storage';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ReportIcon from '@mui/icons-material/Report';
import PolicyIcon from '@mui/icons-material/Policy';
import DownloadPage from "../Downloadreport.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Donut({ chart }) {
  const [dataTable, setDataTable] = useState([]);
  const [passed, setPassed] = useState(0);
  const [failed, setfailed] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ["checks-passed", "checks-failed"],
    datasets: [
      {
        label: "checks-passed",
        data: [],
        backgroundColor: ["green", "orange"],
        borderColor: ["green", "orange"],
      },
    ],
    options: {
      layout: {
        Legend: {
          display: true,
        },
      },

    },
  });

  const aref = useRef(null)

  useEffect(() => {
    axios
      .get( url + '/chart')
      .then((response) => response.data.rows)
      .then((rows) => {
        // For Table Data
        const tableData = [];

        // For Chart Data
        let pass_count = 0;
        let fail_count = 0;

        for (let row of rows) {
          if (row.status === "pass") {
            pass_count += 1;
          } else {
            fail_count += 1;
          }
        }
        setPassed(pass_count);
        setfailed(fail_count);
      });
  }, []);

  useEffect(() => {
    setChartData({
      labels: ["checks-passed", "checks-failed"],
      datasets: [
        {
          label: "",
          data: [passed, failed],
          backgroundColor: ["#0d6efd", "#C8C8C8"],
          borderColor: ["#0d6efd", "#C8C8C8"],
          width: '20px'
        },
      ],
      options: {
        plugins: {
          Legend: {
            display: true,
          },
        },
      },
    });
  }, [passed, failed]);

  const handleSyncResources = async (e) => {
    console.log('syncing resources')
    try {
      await axios.post( url + '/shortsync-resources')
    } catch (error) {
      console.error(error);
      alert('An error occurred while syncing resources.');
    }finally{
      alert('resources synced')
    }
  }

  const downloadFileDocument = async(e) => {
    console.log('generating a report ');
      const {data} = await axios.get( url + '/download-report')
      aref.current.href = data.base64
      aref.current.click()
}

  const handleThreatPatterns = () => {
    console.log('Redirecting to Attack patterns')
    window.location.href = "/attack-patterns";
  }

  const handleMyResources = () => {
    window.location.href = "/myresources";
  }
  const handlePolicies = async (e) => {
    console.log('running policies on resources')
    try {
      await axios.post( url + '/policyrun')
    } catch (error) {
      console.error(error);
      alert('An error occurred while syncing resources.');
    }
  }
  const handleThreatSeverity = () => {
    window.location.href = "/threats";
  }


  return (
    <>
    <a href="" download="file.pdf" style={{display: "none"}} ref={aref}></a>
    <div id="dashboard-donut">
      <h2
        style={{
          marginTop: "5px",
          width: "fit-content",
          height: "fit-content",
        }}
      >
        Policy & Compliance check
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr 2fr", gridGap: '10px' }}>
        <div style={{ width: "fit-content", marginLeft: "0" }}>
          <Doughnut
            style={{
              width: "17rem",
              marginLeft: "0rem",
              marginTop: "0px",
            }}
            data={chartData}
            options={chartData.options}
          />
          <br></br>
        </div>
        <div>
          <ProgressBar />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "3fr 3fr ", gridAutoRows: "100px", gridGap: '10px' }}>
        {/* <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px", padding: "10px", cursor: 'pointer', placeItems: 'center'
          }}
          onClick={downloadFileDocument}
          >
            <p>
              <SummarizeIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
            </p>
            <p>
              Reports
            </p>
          </div> */}
          <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px", padding: "10px", cursor: 'pointer', placeItems: 'center'
          }}
            onClick={handleSyncResources}>
            <p>
              <SyncIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
            </p>
            <p>
              Sync resources
            </p>
          </div>
          {/* <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px", padding: "10px", cursor: 'pointer', placeItems: 'center'
          }}
          onClick={handleMyResources}
          >
            <p>
              <StorageIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
            </p>
            <p>
              My Resources
            </p>
          </div> */}
          <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px", padding: "10px", cursor: 'pointer', placeItems: 'center'
          }}
          onClick={handlePolicies}
          >
            <p>
              <PolicyIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
              </p>
            <p>
              Policies
            </p>
          </div>
          <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", borderRadius: "4px",
            padding: "10px", display: 'grid', cursor: 'pointer',
          }} onClick={handleThreatPatterns}>

            <p>
              <ReportIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
              </p>
            <p>
              Threat Intelligence
            </p>
          </div>
          <div style={{
            backgroundColor: "white", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            borderRadius: "4px", padding: "10px", cursor: 'pointer', placeItems: 'center'
          }}
          onClick={handleThreatSeverity}
          >
            <p>
              <BoltIcon sx={{ fontSize: 40, color: '#0d6efd' }} />
            {/* </p>
            <p> */}<br></br>
              ASM
          
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
