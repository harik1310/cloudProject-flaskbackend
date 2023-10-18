import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from '@mui/material/Box'
import axio from 'axios';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Mainpage from "./Components/Mainpage";
import ProjectForm from "./Components/Charts/Projectform";
import AttackPatterns from "./Components/Attacks/Attackpatterns";
import NestedList from "./Components/Dashboard/Sidenav/Sidenav";
import { AppBar } from "@mui/material";
import PrimarySearchAppBar from "./Components/Dashboard/Topnav/Topnav";
import Myresources from "./Components/Myresources/MyResources";
import Policies from "./Components/Policies/Policies";
import ThreatSeverity from "./Components/Threats/Threats";
// import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/Signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <HeaderAndSidebar>
                <Mainpage />
              </HeaderAndSidebar>}
          />

          <Route
            path="/projectform"
            element={
              <HeaderAndSidebar>
                <ProjectForm />
              </HeaderAndSidebar>}
          />

          <Route
            path="/attack-patterns"
            element={
              <HeaderAndSidebar>
                <AttackPatterns />
              </HeaderAndSidebar>}
          />

          <Route
            path="/myresources"
            element={
              <HeaderAndSidebar>
                <Myresources />
              </HeaderAndSidebar>}
          />

          <Route
            path="/policies"
            element={
              <HeaderAndSidebar>
                <Policies />
              </HeaderAndSidebar>}
          />

          <Route
            path="/threats"
            element={
              <HeaderAndSidebar>
                <ThreatSeverity style={{marginLeft:'2rem',marginTop:'1rem'}} />
              </HeaderAndSidebar>}
          />

        </Routes>
      </div>
    </Router>
  );
}

const HeaderAndSidebar = ({ children }) => {
  return (
    <>
      <PrimarySearchAppBar />
      <div className="dash">
        <Box sx={{ flexGrow: 1, width: "100vw" }}>
          <NestedList style />
          <div style={{ marginLeft:"13rem",marginTop:'1rem' }}>
            {children}
          </div>
        </Box>
      </div>

    </>
  )
}

export default App;
