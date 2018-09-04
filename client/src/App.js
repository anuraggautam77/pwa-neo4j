import React, {PropTypes, Component} from 'react';
import { withRouter } from "react-router-dom";

import './style/css/App.scss';
import Routing from './router/router';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (<Routing/>);
    }
}

export default withRouter(App);
