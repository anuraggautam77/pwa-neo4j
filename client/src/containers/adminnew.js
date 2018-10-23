import React, { Component } from "react";
import '../style/css/admin.scss';
import Adminpanel from "../components/admin-new/index";
export default class AdminDashboard extends Component {
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
