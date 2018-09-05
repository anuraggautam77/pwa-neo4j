import React, { Component } from "react";

class Mapview extends Component {
    constructor(props) {
        super(props);

    }
    componentWillReceiveProps(props) {

    }
    render() {
        return (
                <div className="row zipcode-filter" >
                    <div className="well panel-heading alignheading">
                        <div className="widget-tile">
                            <section>
                                <h5>
                                    <strong> Map View</strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <a href="javascript:void(0)" onClick={() => this.props.viewtype("DEFAULT")}>
                                            <h3>Default View </h3>
                                            <img src="img/culsterimg/zip/primarycity.png"/>
                                        </a>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="javascript:void(0)" onClick={() => this.props.viewtype("CLUSTER")}>
                                            <h3> Cluster View </h3>
                                            <img src="img/culsterimg/m1.png"/>
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                );
    }
}

export default Mapview;
