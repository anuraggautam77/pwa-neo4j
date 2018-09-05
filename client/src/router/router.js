import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from '../containers/admin';
import MainPage from '../containers/user';
import NavMenu from '../components/navigation/nav';
 

export default class Routing extends Component {
    
    constructor(props) {
        super (props);
    }
  
    render() {
        return (
            <Router>
                 <div className="container">
                    <Route path="/" exact component={MainPage} />
                    <Route path="/user" exact component={MainPage} />
                    <Route path="/admin" exact component={Dashboard} />
                </div>
            </Router>
        )
    }
};
