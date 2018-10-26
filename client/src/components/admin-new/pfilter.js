import React, { Component } from "react";

class PrimaryFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRecord: props.allRecord

        };
    }
    componentWillReceiveProps(props) {
        this.setState({allRecord: props.allRecord});
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
                    <div className="small-box colorone" style={{"minHeight":"122px"}}>
                        <div className="inner">
                            <h6 style={{"marginBottom":"15px"}}>
                                <strong> FILTERS </strong>  
                            </h6>
                            <button onClick={() => this.props.primaryfilterRecord(this.changeFilter("TOP"))} class="btn  btn-sm" style={{"backgroundColor": "#9722d7"}}>Top Primary Cities</button>
                            &nbsp;  <button onClick={() => this.props.primaryfilterRecord(this.changeFilter("LEAST"))} class="btn  btn-sm" style={{"backgroundColor": "#44b6c0"}}>Rest of the Cities</button>
                        </div>
                        <a style={{"color": "#fff"}} href="javascript:void(0)" onClick={() => this.props.primaryfilterRecord(this.changeFilter(""))} className="small-box-footer">Reset filter </a>
                    </div>
               
                            );
                }
            }

            export default PrimaryFilters;
