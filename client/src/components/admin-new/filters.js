import React, { Component } from "react";

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRecord: props.allRecord

        };
    }
    componentWillReceiveProps(props) {
        this.setState({allRecord: props.allRecord})
    }
    changeFilter(flag) {

        switch (flag) {
            case "IS_AT":
                this.state.allRecord.map((obj, i) => {

                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                break;

            case "IS_EXPECTED_AT":
                this.state.allRecord.map((obj, i) => {
                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                break;

            case "TOP_MOST":
                this.state.allRecord.map((obj, i) => {
                    if (i <= 30 && obj.relation !== "IS_EXPECTED_AT" && obj.relation !== "IS_AT") {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                break;

            case "LEAST_MOST":
                this.state.allRecord.map((obj, i) => {
                    if (i > 30 && obj.relation !== "IS_EXPECTED_AT" && obj.relation !== "IS_AT") {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                break;
            default:
                this.state.allRecord.map((obj, i) => {
                    obj.show = true;
                });
                break;
        }

        return this.state.allRecord;

    }
    render() {
        return (
                <div className="row zipcode-filter" >
                    <div className="well panel-heading alignheading">
                        <div className="widget-tile">
                            <section>
                                <h5>
                                    <strong> FILTERS</strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.filterRecord(this.changeFilter("IS_AT"))}>
                                            <h3>Current MRU's </h3>
                                            <div className="progress xs green"></div>
                                        </a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.filterRecord(this.changeFilter("IS_EXPECTED_AT"))}>
                                            <h3> Future MRU's  </h3>
                                            <div className="progress xs ember"></div>
                                        </a>
                                    </div>
                                </div>
                                
                                 <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.filterRecord(this.changeFilter("TOP_MOST"))}>
                                            <h3>Top Recommendation </h3>
                                            <div className="progress xs topmost"></div>
                                        </a>
                                    </div>
                                </div>
                                
                                
                                <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.filterRecord(this.changeFilter("LEAST_MOST"))}>
                                            <h3> Remaining Location </h3>
                                            <div className="progress xs least"></div>
                                        </a>
                                    </div>
                                </div>
                            </section>
                            <strong> <button type="button" onClick={() => this.props.filterRecord(this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button></strong>
                        </div>
                    </div>
                    
                </div>
                );
    }
}

export default Filters;
