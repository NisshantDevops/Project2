import React from "react";
import Route from "./Routes"
import './assets/scss/themes.scss';
import { ToastContainer } from "react-toastify";


function App(){
  return (
    <>
          <ToastContainer 
          position="top-right"
          autoClose={3000}
        />
    <React.Fragment>
    <ToastContainer position="top-right" autoClose={3000} />
      <Route/>
    </React.Fragment>
    </>
  );
}




export default App;