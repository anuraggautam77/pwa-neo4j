import React, { Component } from "react";
import Map from "../components/admin/map";
import NearbyUser from "../components/admin/nearbyusers";
import moment from "moment";
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
   
    
  
render() {
    return (
            <div>
                <div className="main-landing row content" style={{'marginTop': '10px'}}>
                    <NearbyUser />
                </div>

            </div>
                            );
                    }
            
                    }
