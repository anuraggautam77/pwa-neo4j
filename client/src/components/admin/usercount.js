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
                    <div className="well panel-heading alignheading" style={{"textAlign": "center", "marginBottom": "10px", "padding":"25px 0"}}>
                        <div className="widget-tile">
                            <section><h5><span>REGISTERED USERS</span></h5>
                                <h1  style={{"color": "#d3455b", "fontWeight": "normal !important"}} >{mruCount}</h1>
                            </section></div>
                    </div>
                    
                    
                    <div className="well panel-heading alignheading" style={{"padding": "20px 0","textAlign":"center"}}>
                        <div className="row" style={{"marginBottom": "10px"}}>
                            <div className="col-md-4 label-white"><h5><strong>MRU</strong></h5></div>
                            <div className="col-md-4 label-white"><h5><strong>Promotion</strong></h5></div>
                            <div className="col-md-4 label-white"><h5><strong>Coupon</strong></h5></div>
                        </div>
                        <div className="row">
                            <div className="col-md-4" style={{"fontSize": "16px", "color": "rgb(48, 113, 169)"}}>{mruCount}</div>
                            <div className="col-md-4" style={{"fontSize": "16px", "color": "rgb(48, 113, 169)"}}>0</div>
                            <div className="col-md-4" style={{"fontSize": "16px", "color": "rgb(48, 113, 169)"}}>0</div>
                        </div>
                    </div>
                
                
                
                
                
                </div>
                                    );
                        }
                    }

                    export default UserCount;
