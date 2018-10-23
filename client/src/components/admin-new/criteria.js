import React, { Component } from "react";

class Criteria extends Component {
    constructor(props) {
        super(props);
        this.state = {
            criteria: props.criteriaContainer

        };
    }
    componentWillReceiveProps(props) {
        this.setState({criteria: props.criteriaContainer})
    }
    render() {
        return (
                <div className={` row well panel-heading alignheading ${this.state.criteria }`}>
                    <div className="widget-tile">
                        <section>
                            <h5><strong> Criteria</strong> </h5>
                            <div className="progress progress-xs progress-white progress-over-tile"></div>
                            <div className="row">
                                <div className="col-md-10 label-white">  Popular Location</div>
                                <div className="col-md-2 label-white"> 
                                <input
                                        checked="checked"
                                        type="radio"
                                        name="location"
                                        value="popularLocation"
                                        onChange={ e => this.props.onRadioChange(e)}
                                  /></div>
                
                            </div>
                            <div className="row">
                                <div className="col-md-10 label-white">  Near by Location</div>
                                <div className="col-md-2 label-white"> <input
                                        type="radio"
                                        name="location"
                                        value="nearByLocation"
                                        onChange={e => this.props.onRadioChange(e)}
                                        /></div>
                            </div>
                        </section>
                
                    </div>
                </div>

                );
    }
}

export default Criteria;
