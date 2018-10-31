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
                    <div className="small-box box-color-four" style={{"minHeight":"122px"}}>
                     <div className="small-box-footer">  <h5>Registered Users</h5>  </div>
                            <div className="inner">
                                <h3  style={{"fontWeight": "normal !important"}} >{mruCount}</h3>
                                            <br/>
                              
                            </div>
                            <div className="icon">
                                <i className="glyphicon glyphicon-user"></i>
                            </div>
                     </div>
                 
                 );
              }
             }
    export default UserCount;
