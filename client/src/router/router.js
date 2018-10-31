import React, { Component } from 'react';
        import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom';
        import Dashboard from '../containers/admin';
        import AdminDashboard from '../containers/adminnew';
        import MainPage from '../containers/user';
        import Adminlogin from '../containers/adminlogin';
        import Auth from '../common/auth';
        export default class Routing extends Component {

        constructor(props) {
        super (props);
        }

        render() {
            
                         
const PrivateRoute =({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) =>{  
                         return(Auth.isUserAuthenticated() ?
                                 (<Component {...props}/> ) :
                                (<Redirect to={{  pathname: '/login', state: { from: props.location } }}/> )
                             )}
                    }/>
 )
 
 return (
    <Router>
        <div className="container">
            <Route path="/" exact component={MainPage} />
            <Route path="/user" exact component={MainPage} />
          
            <Route path="/login" exact component={Adminlogin} /> 
            <PrivateRoute path="/admin" exact component={Dashboard} />
            <PrivateRoute path="/graphadmin" exact component={AdminDashboard} />
        </div>
    </Router>
 )
                }
                };
