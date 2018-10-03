import React, { Component } from "react";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillReceiveProps(props) {

    }
    render() {
        return (<div>
            <div className="row">
                <div className="col-md-3 col-sm-12" style={{"padding":"4px","margin":"0"}} >
                    <select  className="form-control" onChange={(event) => {
                        this.props.ondropdownchange(event.target.value);
                 }}  >
                        <option value="">Select one</option>
                        <option value="mru">Mobile Retail Unit</option>
                        <option value="promo">Promotion</option>
                        <option value="coup">Coupon</option>
                    </select>
                </div>
                <div className="col-md-6 col-sm-12" style={{"padding":"4px","margin":"0"}} >
                    <input  ref='cityname' id="id_address" className="form-control input-first places-autocomplete" type="text"   placeholder="City Name,Country Name" /> 
        
                </div>
                <div className="col-md-2 col-sm-12" style={{"padding":"4px","margin":"0"}} >
                    <button  className='btn btn-primary btn-xs crntlo' ref="crntloc" onClick={ this.props.handleCurrentLocation} type='button'>Set Location
                        &nbsp; <span className="glyphicon glyphicon-map-marker"> </span></button> 
                </div>
            </div>
        </div>
                    );
    }
}

export default Registration;
