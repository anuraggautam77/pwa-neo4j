import React, { Component } from "react";
import PubSub from 'pubsub-js';
import { NavLink ,withRouter } from 'react-router-dom';

class NavMenu extends Component {

  constructor(props) {
    super (props);
  };
      
    render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-collapse">
            {(()=>{
              return (
                <ul className="nav navbar-nav">
              <li>
              <NavLink to="/main" activeClassName="active" >
                  User Panel
              </NavLink>
              </li>

              <li>
              <NavLink to="/dashboard" activeClassName="active" >
                 Admin Dashboard
              </NavLink>
              </li>
              
               </ul>
              )
               
            })()} 
      
          </div>
        </div>
      </nav>
      )
  }
  ;
}

export default withRouter(NavMenu) ;
