import React, { Component } from "react";
import DatePicker from "react-datepicker";
import GraphOverlay from "./endmruoverlay";
import "react-datepicker/dist/react-datepicker.css";
const sortByDistance = require("sort-by-distance");

import moment from "moment";
class MruPlaceConatiner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showdate: "dn",
      showsuccess: "dn",
      successdata: null,
      showgraph:"dn",
      mruDetails: {
        startDate: moment(),
        zipcode: "",
        cityname: "",
        mruID: "",
        mruContainer: "dn",
        placedat: "IS_AT",
        mruRelateTo: "",
        mruprevRelation: "",
        preDate: ""
      }
    };
    this.dateChange = this.dateChange.bind(this);
    this.placemruHandler = this.placemruHandler.bind(this);
    this.endMruHandler = this.endMruHandler.bind(this);

    this.recommendedLocation = this.recommendedLocation.bind(this);
    
    this.showGraphHandler= this.showGraphHandler.bind(this);
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
      date = moment().format();
    } else {
      date = this.state.mruDetails.startDate.format();
    }

    var postData = {
      startDate: date,
      relationTo: this.state.mruDetails.placedat,
      zipcode: this.state.mruDetails.zipcode,
      mruID: this.state.mruDetails.mruID,
      mruprevRelation: this.state.mruDetails.mruprevRelation,
      prevdate: this.state.mruDetails.preDate
    };
    this.placeMruApiCall(postData);
  }
  placeMruApiCall(postData) {
    fetch("api/placemru", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: postData })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          mruDetails: {
            ...this.state.mruDetails,
            mruContainer: json.mapdata.data === null ? "db" : "dn"
          },
          showsuccess: json.mapdata.data === null ? "dn" : "db",
          successdata: json.mapdata.data === null ? null : json.mapdata.data
        });
      });
  }
  endMruHandler() {
    var postData = {
      startDate: moment().format(),
      relationTo: "WAS_AT",
      zipcode: this.state.mruDetails.zipcode,
      mruID: this.state.mruDetails.mruID,
      mruprevRelation: this.state.mruDetails.mruprevRelation,
      prevdate: this.state.mruDetails.preDate
    };

    this.setState({
      mruDetails: {
        ...this.state.mruDetails,
        mruRelateTo: "WAS_AT"
      }
    });
    this.placeMruApiCall(postData);
  }
  closeMruContainer() {
    this.setState({
      ...this.state,
      showsuccess: "dn",
      mruDetails: {
        ...this.state.mruDetails,
        mruContainer: "dn"
      }
    });
  }
  recommendedLocation() {
    var recomenedLoc = [];
    var origin = {
      latitude: this.state.mruDetails.currentloc.lat(),
      longitude: this.state.mruDetails.currentloc.lng()
    };

    this.props.allRecord.map((obj, i) => {
      if (
        i <= 30 &&
        obj.relation !== "IS_EXPECTED_AT" &&
        obj.relation !== "IS_AT"
      ) {
        obj.show = true;
        if (
          origin.latitude !== obj.latitude &&
          origin.longitude !== obj.longitude
        ) {
          recomenedLoc.push(obj);
        }
      } else {
        obj.show = false;
      }
    });

    const opts = {
      yName: "latitude",
      xName: "longitude"
    };

    var sortBy = sortByDistance(origin, recomenedLoc, opts);

    sortBy.map((obj, i) => {});

    return this.props.allRecord;
  }

  dateChange(date) {
    this.setState({
      mruDetails: {
        ...this.state.mruDetails,
        startDate: date
      }
    });
  }
  
  showGraphHandler(){
      
      this.setState({...this.state,showgraph:"db"})
      
  };
  
  
  render() {
    return (
      <div className="col-md-4 col-sm-12  admin-proilecard">
        <div
          className={`panel panel-default success ${this.state.showsuccess}`}
        >
          <span
            className="pull-right pointer"
            onClick={() => {
              this.closeMruContainer();
            }}
          >
            <b>X</b>
          </span>
          <div className="panel-body">
            {(() => {
              if (this.state.mruDetails.mruRelateTo == "WAS_AT") {
                if (
                  this.state.successdata !== null &&
                  this.state.successdata.mruID != null &&
                  this.state.successdata.zipcode !== null
                ) {
                  return (
                    <div>
                      {" "}
                      Service of{" "}
                      <strong>MruID :{this.state.successdata.mruID}</strong> has
                      been successfully ended for{" "}
                      <strong>
                        {" "}
                        Zipcode: {this.state.successdata.zipcode}
                      </strong>
                      . <br />
                      <br /> Click below button to show recommended zipcodes
                    </div>
                  );
                }
              } else {
                return <div>Data Save Successfully !</div>;
              }
            })()}
          </div>
          <div className="panel-footer">
            &nbsp;
            {(() => {
              if (this.state.mruDetails.mruRelateTo == "WAS_AT") {
                return (
                  <button
                    className="btn btn-primary btn-xs"
                    onClick={() =>
                      this.props.filterRecordRecommended(
                        this.recommendedLocation()
                      )
                    }
                    type="button"
                  >
                    {" "}
                    Show Recommended Location{" "}
                  </button>
                );
              }
            })()}
          </div>
        </div>
        <div
          className={`panel panel-default ${
            this.state.mruDetails.mruContainer
          }`}
        >
          <div className="panel-heading">
            <span>
              <b>
                MRU Place at:{" "}
                {this.state.mruDetails.cityname !== "null"
                  ? this.state.mruDetails.cityname
                  : ""}
                ({this.state.mruDetails.zipcode})
              </b>
            </span>
            <span
              className="pull-right pointer"
              onClick={() => {
                this.closeMruContainer();
              }}
            >
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
              onChange={event => {
                this.setState({
                  mruDetails: {
                    ...this.state.mruDetails,
                    placedat: event.target.value
                  }
                });

                if (event.target.value === "IS_AT") {
                  this.setState({ showdate: "dn" });
                } else {
                  this.setState({ showdate: "db" });
                }
              }}
            >
              <option value="IS_AT">At Location</option>
              <option value="IS_EXPECTED_AT">Expected to Location</option>
            </select>

            <div className={`${this.state.showdate}`}>
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
                  });
                }}
                value={this.state.mruDetails.mruID || ""}
                name="mru-id"
              />
            </div>
          </div>
          <div className="panel-footer">
            {(() => {
              if (this.state.mruDetails.mruRelateTo == "") {
                return (
                  <button
                    className="btn btn-primary btn-xs"
                    ref="placemru"
                    onClick={this.placemruHandler}
                    type="button"
                  >
                    Place Mru
                  </button>
                );
              }
            })()}
            &nbsp;
            {(() => {
              if (this.state.mruDetails.mruRelateTo !== "") {
                return (
                  <button
                    className="btn btn-primary btn-xs"
                    ref="placemru"
                    onClick={this.endMruHandler}
                    type="button"
                  >
                    End Mru
                  </button>
                );
              }
            })()}
            {(() => {
              if (this.state.mruDetails.icontype === "darkcolor") {
                return (
                  <button
                    className="btn btn-primary btn-xs"
                    ref="showgraph"
                    type="button"
                    onClick={this.showGraphHandler}
                  >
                    Registration Growth
                  </button>
                );
              }
            })()}
          </div>
        </div>
             <GraphOverlay showgraph ={this.state.showgraph}/>
      </div>
    );
  }
}

export default MruPlaceConatiner;
