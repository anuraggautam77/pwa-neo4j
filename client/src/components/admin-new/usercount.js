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
                    <div className="small-box box-color-three" style={{"minHeight":"122px"}}>
                     <div className="small-box-footer" >  <h5>Registered Users</h5>  </div>
                            <div className="inner text-center">
                                <h3  style={{"color":"#4fa8af","paddingTop":"16px", "fontWeight": "normal !important"}} >{mruCount}</h3>
                                            <br/>
                              
                            </div>
                            
                     </div>
                 
                 );
              }
             }
    export default UserCount;
