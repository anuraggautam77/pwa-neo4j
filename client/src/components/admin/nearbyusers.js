/* global google, fetch */

import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MarkerClusterer from "../../common/markerclusterer";
const imageUrl = "https://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png";
import moment from "moment";
const defaultradius = 16091;
class NearbyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            primaryCities: [],
            secondaryCities: [],
            nearByLocations: [],
            clusterShow: false,
            primaryCity: false,
            cities: false,
            colval: 12,
            sidepanel: "dn",
            showdate: "dn",
            breadcrum: [
                {val: "primary", label: 'Primary Cities', active: 1},
                {val: "secondary", label: 'Secondary Cities', active: 0},
                {val: "zipcode", label: 'Zipcode ', active: 0}
            ],
            mapCenter: {
                latitude: 37.3788789,
                longitude: -93.9515576,
                radius: 4,
                zoom: 12
            },
            mruDetails: {
                startDate: moment(),
                zipcode: "",
                mruID: "",
                mruContainer: "dn",
                placedat: "IS_AT",
                mruRelateTo: "",
                criteriaContainer: "dn",
                criteriaValue: ""
            }
        };
        this.markers = [];
        this.clusterMarkers = [];
        this.markerClusterer = null;
        this.map = null;
        this.radiusMarker = null;
        this.infoWindow = null;
        this.clearHandler = this.clearHandler.bind(this);
        this.placemruHandler = this.placemruHandler.bind(this);
        this.endMruHandler = this.endMruHandler.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.breadcrumbHandler = this.breadcrumbHandler.bind(this);
    }
    breadcrumbHandler(flag) {
        this.clearHandler();
        this.resetCircle();
        this.radiusMarker = null;
        if (flag === "primary") {
            this.setState({
                ...this.state,
                breadcrum: [{val: "primary", label: 'Primary Cities', active: 1},
                    {val: "secondary", label: 'Secondary Cities', active: 0},
                    {val: "zipcode", label: 'Zipcode ', active: 0}
                ],
                cities: true,
                colval: 12,
                sidepanel: "dn",
                primaryCity: true,
                clusterShow: false,
                mruDetails: {
                    ...this.state.mruDetails,
                    criteriaContainer: "dn",
                    mruContainer: "dn"
                }
            });
            this.map.setZoom(4);
        } else {
            this.setState({
                ...this.state,
                cities: true,
                primaryCity: false,
                clusterShow: false,
                colval: 12,
                sidepanel: "dn",
                breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                    {val: "secondary", label: 'Secondary Cities', active: 1},
                    {val: "zipcode", label: 'Zipcode ', active: 0}
                ],
                mruDetails: {
                    ...this.state.mruDetails,
                    criteriaContainer: "db",
                    mruContainer: "dn"
                }

            });
            this.map.setZoom(6.5);
        }
    }
    endMruHandler() {
        var postData = {
            startDate: moment().format("YYYY-MM-DD"),
            relationTo: "WAS_AT",
            zipcode: this.state.mruDetails.zipcode,
            mruID: this.state.mruDetails.mruID
        };
        this.placeMruApiCall(postData);
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
    onRadioChange(e) {
        this.setState({
            mruDetails: {
                ...this.state.mruDetails,
                criteriaValue: e.target.value
            }
        });
    }
    clearHandler() {
        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }
    }
    componentWillMount() {
        this.getPrimaryCites();
    }
    getPrimaryCites() {

        fetch("api/allcitiesdetails", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        })
                .then(res => res.json())
                .then(json => {

                    console.log("ALLCITES>>")
                    console.log(json.mapdata);
                    console.log("ALLCITES>>")

                    this.setState({
                        primaryCities: json.mapdata,
                        cities: true,
                        primaryCity: true
                    });
                });
    }
    getSecondary(cityID) {
        fetch("api/getsecondlevelcities", {
            method: "post",
            body: JSON.stringify({cityID: cityID}),
            headers: {
                "Content-Type": "application/json"
            }
        })
                .then(res => res.json())
                .then(json => {

                    console.log("secondlevelcities>>");
                    console.log(json.mapdata);
                    console.log("secondlevelcities>>");
                    this.setState({
                        breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                            {val: "secondary", label: 'Secondary Cities', active: 1},
                            {val: "zipcode", label: 'Zipcode ', active: 0}
                        ],
                        secondaryCities: json.mapdata,
                        cities: true,
                        primaryCity: false,
                        mruDetails: {
                            ...this.state.mruDetails,
                            criteriaContainer: "db"
                        }

                    });
                });
    }
    getzipcodes(loc) {
        fetch("api/nearbyloc", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({locid: loc, criteria: this.state.mruDetails.criteriaValue, todaydate: moment().format("YYYY-MM-DD"), })
        })
                .then(res => res.json())
                .then(json => {
                    console.log("nearbyloc>>");
                    console.log(json.mapdata);
                    console.log("nearbyloc>>");
                    this.setState({
                        nearByLocations: json.mapdata,
                        breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                            {val: "secondary", label: 'Secondary Cities', active: 0},
                            {val: "zipcode", label: 'Zipcode ', active: 1}
                        ],
                        clusterShow: true,
                        colval: 9,
                        sidepanel: "db",
                        mruDetails:
                                {
                                    ...this.state.mruDetails,
                                    criteriaContainer: "dn"
                                }});
                });
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
                    this.setState({clusters: json.mapdata, clusterShow: true});
                });
    }
    dateChange(date) {
        this.setState({
            mruDetails: {
                ...this.state.mruDetails,
                startDate: date
            },
            clusterShow: false,
            cities: false
        });
    }
    componentDidMount() {
        this.plotmap();
    }
    componentDidUpdate(props) {


        if (this.state.clusterShow) {
            this.markeCluster();
        } else {
            if (this.state.cities) {
                if (this.state.primaryCity) {
                    this.plotcites("p");
                } else {
                    this.plotcites("s");
                }
            }
        }
    }
    plotmap() {
        var latlng = {
            lat: this.state.mapCenter.latitude,
            lng: this.state.mapCenter.longitude
        };
        this.map = new google.maps.Map(document.getElementById("nearbyuser-map"), {
            zoom: 4,
            center: new google.maps.LatLng(latlng.lat, latlng.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }
    previousmarker(flag) {
        for (var i = 0; i < this.markers.length; i++) {
            if (flag) {
                // if (this.markers[i].getTitle() != this.notToRemove) {
                this.markers[i].setMap(null);
                // }
            } else {
                this.markers[i].setMap(null);
            }
        }
    }
    plotcites(flag) {
        this.previousmarker(true);
        var markerCitiesData = [];
        if (flag === "p") {
            markerCitiesData = this.state.primaryCities;
        } else {
            markerCitiesData = this.state.secondaryCities;
        }

        for (var i = 0; i < markerCitiesData.length; ++i) {
            var latLng = new google.maps.LatLng(
                    markerCitiesData[i].lat,
                    markerCitiesData[i].lng
                    );
            var mapMarker = null;
            if (flag === "p") {
                mapMarker = {
                    //  icon:`img/icon-64.png`,
                    position: latLng, draggable: false, citytype: `${markerCitiesData[i].type}`,
                    label: `${markerCitiesData[i].userCount}`,
                    map: this.map, typeof : "p", title: `${markerCitiesData[i].cityID}`,
                    animation: google.maps.Animation.DROP
                };
            } else {
                var scale = 4;
                var color = "#393";
                if (i <= 10) {
                    scale = 8;
                    color = "#de7123";
                }
                mapMarker = {
                    position: latLng, draggable: false, citytype: `${markerCitiesData[i].type}`,
                    icon: {path: google.maps.SymbolPath.CIRCLE, scale: scale, strokeColor: color},
                    typeof : "s",
                    map: this.map,
                    title: `${markerCitiesData[i].cityID}`
                };
            }

            var marker = new google.maps.Marker(mapMarker);
            this.markers.push(marker);
            var self = this;
            var map = this.map;
            marker.addListener("click", function () {

                if (this.typeof === "p") {
                    self.getSecondary(this.getTitle());
                    var bounds = new google.maps.LatLngBounds();
                    var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
                    bounds.extend(latlng);
                    map.setCenter(bounds.getCenter());
                    map.setZoom(6.5);
                } else {


                    if (self.state.mruDetails.criteriaValue !== '') {
                        self.getzipcodes(this.getTitle());
                        var bounds = new google.maps.LatLngBounds();
                        var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
                        self.createCircle(map, latlng, 160934);
                        bounds.extend(latlng);
                        map.setCenter(bounds.getCenter());
                        map.setZoom(7.3);
                    } else {
                        alert("Please select criteria before clicking Secondary Cities");
                        return false;
                    }
                }




            });
        }
    }
    resetCircle() {
        if (this.radiusMarker !== null) {
            this.radiusMarker.setMap(null);
        }
    }
    createCircle = (map, latlng, radius) => {
        this.resetCircle()
        this.radiusMarker = new google.maps.Circle({
            strokeColor: '#a9d26d',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#a9d26d',
            fillOpacity: 0.35,
            map: map,
            center: latlng,
            radius: radius
        })
    }
    markeCluster() {
        this.previousmarker(false);
        this.clusterMarkers = [];
        for (var i = 0; i < this.state.nearByLocations.length; ++i) {
            var iconMarkerImg = "primarycity.png";
            var zipDetail = this.state.nearByLocations[i];
            if (zipDetail.relation === 'IS_AT') {
                iconMarkerImg = "green.png";
            } else if (zipDetail.relation === 'IS_EXPECTED_AT') {
                iconMarkerImg = "yellow.png";
            } else {
                if (i <= 30) {
                    iconMarkerImg = "darkcolor.png";
                }
            }

            var latLng = new google.maps.LatLng(
                    zipDetail.latitude,
                    zipDetail.longitude
                    );
            var zipmarker = new google.maps.Marker({
                position: latLng,
                draggable: false,
                /* label: {
                 text: `${zipDetail.userCount}`,
                 color: "#000",
                 fontSize: "20",
                 fontWeight: "bold"
                 }, */
                icon: {
                    url: `img/culsterimg/zip/${iconMarkerImg}`,
                    scaledSize: new google.maps.Size(30, 30), // scaled size
                    origin: new google.maps.Point(0, 0)
                },
                value: `${zipDetail.zip}`,
                title: `${zipDetail.cityname}`,
                relation: `${zipDetail.relation}`,
                mruid: `${zipDetail.mruid}`,
                animation: google.maps.Animation.DROP
            })
            /**
             * bind events of handler
             */
            var self = this;
            zipmarker.addListener("click", function (e) {

                var mruRelateTo = this.relation === "null" ? "" : this.relation;
                var mruID = this.mruid === "null" ? "" : this.mruid;
                var alreadyText = "";
                if (mruRelateTo === "IS_AT") {
                    alreadyText = "Mru is already placed at this location. Click End Mru button to End Service!";
                }

                self.setState({
                    mruDetails: {
                        ...self.state.mruDetails,
                        zipcode: this.value,
                        mruContainer: "db",
                        alreadyTextmru: alreadyText,
                        cityname: this.title,
                        mruRelateTo: mruRelateTo,
                        mruID: mruID
                    },
                    clusterShow: false,
                    cities: false
                })
            })
            this.clusterMarkers.push(zipmarker);
        }
        this.markerClusterer = new MarkerClusterer(this.map, this.clusterMarkers, {});
    }
    bredcrumRender(state) {
        var flag = '';
        return(
                state.breadcrum.map((obj, i) => {
                    if (obj.active == 1) {
                        flag = true;
                        return(<li className="breadcrumb-item active" key={i}>{obj.label}</li>)
                    } else {
                        if (flag != true) {
                            return(<li className="breadcrumb-item active" key={i}><a href="javascript:void(0)" 
                                                                          onClick ={() => this.breadcrumbHandler(obj.val)}  >{obj.label}</a></li>)
                        }

                    }
                })
                )
    }
    listClickhandler(index) {
        google.maps.event.trigger(this.clusterMarkers[index], 'click');
    }
    render() {
        return (
                <div className="landing-page">
                
                
                    <div className="col-md-3 col-sm-12  admin-proilecard">
                        <div className={`panel panel-default ${this.state.mruDetails.mruContainer}`} >
                            <div className="panel-heading">
                                <h5><b>  MRU Place at: {this.state.mruDetails.cityname}({this.state.mruDetails.zipcode}) </b>
                                </h5>
                                {(() => {
                                                if (this.state.mruDetails.alreadyTextmru !== "") {
                                                    return <h6>{this.state.mruDetails.alreadyTextmru}</h6>;
                                }
                                })()}
                            </div>
                
                            <div className="panel-body">
                                <select
                                    onChange={
                                    event => {
                                        this.setState({
                                            mruDetails: {
                                                    ...this.state.mruDetails,
                                                    placedat: event.target.value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        }
                                    })
                                    if (event.target.value === "IS_AT") {
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
                                                                                                        onClick={this.endMruHandler}
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
                
                
                
                    <div>
                        <div className="panel panel-default">
                            <ol className="breadcrumb">
                                {
                                                                                    this.bredcrumRender(this.state)}
                            </ol>
                
                
                            <div className= { `panel-heading alignheading ${ this.state.mruDetails.criteriaContainer }`}>
                                <div className="panel-body">
                                    <label className="input-group col-md-3 col-sm-3">
                                        <span className="input-group-addon">
                                            <input
                                                type="radio"
                                                name="location"
                                                value="popularLocation"
                                                onChange={ e => this.onRadioChange(e)}
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
                                                onChange={e => this.onRadioChange(e)}
                                                />
                                        </span>
                                        <div className="form-control form-control-static">
                                            Near by Location
                                        </div>
                                    </label> 
                                </div> 
                            </div>
                
                            <div className="panel-body">
                                <div className={`col-md-${this.state.colval} col-sm-12`}>
                                    <div className="chart-wrapper">
                                        <div id="nearbyuser-maparea" style={{width: "100%", height: "520px"  }} >
                                            <div id="nearbyuser-map" className="nearby-map" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`col-md-3 col-sm-12 pull-right graph-details ${this.state.sidepanel}`}>
                                    <ul className="list-group">
                
                                        {

                                                                                                                this.state.nearByLocations.map((obj, i) => {
                                                                                                                    var listcolor = 'null';
                                                                                                                    if (obj.relation === 'IS_AT') {
                                                                                                        listcolor = "green";
                                        } else if (obj.relation === 'IS_EXPECTED_AT') {
                                                                                                                listcolor = "yellow";
                                        } else {
                                                                                                                                        if (i <= 30) {
                                                                                                            listcolor = "topmost";
                                        }
                                        }
                
                                        return( <li className={
                                                                                                                `list-group-item ${listcolor}`} onClick={() => this.listClickhandler(i)} key={i}> 
                                            {obj.zip}
                                            <span className="badge">{obj.userCount}</span>
                                        </li>
                                        )
                                        })
                                        }                    
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                                                                                                );
                                        }
                                    }
                                    export default NearbyUser;
