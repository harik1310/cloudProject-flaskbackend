import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import staticMethods from "antd/es/message";


const Table = ({ chart }) => {
  return (
    <>
      <div id="table-wrapper" style={{ width: '100%' }} >
        <Drilldowntable />
      </div>
    </>
  );
};

export default Table;



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

function Drilldowntable(props) {
  const [dataTable, setDataTable] = useState([]);
  // const [passed, setPassed] = useState(0);
  // const [failed, setfailed] = useState(0);
  const [expanded, setExpanded] = useState('');
  const [local_store, set_local_store] = useState({})
  const [dict,setDict] = useState({})

  useEffect(() => {
    let data = localStorage.getItem('projectform')
    if(data){
      data = JSON.parse(data)
      set_local_store(data)
    }
    
  }, [])


  useEffect(() => {
    axios
      .get("http://localhost:8000/chart")
      .then((response) => response.data.rows)
      .then((rows) => {
        // For Table Data
        const tableData = [];
        // let pass_count = 0;
        // let fail_count = 0;

        for (let row of rows) {
          // if (row.status === "pass") {
          //   pass_count += 1;
          // } else {
          //   fail_count += 1;
          // }
          const location_and_resource_id = row.resource_id.split(':')
          const [location, resource_id] = [ location_and_resource_id[3], location_and_resource_id[4] ]
          
          if('awsResourceId' in local_store) {
            if (local_store['awsResourceId'] !== resource_id) {
              continue
            }
          }
          
          tableData.push({
            framework: row.framework,
            title: row.title,
            status: row.status,
            check_id: row.check_id,
            section: row.section,
            location,
            resource_id,
            account : row.account_id
          });
        }
        let counter_dict = {}
        
        tableData.map(item => {
        if (!Object.keys(counter_dict).includes(item.section)) {
          counter_dict[item.section] = [0,0]
        }
        counter_dict[item.section][1]++;
        if(item.status === "pass")
          counter_dict[item.section][0]++;
        console.log("checking")
        console.log(counter_dict)
        
      })
      console.log("dkfskdfkh")
      console.log(counter_dict)
      setDict(counter_dict)
      setDataTable(tableData) 
    });
        //setPassed(pass_count);
        //setfailed(fail_count);
      
      // });
  }, [props]);
  console.log(dataTable)

  // const groupedData = dataTable.reduce((acc, obj) => {
  //   const { section } = obj;
  //   if (!acc[section]) {
  //     acc[section] = [];
  //   }
  //   acc[section].push(obj);
  //   return acc;
  // }, {});

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };

  const getUniqueSections = () => {
    const sections = dataTable.map(item => item.section);
    return [...new Set(sections)];
  };

  const Counter = (a,b) => {
    let pass
    return 
  }


  const uniqueSections = getUniqueSections();
  console.log('gx')
  console.log(uniqueSections)
  console.log("tried"+dict)
  return (
    <div id="drilldown-table">
      {uniqueSections.map(section => (
        <Accordion expanded={expanded === section} onChange={handleAccordionChange(section)} key={section} style={{ width: '54vw' }}>
          <AccordionSummary
            expandIcon={
              expanded === section ? (
                <KeyboardArrowRightIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )
            }
          >
            <Typography>{section}<span style={{marginLeft:"10px"}}>{dict[section][0]}/{dict[section][1]}</span></Typography>
          </AccordionSummary>
          <AccordionDetails >
            {dataTable.map(item => {
              if (item.section === section) {
                return (
                  <Typography style={{ margin: '15px 0', marginLeft: '4rem' }} key={item.resource_id}>
                    {item.status === 'fail' ? (
                      <CancelSharpIcon sx={{ color: 'red' }} />
                    ) : (
                      <CheckCircleSharpIcon sx={{ color: 'green' }} />
                    )}
                    {item.title} 
                    &nbsp; 
                    <code style={{fontSize: '12px'}} >{item.location}</code> &nbsp; 
                    <code style={{color: 'red', fontSize: '12px'}}>{item.account}</code>
                  </Typography>
                );
              }
              return null;
            })}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}


