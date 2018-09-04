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
    <div className="panel panel-default">
        <div className="panel-heading">
            <h5><b>User Subscription   </b> </h5>
        </div>
        <div className="panel-body">
            <input ref='cityname' id="id_address" className="form-control input-first places-autocomplete" type="text"   placeholder="City Name,Country Name" /> 
            <div>
                <select onChange={(event) =>{this.props.ondropdownchange(event.target.value); }}  >
                    <option value="">Select one</option>
                    <option value="mru">Mobile Retail Unit</option>
                    <option value="promo">Promotion</option>
                    <option value="coup">Coupon</option>
                </select>
            </div>
        </div>
        <div className="panel-footer">
            <button  className='btn btn-primary btn-xs crntlo' ref="crntloc" onClick={ this.props.handleCurrentLocation} type='button'>Set Location
                &nbsp; <span className="glyphicon glyphicon-map-marker"> </span></button> 
        </div>
    </div>
</div>
                        );
        }
    }

    export default Registration;
