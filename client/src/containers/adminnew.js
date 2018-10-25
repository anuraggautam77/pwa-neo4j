import React, { Component } from "react";
        import '../style/css/admin.scss';
        import Adminpanel from "../components/admin-new/index";
        import Loader from 'react-loader-spinner';
        export default class AdminDashboard extends Component {
        constructor(props) {
            super(props);
            this.state={
                loaderShow:"dn"
            }
        }
        
        
        
        render() {
        return (
<div>
    <div className="adminpanel main-landing row">
        <div id="main">
            <div id="header">
                <h4> <span className="glyphicon glyphicon-globe" aria-hidden="true"  /> 
                    MRU APP
                </h4>
            </div>
            <div className={`modal ${this.state.loaderShow}`} style={{ "paddingLeft": "60%", "paddingTop":"28%" }}>
                 <Loader type="Puff"  color="#ff2266fc" height="75" width="75"  /> 
            </div>
           
            <Adminpanel  updateLoader={(value)=>{ this.setState({"loaderShow":value})}} />
        </div>
        </div>
    </div>
    )
    }
    }
