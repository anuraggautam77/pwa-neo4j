import React, { Component } from "react";

class ClusterMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matrix: props.matrix
           
        };
    }
    componentWillReceiveProps(props) {
        this.setState({matrix: props.matrix});
    }
    
    rowcol() {
       
        var template = this.state.matrix.map((obj, i) => {
            console.log(obj)
            return (
                    <div className="row" style={{"borderBottom":"1px solid #2f455a"}} key={i}   >
                        <div className="col-md-2">{obj.cluster + 1}</div>
                        <div className="col-md-3">{obj.userCount_sum}</div>
                        <div className="col-md-3">{(obj.distance_miles_mean).toFixed(2)} </div>
                        <div className="col-md-4">{(obj.distance_miles_max).toFixed(2)}</div>
                    </div>
                        );

        });
        return template;
    }
    render() {
      
        return (
                <div className="row zipcode-filter">
                    <div className="well panel-heading alignheading">
                        <div className="widget-tile">
                            <section>
                                <h5>
                                    <strong> Cluster Matrix </strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row" style={{"borderBottom":"1px solid #2f455a"}}>
                                    <div className="col-md-2 label-white"><h6>S.no</h6></div>
                                    <div className="col-md-3 label-white"><h6>Users</h6></div>
                                    <div className="col-md-3 label-white"><h6>Avg Dis</h6></div>
                                    <div className="col-md-4 label-white"><h6>Max Dis</h6></div>
                                </div>
                                {this.rowcol()}
                            </section>
                        </div>
                    </div>
                </div>
                                );
                    }
                }

        export default ClusterMatrix;
