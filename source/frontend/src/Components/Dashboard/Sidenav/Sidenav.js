import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";


export default function NestedList() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const goToProject = () => {
    window.location.href = "/projectform";
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <List
      sx={{
        // height: "100vh",
        width: "100%",
        maxWidth: "200px",
        bgcolor: "#dddd",
        //height : '100vh',
        position : 'fixed',
        height: "100%",
        zIndex: 20,
        top: "4rem",
        listStyle: 'none'
      }}
      component="nav"
    >
      <ListItemButton onClick={goToProject}>
        <ListItemText primary="Projects" />
      </ListItemButton>
      <ListItemButton onClick={goToDashboard}>
        <ListItemText primary="Overview" />
      </ListItemButton>

      {/* <ListItemButton>
        <ListItemText primary="Inventory" />
      </ListItemButton> */}
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Security" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open}
        timeout="auto"
        //unmountOnExit
      >
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 2 }}>
            <ListItemText primary="Policies" />
          </ListItemButton>
          {/* <ListItemButton>
            <ListItemText primary="Recommendations" />
          </ListItemButton> */}
        </List>
      </Collapse>
    </List>
  );
}
