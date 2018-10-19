import React, { Component } from "react";
class ClusterMatrix extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matrix: props.matrix,
            centriod: props.centriod
        };
    }
    componentWillReceiveProps(props) {
        this.setState({matrix: props.matrix, centriod: props.centriod});
    }
    markerBounce(i) {
        //   this.state.centriod[i].setAnimation(google.maps.Animation.BOUNCE);
    }
    rowcol() {
        console.log(this.state);
        var template = this.state.matrix.map((obj, i) => {
            return (
                    <div className="row" key={i}  onMouseOver={ (i) => {
                            this.markerBounce(i)
                                         }}  >
                        <div className="col-md-2">{obj.cid + 1}</div>
                        <div className="col-md-3">{obj.count}</div>
                        <div className="col-md-3">{Math.min(...obj.distance).toFixed(2)} </div>
                        <div className="col-md-4">{Math.max(...obj.distance).toFixed(2)}</div>
                    </div>
                        )

        })
        return template;
    }
    render() {
        console.log(this.state.matrix)
        return (
                <div className="row zipcode-filter">
                    <div className="well panel-heading alignheading">
                        <div className="widget-tile">
                            <section>
                                <h5>
                                    <strong> Cluster Matrix </strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row" style={{"marginBottom": "10px"}}>
                                    <div className="col-md-2 label-white"><h6><strong>S.no</strong></h6></div>
                                    <div className="col-md-3 label-white"><h6><strong>Users</strong></h6></div>
                                    <div className="col-md-3 label-white"><h6><strong>Min Dis</strong></h6></div>
                                    <div className="col-md-4 label-white"><h6><strong>Max Dis</strong></h6></div>
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
