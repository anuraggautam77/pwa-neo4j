import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from '../containers/dashboard';
import MainPage from '../containers/mainpage';
import NavMenu from '../components/navigation/nav';
 

export default class Routing extends Component {
    
    constructor(props) {
        super (props);
    }
  
    render() {
     
        return (
            <Router>
               <div>
                <div className="container-full">
                      <NavMenu islogin={this.props.islogin}/>
                 </div>
                 <div className="container">
                    <Route path="/" exact component={MainPage} />
                    <Route path="/main" exact component={MainPage} />
                    <Route path="/dashboard" exact component={Dashboard} />
                </div>
               
             </div>      
            </Router>
        )
    }
};
