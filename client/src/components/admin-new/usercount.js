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
        return (   
                    <div className="small-box colorone" style={{"minHeight":"122px"}}>
                            <div className="inner">
                                <h3  style={{"fontWeight": "normal !important"}} >{mruCount}</h3>
                                            <br/>
                                <h6>REGISTERED USERS</h6>
                            </div>
                            <div className="icon">
                                <i className="glyphicon glyphicon-user"></i>
                            </div>
                            <div className="small-box-footer">&nbsp;  </div>
                     </div>
                 
                 );
              }
             }
    export default UserCount;
