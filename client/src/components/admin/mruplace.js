import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class MruPlaceConatiner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showdate: "dn",
            mruDetails: {
                startDate: moment(),
                zipcode: "",
                cityname: "",
                mruID: "",
                mruContainer: "dn",
                placedat: "IS_AT",
                mruRelateTo: ""
            }
        };

        this.dateChange = this.dateChange.bind(this);
        this.placemruHandler = this.placemruHandler.bind(this);
        this.endMruHandler = this.endMruHandler.bind(this);
        this.closeMruContainer = this.closeMruContainer.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({
            mruDetails: {
                ...this.state.mruDetails,
                ...props.mruDetails
            }
        });
    }
    placemruHandler() {
        var date = null;
        if (this.state.mruDetails.placedat === "IS_AT") {
            date = moment().format("YYYY-MM-DD");
        } else {
            date = this.state.mruDetails.startDate.format("YYYY-MM-DD");
        }

        var postData = {
            startDate: date,
            relationTo: this.state.mruDetails.placedat,
            zipcode: this.state.mruDetails.zipcode,
            mruID: this.state.mruDetails.mruID
        };
        this.placeMruApiCall(postData);
    }
    placeMruApiCall(postData) {

        fetch("api/placemru", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({data: postData})
        })
                .then(res => res.json())
                .then(json => {
                    //this.setState({clusters: json.mapdata, clusterShow: true});
                }
                );


    }
    endMruHandler( ) {
        var postData = {
            startDate: moment().format("YYYY-MM-DD"),
            relationTo: "WAS_AT",
            zipcode: this.state.mruDetails.zipcode,
            mruID: this.state.mruDetails.mruID
        };
        this.placeMruApiCall(postData);
    }
    closeMruContainer() {
        this.setState({
            mruDetails: {
                ...this.state.mruDetails,
                mruContainer: "dn"
            }});
        
    }
    dateChange(date) {
        this.setState({
            mruDetails: {
                ...this.state.mruDetails,
                startDate: date
            }
        });
    }
    render() {

        return (
                <div className="col-md-3 col-sm-12  admin-proilecard">
                    <div className={`panel panel-default ${this.state.mruDetails.mruContainer}`}>
                        <div className="panel-heading">
                            <span>
                                <b>
                                    MRU Place at: {this.state.mruDetails.cityname}(
                                    {this.state.mruDetails.zipcode}) 
                                </b>
                            </span>
                            <span className="pull-right pointer" onClick={ this.closeMruContainer} >
                                <b>X</b>
                            </span>
                            {(() => {
                                            if (this.state.mruDetails.alreadyTextmru !== "") {
                                                return <h6>{this.state.mruDetails.alreadyTextmru}</h6>;
                            }
                            })()}
                        </div>
                
                        <div className="panel-body">
                            <select
                                onChange={
                                    (event) => {
                                        this.setState({
                                            mruDetails: {
                                                    ...this.state.mruDetails,
                                                    placedat: event.target.value
                                                                                                                                           }
                                })
                
                                if(event.target.value === "IS_AT") {
                                                                    this.setState({showdate: "dn" });
                                } else {
                                                                            this.setState({showdate: "db" });
                                }
                                }}
                                >
                                <option value="IS_AT">At Location</option>
                                <option value="IS_EXPECTED_AT">Expected to Location</option>
                            </select>
                
                            <div className={
                                                                `${this.state.showdate}`}>
                                <label>Date :</label>
                                <DatePicker
                                    selected={this.state.mruDetails.startDate}
                                    onChange={this.dateChange}
                                    minDate={moment()}
                                    />
                                &nbsp; &nbsp;
                            </div>
                            <div>
                                <label>MRU Type :</label>
                                <br />
                                <input
                                    type="text"
                                    id="mru-id"
                                    onChange={event => {
                                                                    this.setState({
                                                                        mruDetails: {
                                                                            ...this.state.mruDetails,
                                                                            mruID: event.target.value
                                                                                                                                                              }
                                    })
                                    }}
                                    value={
                                                                            this.state.mruDetails.mruID || ""}
                                    name="mru-id"
                                    />
                            </div>
                        </div>
                        <div className="panel-footer">
                            <button
                                className="btn btn-primary btn-xs"
                                ref="placemru"
                                onClick={this.placemruHandler}
                                type="button"
                                >
                                Place Mru
                            </button>
                            &nbsp;
                            {(() => {
                                                                                            if (this.state.mruDetails.mruRelateTo !== "") {
                                                                                                return (
                                                                                                    <button
                                                                                                        className="btn btn-primary btn-xs"
                                                                                                        ref="placemru"
                                                                                                        onClick={ this.endMruHandler}
                                                                                                        type="button"
                                                                                                        >
                                                                                                        End Mru
                                                                                                    </button>
                                                                                                        );
                            }
                            })()}
                        </div>
                    </div>
                </div>
                                                                        );
                                    }
                                }

                                export default MruPlaceConatiner;
