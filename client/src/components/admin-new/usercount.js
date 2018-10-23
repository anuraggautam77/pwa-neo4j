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
                <div className="row zipcode-filter">
                    <div className="well panel-heading alignheading" style={{"textAlign": "center", "marginBottom": "10px"}}>
                        <div className="widget-tile">
                            <section><h5><span>REGISTERED USERS</span></h5>
                                <h4  style={{"color": "#d3455b", "fontWeight": "normal !important"}} >{mruCount}</h4>
                            </section></div>
                    </div>
                </div>
                                    );
                        }
                    }

                    export default UserCount;
