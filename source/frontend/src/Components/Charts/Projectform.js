import axios from 'axios';
import React, { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./policyselect.css";
import './projectform.css'
// import "/home/harih/Desktop/templates/src/App.css";
import "../Charts/donut";
import { url } from '../../config.js'


export default function Projectform() {
  const [projectName, setProjectName] = useState('');
  const [awsResourceId, setAwsResourceId] = useState('');
  const [gcpResourceId, setGcpResourceId] = useState('');
  const [azureResourceId, setAzureResourceId] = useState('');
  const [dataTableProject, setDataTableProject] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || (!awsResourceId && !gcpResourceId && !azureResourceId)) {
      alert('Please enter all required fields.');
      return;
    }
    const data = {
      projectName,
      awsResourceId,
      gcpResourceId,
      azureResourceId,
    };

    try {
      await axios.post( url + '/api/projects', data);

      setProjectName('');
      setAwsResourceId('');
      setGcpResourceId('');
      setAzureResourceId('');

      const localStorageData = JSON.stringify(data)
      localStorage.setItem('projectform', localStorageData)

      alert('Project details submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting the project details.');
    }
  };

  useEffect(() => {
    axios
      .get( url + "/getprojects")
      .then((response) => response.data.rows)
      .then((rows) => {
        const tableData = [];
        for (let row of rows) {
          tableData.push({
            projectname: row.project_name,
            awsId: row.aws_resource_id,
            gcpId: row.gcp_resource_id,
            azureId: row.azure_resource_id,
          });
        }
        setDataTableProject(tableData);
      });
  }, [dataTableProject]);

  console.log(dataTableProject)

  return (
    <><div>
      <form onSubmit={handleSubmit} style={{
        margin: '4rem',
        width: '',
        height: '',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', justifyContent: '' }}>

          <input
            type="text"
            id="projectName"
            placeholder="Project Name"
            style={{ height: '40px', }}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <br></br>
        <div style={{ display: 'flex', justifyContent: '' }}>
          <input
            type="text"
            id="awsResourceId"
            placeholder="Aws resource id"
            style={{ height: '40px' }}
            value={awsResourceId}
            onChange={(e) => setAwsResourceId(e.target.value)}
          />
        </div>
        <br></br>
        <div style={{ display: 'flex', justifyContent: '' }}>
          <input
            type="text"
            id="gcpResourceId"
            placeholder="GCP resource id"
            value={gcpResourceId}
            style={{ height: '40px' }}
            onChange={(e) => setGcpResourceId(e.target.value)}
          />
        </div>
        <br></br>
        <div style={{ display: 'flex', justifyContent: '' }}>
          <input
            type="text"
            id="azureResourceId"
            placeholder="Azure resource id"
            value={azureResourceId}
            style={{ height: '40px' }}
            onChange={(e) => setAzureResourceId(e.target.value)}
          />
        </div>
        <button type="submit" style={{ width: '5rem', height: '2.3rem', alignItems: '' }}>Add </button>
      </form>
      <div className='Project-details-container' style={{display:'flex',justifyContent:'space-between'}}>
        <div className='projects-list'>
          {dataTableProject.map(item => (
            <Accordion style={{ width: '40vw', marginLeft: '10rem' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item.projectname}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <table >
                  <thead>
                  <td>AWS Id</td>
                  <td>GCP Id</td>
                  <td>Azure Id</td>
                  </thead>
                  <tr>
                    <td>{item.awsId}</td>
                    <td> {item.gcpId}</td>
                    <td> {item.azureId}</td>
                  </tr>
                  </table>
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <div style={{marginRight:'10rem'}}>
          
        </div>
      </div>
    </div>
    </>
  );
};

