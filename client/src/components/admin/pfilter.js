import React, { Component } from "react";

class PrimaryFilters extends Component {
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
            case "TOP":
                  this.state.allRecord.map((obj, i) => {
                    if (i <= 5) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                 
                break;

            case "LEAST":
                this.state.allRecord.map((obj, i) => {
                    if (i > 5) {
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
                                    <strong> FILTERS </strong>  
                                </h5>
                                <div className="progress progress-xs progress-white progress-over-tile"></div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.primaryfilterRecord(this.changeFilter("TOP"))}>
                                            <h3>Top Primary Cities </h3>
                                            <div className="progress xs" style={{"backgroundColor": "#b15eae"}}></div>
                                        </a>
                                    </div>
                                </div>
                                 <div className="row">
                                    <div className="col-md-12">
                                        <a href="javascript:void(0)" onClick={() => this.props.primaryfilterRecord(this.changeFilter("LEAST"))}>
                                            <h3>Rest of the Cities  </h3>
                                            <div className="progress xs"  style={{"backgroundColor": "#44b6c0 "}}></div>
                                        </a>
                                    </div>
                                </div>
                
                            </section>
                            <strong> <button type="button" onClick={() => this.props.primaryfilterRecord(this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button></strong>
                        </div>
                    </div>
                </div>
                );
    }
}

export default PrimaryFilters;
