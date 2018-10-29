import React, { Component } from "react";

class UserCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.usercount
        };
    }
    componentWillReceiveProps(props) {

        this.setState({count: props.usercount});
    }
    render() {
        var mruCount = this.state.count.userCount[this.state.count.level];
        console.log(this.state.count);
        return (   
                    <div className="small-box" style={{"minHeight":"122px"}}>
                            <div className="inner">
                                <h3  style={{"fontWeight": "normal !important"}} >{mruCount}</h3>
                                            <br/>
                                <h5>REGISTERED USERS</h5>
                            </div>
                            <div className="icon">
                                <i className="glyphicon glyphicon-user"></i>
                            </div>
                     </div>
                 
                 );
              }
             }
    export default UserCount;
