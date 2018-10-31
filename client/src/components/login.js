
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionToken: null,
            error: null,
            username: '',
            password: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const {username, password} = this.state;
        fetch('/api/adminlogin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})

        }).then(res => res.json()).then(json => {
            if (json.success) {
                localStorage.setItem('jwtToken', json.token);
                localStorage.setItem('userid', json.userid);
                this.props.history.push("/heatmap");
            }else{
                this.setState({error:json.msg});
            }
        });
    }
    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }
    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }
    render() {
        return (
                <div className="adminlogin">
                    <div id="login">
                        <div className="container">
                            <div id="login-row" className="row justify-content-center align-items-center">
                                <div id="login-column" className="col-md-6 col-md-6 col-md-offset-3">
                                    <div id="login-box" className="col-md-12">
                                        <form id="login-form" className="form">
                                            <h3 className="text-center text-info">Administrator Log-in</h3>
                                            {this.state.error}
                                            <div className="form-group">
                                                <label className="text-info">Username:</label><br/>
                                                <input type="text"
                                                       name="username" 
                                                       id="username"
                                                       value={this.state.username}
                                                       onChange={this.handleUsernameChange}
                                                       className="form-control"/>
                                            </div>
                                            <div className="form-group">
                                                <label  className="text-info">Password:</label><br/>
                                                <input type="password"
                                                       value={this.state.password}
                                                       onChange={this.handlePasswordChange}
                                                       name="password" id="password" className="form-control"/>
                                            </div>
                                            <div className="form-group">
                                                <input type="button" name="submit" className="btn btn-info btn-md" onClick={this.handleSubmit} value="submit"/>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
                );
    }
}
export default withRouter(Login);

