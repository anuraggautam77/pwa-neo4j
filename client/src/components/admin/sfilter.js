import React, { Component } from "react";

class SecondaryFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRecord: props.allRecord,
            criteria: props.criteriaContainer

        };
    }
    componentWillReceiveProps(props) {
        this.setState({allRecord: props.allRecord, criteria: props.criteriaContainer})
    }
    changeFilter(flag) {

        switch (flag) {
            case "TOP":
                this.state.allRecord.map((obj, i) => {
                    if (i <= 10) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });

                break;

            case "LEAST":
                this.state.allRecord.map((obj, i) => {
                    if (i > 10) {
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
                <div className={`row zipcode-filter ${this.state.criteria }`}>
                    <div className="well panel-heading alignheading">
                        <div className="widget-tile">
                            <section>
                                <h5>
                                    <strong> SECONDARY FILTERS</strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <a href="javascript:void(0)" onClick={() => this.props.secondaryfilterRecord(this.changeFilter("TOP"))}>
                                            <h3>Top Cities </h3>
                                            <div className="progress xs redColor"></div>
                                        </a>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="javascript:void(0)" onClick={() => this.props.secondaryfilterRecord(this.changeFilter("LEAST"))}>
                                            <h3> Rest of the Cities  </h3>
                                            <div className="progress xs green"></div>
                                        </a>
                                    </div>
                                </div>
                
                            </section>
                            <strong> <button type="button" onClick={() => this.props.secondaryfilterRecord(this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button></strong>
                        </div>
                    </div>
                </div>
                );
    }
}

export default SecondaryFilters;
