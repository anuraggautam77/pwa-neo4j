import React, { Component } from "react";
import Map from "../components/admin/map";
import '../style/css/admin.scss';
import Adminpanel from "../components/admin/index";
export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <div>
                    <div className="adminpanel main-landing row">
                        <Adminpanel />
                    </div>
                
                </div>
                            );
                }
    }
