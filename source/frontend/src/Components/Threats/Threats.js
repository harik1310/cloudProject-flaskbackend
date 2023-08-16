import React, { useEffect, useState } from 'react';
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';
import './threats.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))
  (({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const ThreatSeverity = () => {
  const [expanded, setExpanded] = useState('');
  const [data, setData] = useState([]);
  const [threat, setThreat] = useState([]);
  const [queryData, setApiData1] = useState([]);
  const [bardData, setApiData2] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [passed, setPassed] = useState(0);
  const [failed, setfailed] = useState(0);
  const [barChart, setBarChart] = useState({
    aws: '', gcp: '', azure: '',
    awsFail: '', gcpFail: '', azureFail: ''
  })
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Criticality of Data',
      },
    },
  };
  
  const labels = ['AWS', 'GCP', 'Azure' ];

  const bardata = {
    labels,
    datasets: [
      {
        label: 'Critical',
        data: [barChart.awsFail, barChart.gcpFail, barChart.azureFail],
        backgroundColor: '#ffb1c1',
      },
      {
        label: 'Safe',
        data: [barChart.aws, barChart.gcp, barChart.azure],
        
        backgroundColor: '#0d6efd',
      },
    ],
  };

  // const aref = useRef(null)


  useEffect(() => {
    // Fetch data from the first API call
    axios.get('http://localhost:8000/getthreatpattern')
      // axios.get('http://localhost:8000/attackpatterns')  
      .then(response => {
        setApiData1(response.data.rows);
        const tableData = [];
      })
      .catch(error => {
        console.error('Error fetching data from the first API:', error);
      });
    // console.log('pass ', passed);

    // Fetch data from the second API call
    axios.get('http://localhost:8000/bardapi')
      .then(response => {
        const data = response.data
        // console.log('json_data');

        const regex = /T\d+(\.\d+)?/g;
        const json_data = data.match(regex) || [];
        // console.log('Bard apidata '+json_data);
        try {
          const dataFromApi = json_data.map(item => item.split(','));
          // console.log('inside try '+dataFromApi);
          setApiData2(dataFromApi)
        } catch (e) {
          const js = json_data.split(',')
          const parsedJson = JSON.parse(js)
          console.log("parsedJons " + parsedJson);
          setApiData2(parsedJson)
        }
      })
      .catch(error => {
        console.error('Error fetching data from the second API:', error);
      });
  }, []);

  useEffect(() => {
    setChartData({
      labels: ["Safe", "Critical"],
      datasets: [
        {
          label: "",
          data: [passed, failed],
          backgroundColor: ["#0d6efd", "#ffb1c1"],
          borderColor: ["#0d6efd", "#ffb1c1"],
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

  //console.log('api2 '+ bardData)

  useEffect(() => {
    // console.log("object 1");
    if (!(queryData.length && bardData.length)) return
    const matched = []

    const bardDataValues = Object.values(bardData)
    // console.log('bardDataValues '+ bardDataValues,typeof(bardDataValues))

    for (let api1_data of queryData) {
      // console.log(api1_data);

      // console.log(bardDataValues);
      //console.log('api2 '+ bardData[0])
      for (let technique_id of bardDataValues) {
        // const {technique_id} = api2_data
        //  console.log(technique_id[0]); 
        if (technique_id[0] === api1_data.techniques) {
          // console.log('inside if')
          matched.push(
            {
              ...api1_data,
              check_id: api1_data.id,
              title: api1_data.context,
              techniques: technique_id[0],
              tactic: api1_data.tactic_name,
              tactic_description: api1_data.tactic_description,
              solution: api1_data.description,
              source: api1_data.source
            }
          )
        }
      }
    }
    setMatchedData(matched);
    console.log("matched ", matched);

    const update = () => {
      let pass_count = 0;
      let fail_count = 0;
      let awsCount = 0;
      let gcpCount = 0;
      let azureCount = 0;
      let awsFailCount = 0;
      let gcpFailCount = 0;
      let azureFailCount = 0;

      for (let row of matched) {
        if (row.status === "pass") {
          pass_count += 1;
          if (row.source === "AWS") {
            awsCount += 1;
          } else if (row.source === "GCP") {
            gcpCount += 1;
          } else if (row.source === "Azure") {
            azureCount += 1;
          }
        } else {
          fail_count += 1;
          if (row.source === "AWS") {
            awsFailCount += 1;
          } else if (row.source === "GCP") {
            gcpFailCount += 1;
          } else if (row.source === "Azure") {
            azureFailCount += 1;
          }
          console.log('fail ', fail_count);
        }
        // if (row.source === "AWS") {
        //   awsCount += 1;
        // } else if (row.source === "GCP") {
        //   gcpCount += 1;
        // } else if (row.source === "Azure") {
        //   azureCount += 1;
        // }
      }
      setPassed(pass_count);
      setfailed(fail_count);
      setBarChart({
        aws: awsCount, gcp: gcpCount, azure: azureCount,
        gcpFail: gcpFailCount, awsFail: awsFailCount, azureFail: azureFailCount
      });
      console.log("matcheddata ", matchedData);
      console.log(passed, failed, barChart)
    }
    update()

  }, [queryData, bardData, passed, failed]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };

  const threatInfoHandler = () => {
    // window.location.href='/dashboard'
  }


  return (
    <div >
      <h2>Top Threats <InfoIcon onClick={threatInfoHandler} /></h2>
      <ul>
        {matchedData.length === 0 ? (
          <p>Loading...</p>
        ) : (<> <div style={{ display:'flex', flexDirection: 'row', justifyContent:'space-between',marginRight:'5rem' }}>
          <div style={{ width: "fit-content", marginLeft: "0" }}>
            <Pie
              style={{
                width: "17rem",
                marginLeft: "0rem",
                marginTop: "0px",
              }}
              data={chartData}
              options={chartData.options}
            />
            <br></br></div>
            <br></br><div>
            <Bar style={{
                width: "30rem",
                marginLeft: "0rem",
                marginTop: "0px",
              }} 
            options={options} data={bardata} />
            </div></div>
        
          <table className='data-table'>
            <thead>
              <tr>
                {/* <th>ID</th> */}
                <th>Title</th>
                <th>Source</th>
                {/* <th>Status</th> */}
                <th>Technique</th>
                <th>Tactic</th>
                <th>Aim</th>
                <th>Solution</th>
              </tr>
            </thead>
            <tbody>
              {matchedData.map((data, idx) => (
                <tr key={idx}>
                  {/* <td>{data.check_id}</td> */}
                  <td>{data.status === 'fail' ? (
                    <CancelSharpIcon sx={{ color: 'red' }} />
                  ) : (
                    <CheckCircleSharpIcon sx={{ color: 'green' }} />
                  )} {data.title}</td>
                  <td>{data.source}</td>
                  {/* <td>{data.status}</td> */}
                  <td>{data.techniques}</td>
                  <td>{data.tactic}</td>
                  <td>{data.tactic_description}</td>
                  <td>{data.solution}</td>
                </tr>
              ))}
            </tbody>
          </table> </>
        )}

      </ul>
    </div>
  );
};

export default ThreatSeverity;
