
import React, { Component } from 'react';
import '../style/css/adminlogin.scss';
import Login from '../components/login';
import { withRouter } from "react-router-dom";
import Auth from '../common/auth';

class Adminlogin extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        if (Auth.isUserAuthenticated()) {
            this.props.history.push("/heatmap");
        }
    }
    componentDidMount() { }
    render() {
        return (
                <Login/>
                );

    }
}

export default withRouter(Adminlogin);
