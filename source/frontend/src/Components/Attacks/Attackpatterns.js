import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../config.js'
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import './Attack.css'

const AttackPatterns = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/attackpatterns');
      setData(response.data.rows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.post( url +'/bardapi');
  //     setData(response.data.rows);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const filteredRows = data.filter(row => {
    return row.techniques !== 'NaN' && row.tactics !== 'NaN' && row.mitigations !== 'NaN';
  });

  console.log(filteredRows)

  return (
    <div>
      <h2>Attack Patterns</h2>
      <table className='tactic-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Source</th>
            <th>Subscription ID</th>
            <th>Status</th>
            {/* <th>ID</th> */}
            <th>Techniques</th>
            <th>Tactics</th>
            <th>Mitigations</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              <td>{row.status === 'fail' ? (
                      <CancelSharpIcon sx={{ color: 'red' }} />
                    ) : (
                      <CheckCircleSharpIcon sx={{ color: 'green' }} />
                    )}  {row.title}</td>
              <td>{row.source}</td>
              <td>{row.subscription_id}</td>
              <td>{row.status}</td>
              {/* <td>{row.id}</td> */}
              <td>{(row.techniques === 'NaN') ? "-" : row.techniques}</td>
              <td>{(row.tactics === 'NaN') ? "-" : row.tactics}</td>
              <td>{(row.mitigations === 'NaN') ? "-" : row.mitigations}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttackPatterns;

