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
                    <div className="small-box  box-color-three" style={{"minHeight":"122px"}}>
                      <div className="small-box-footer">  <h5>Filters</h5>  </div>
                        <div className="inner text-center">
                            <button onClick={() => this.props.primaryfilterRecord(this.changeFilter("TOP"))} className="btn  btn-sm" style={{"backgroundColor": "#638ca6", "color":"#fff","marginRight":"38px"}}>Top Primary Cities</button>
                            &nbsp;  <button onClick={() => this.props.primaryfilterRecord(this.changeFilter("LEAST"))} className="btn  btn-sm" style={{"backgroundColor": "#53bf8a", "color":"#fff"}}>Rest of the Cities</button>
                        </div>
                        <div className="text-center"> 
                        <a style={{"color":"#fff"}} href="javascript:void(0)" onClick={() => this.props.primaryfilterRecord(this.changeFilter(""))} className="btn btn-sm btn-danger text-center">Reset filter </a>
                                </div>
                       
                    </div>
               
                            );
                }
            }

            export default PrimaryFilters;
