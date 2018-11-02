import React, { Component } from "react";

import { BrowserRouter as Router, Route, Link ,withRouter}
from "react-router-dom";
import '../style/css/admin.scss';
import Adminpanel from "../components/admin-new/index";
import Loader from 'react-loader-spinner';
class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaderShow: "dn" 
        }
    }
    
    
    logoutHandler(){
       localStorage.removeItem('jwtToken');  
         localStorage.removeItem('userid');  
            this.props.history.push("/login");
    }
    render() {
        return (
                <div>
                    <div className="adminpanel main-landing row">
                        <div id="main">
                            <div className={`modal ${this.state.loaderShow}`} style={{"paddingLeft": "45%", "paddingTop": "28%" }}>
                                <Loader type="Puff"  color="#ff2266fc" height="75" width="75"  /> 
                            </div>
                               <div id="header">
                               <h4  style={{"float": "left"}}> 
                                <span className="glyphicon glyphicon-globe" aria-hidden="true"/> 
                                    MRU APP
                                 
                                </h4>
                              
                               <div style={{"float": "right","paddingRight":"22px","paddingTop":"11px"}}>
                                     <a style={{"color":"#fff"}} href="javascript:void(0)" onClick={()=>{this.logoutHandler()}}>
                                             <b>Logout</b> 
                                    </a>
                                
                                </div>
                               
                                
                               
                                </div>
                            <Adminpanel  updateLoader={(value) => { this.setState({"loaderShow": value})}} />
                        </div>
                    </div>
                </div>
                            )
                    }
                }

export default withRouter(AdminDashboard);