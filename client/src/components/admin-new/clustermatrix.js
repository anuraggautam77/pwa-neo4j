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
                                     <td>{i+1}.</td>
                                    <td>{obj.userCount_sum} ({obj.total_users_count_percentages})</td>
                                    <td>{(obj.distance_miles_mean).toFixed(2)}</td>
                                    <td>{(obj.average_dist_covered_users).toFixed(2)}({obj.avg_dist_covered_users_percentages})</td>
                        </tr>
                        
                        
                        
                        );

                    });
            return template;
        }
        render() {

            return (
                    
                        <table class="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>Cluster</th>
                                    <th>Users(%)</th>
                                    <th>Avg dis</th>
                                    <th>Avg dis users(%)</th>
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
