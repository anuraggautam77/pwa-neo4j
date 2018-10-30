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
            return (
                    
                        <tr>
                                    <td className="col-xs-2">{i+1}.</td>
                                    <td className="col-xs-4">{obj.userCount_sum} ({obj.total_users_count_percentages})</td>
                                    <td className="col-xs-2">{(obj.distance_miles_mean)}</td>
                                    <td className="col-xs-4">{(obj.average_dist_covered_users)}({obj.avg_dist_covered_users_percentages})</td>
                        </tr>
                        
                        
                        
                        );

                    });
            return template;
        }
        render() {

            return (
                    
                        <table className="table table-bordered text-center table-fixed">
                            <thead>
                                <tr>
                                    <th className="col-xs-2">Cluster</th>
                                    <th className="col-xs-4">Users(%)</th>
                                    <th className="col-xs-2">Avg dis</th>
                                    <th className="col-xs-4">Avg dis users(%)</th>
                                </tr>
                                  
                            </thead>
                            <tbody>
                                 {this.rowcol()}
                            </tbody>
                        </table>
                                );
                    }
        }

        export default ClusterMatrix;
