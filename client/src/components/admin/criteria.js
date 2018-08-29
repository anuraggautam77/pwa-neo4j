import React, { Component } from "react";

class Criteria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            criteria:props.criteriaContainer
           
        };
    }
    componentWillReceiveProps(props) {
        this.setState({criteria:props.criteriaContainer})
    }
    
    render() {
        return ( <div>
                <div className= { `panel-heading alignheading ${this.state.criteria }`}>
                                <div className="panel-body">
                                    <label className="input-group col-md-3 col-sm-3">
                                        <span className="input-group-addon">
                                            <input
                                                type="radio"
                                                name="location"
                                                value="popularLocation"
                                                onChange={ e => this.props.onRadioChange(e)}
                                                />
                                        </span> 
                                        <div className="form-control form-control-static">
                                            Popular Location
                                        </div>
                                    </label> 
                                    <label className="input-group col-md-3 col-sm-3">
                                        <span className="input-group-addon">
                                            <input
                                                type="radio"
                                                name="location"
                                                value="nearByLocation"
                                                onChange={e => this.props.onRadioChange(e)}
                                                />
                                        </span>
                                        <div className="form-control form-control-static">
                                            Near by Location
                                        </div>
                                    </label> 
                                </div> 
                            </div>
                            </div>
                                                    );
            }
        }

        export default Criteria;
