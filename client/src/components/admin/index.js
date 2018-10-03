/* global google, fetch */

import React, { Component }
from "react";
import MruPlaceConatiner from "./mruplace";
import NearByLocation from "./nearbyListing";
import Criteria from "./criteria";
import Filters from "./filters";
import PrimaryFilters from "./pfilter";
import SecondaryFilters from "./sfilter";

import UserCount from "./usercount";
import Mapview from "./markerview";
import MarkerClusterer from "../../common/markerclusterer";
import moment from "moment";
const defaultradius = 16091;
class Adminpanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            primaryCities: [],
            secondaryCities: [],
            nearByLocations: [],
            level: 0,
            userCount: {0: null, 1: null, 2: null},
            clusterShow: false,
            primaryCity: false,
            viewtype: "DEFAULT",
            cities: false,
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
                mruContainer: "dn",
                criteriaContainer: "dn",
                criteriaValue: "popularLocation"
            }
        };

        this.directionsDisplay = null;
        this.directionsService = new google.maps.DirectionsService();
        this.newClusterMarkers = [];
        this.markers = [];
        this.clusterMarkers = [];
        this.markerClusterer = null;
        this.map = null;
        this.radiusMarker = null;
        this.infoWindow = null;
        this.clearHandler = this.clearHandler.bind(this);
        this.breadcrumbHandler = this.breadcrumbHandler.bind(this);
    }
    breadcrumbHandler(flag) {
        this.clearHandler();
        this.resetCircle();
        this.radiusMarker = null;
        if (flag === "primary") {
            this.setState({
                ...this.state,
                level: 0,
                breadcrum: [{val: "primary", label: 'Primary Cities', active: 1},
                    {val: "secondary", label: 'Secondary Cities', active: 0},
                    {val: "zipcode", label: 'Zipcode ', active: 0}
                ],
                cities: true,
                secondaryCities: [],
                nearByLocations: [],
                primaryCity: true,
                clusterShow: false,
                mruDetails: {
                    criteriaContainer: "dn",
                    mruContainer: "dn"
                }
            });
            this.map.setZoom(4);
        } else {
            this.setState({
                ...this.state,
                cities: true,
                 level: 1,
                nearByLocations: [],
                primaryCity: false,
                clusterShow: false,
                breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                    {val: "secondary", label: 'Secondary Cities', active: 1},
                    {val: "zipcode", label: 'Zipcode ', active: 0}
                ],
                mruDetails: {
                    criteriaContainer: "db",
                    mruContainer: "dn"
                }

            });
            this.map.setZoom(6.5);
        }
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

                    console.log("ALLCITES>>");
                    console.log(json.mapdata);
                    console.log("ALLCITES>>");
                    this.setState({
                        primaryCities: json.mapdata,
                        cities: true,
                        primaryCity: true,
                        userCount: {
                            0: json.usercount
                        }


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
                        level: 1,
                        userCount: {
                            ...this.state.userCount,
                            1: json.usercount
                        },
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
                    console.log(json.mapdata);
                    console.log("nearbyloc>>");
                    this.setState({
                        nearByLocations: json.mapdata,
                        breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                            {val: "secondary", label: 'Secondary Cities', active: 0},
                            {val: "zipcode", label: 'Zipcode ', active: 1}
                        ],
                        level: 2,
                        userCount: {
                            ...this.state.userCount,
                            2: json.usercount
                        },
                        clusterShow: true,
                        mruDetails:
                                {
                                    ...this.state.mruDetails,
                                    criteriaContainer: "dn"
                                }});
                });
    }
    componentDidMount() {
        this.plotmap();
    }
    componentDidUpdate(props) {


        if (this.state.clusterShow) {
            if (this.state.viewtype === "DEFAULT") {
                //  this.markCluster();
                this.defaultMapView();
            } else {
                this.displayCluster();
            }

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
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        var latlng = {
            lat: this.state.mapCenter.latitude,
            lng: this.state.mapCenter.longitude
        };
        this.map = new google.maps.Map(document.getElementById("nearbyuser-map"), {
            zoom: 4,
            center: new google.maps.LatLng(latlng.lat, latlng.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        });
        this.directionsDisplay.setMap(this.map);

    }
    previousmarker() {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    }
    plotcites(flag) {
        this.previousmarker();
        var markerCitiesData = [];
        if (flag === "p") {
            markerCitiesData = this.state.primaryCities;
        } else {
            markerCitiesData = this.state.secondaryCities;
        }

        for (var i = 0; i < markerCitiesData.length; ++i) {

            if (markerCitiesData[i].show) {
                var latLng = new google.maps.LatLng(
                        markerCitiesData[i].lat,
                        markerCitiesData[i].lng
                        );
                var mapMarker = null;
                if (flag === "p") {
                    
                    
                if(markerCitiesData[i].userCount>0){
                     var primaryMarker = "blue.png";
                    if (i <= 5) {
                        primaryMarker = "green.png";
                    }


                    mapMarker = {
                        icon: {
                            url: `img/primary/${primaryMarker}`,
                            scaledSize: new google.maps.Size(60, 60), // scaled size
                            origin: new google.maps.Point(0, 0)
                        },
                        position: latLng, draggable: false, citytype: `${markerCitiesData[i].type}`,
                        label:{text: `${markerCitiesData[i].userCount}`,color:"#000"},
                        map: this.map, typeof : "p", title: `${markerCitiesData[i].cityname}`,
                                //animation: google.maps.Animation.DROP
                         titlename: `${markerCitiesData[i].cityID}`
                    };
                }    
                
                   
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
                        title: `${markerCitiesData[i].cityname}`,
                        titlename: `${markerCitiesData[i].cityID}`
                    };
                }

                var marker = new google.maps.Marker(mapMarker);
                this.markers.push(marker);
                var self = this;
                var map = this.map;
                marker.addListener("click", function () {
                    console.log(this.titlename)
                    if (this.typeof === "p") {
                         self.getSecondary(this.titlename);
                        var bounds = new google.maps.LatLngBounds();
                        var latlng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
                        bounds.extend(latlng);
                        map.setCenter(bounds.getCenter());
                        map.setZoom(6.5);
                    } else {


                        if (self.state.mruDetails.criteriaValue !== '') {
                            self.getzipcodes(this.titlename);
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
    }
    resetCircle() {
        if (this.radiusMarker !== null) {
            this.radiusMarker.setMap(null);
        }
    }
    createCircle = (map, latlng, radius) => {
        this.resetCircle();
        this.radiusMarker = new google.maps.Circle({
            strokeColor: '#a9d26d',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#fff',
            fillOpacity: 0.5,
            map: map,
            center: latlng,
            radius: radius
        })
    }
    viewchange(flag) {
        this.previousmarker();
        this.clusterMarkers = [];
        this.newClusterMarkers = [];
        this.setState({
            ...this.state,
            viewtype: flag,
            clusterShow: true,
            mruDetails:
                    {
                        ...this.state.mruDetails,
                        mruContainer: "dn",
                        criteriaContainer: "dn"
                    }});

    }
    filteredRecord(obj) {
        this.previousmarker();
        this.clusterMarkers = [];
        this.setState({
            nearByLocations: obj,
            breadcrum: [{val: "primary", label: 'Primary Cities', active: 0},
                {val: "secondary", label: 'Secondary Cities', active: 0},
                {val: "zipcode", label: 'Zipcode ', active: 1}
            ],
            clusterShow: true,
            mruDetails:
                    {
                        ...this.state.mruDetails,
                        mruContainer: "dn",
                        criteriaContainer: "dn"
                    }});
    }
    primaryfilterRecord(obj) {
        this.clearHandler();
        this.resetCircle();
        this.setState({
            primaryCities: obj,
            cities: true,
            primaryCity: true
        });
    }
    secondaryfilterRecord(obj) {
        this.clearHandler();
        this.resetCircle();
        this.setState({
            ...this.state,
            secondaryCities: obj,
            cities: true,
            primaryCity: false,
            mruDetails: {
                ...this.state.mruDetails
            }

        });
    }
    displayCluster() {

        this.previousmarker();
        this.clearHandler();
        this.clusterMarkers = [];
        this.newClusterMarkers = [];
        for (var i = 0; i < this.state.nearByLocations.length; i++) {


            var iconMarkerImg = "primarycity";
            var zipDetail = this.state.nearByLocations[i];
            if (zipDetail.show) {
                if (zipDetail.relation === 'IS_AT') {
                    iconMarkerImg = "green";
                } else if (zipDetail.relation === 'IS_EXPECTED_AT') {
                    iconMarkerImg = "ember";
                } else {
                    if (i <= 30) {
                        iconMarkerImg = "darkcolor";
                    }
                }

                var latLng = new google.maps.LatLng(zipDetail.latitude,
                        zipDetail.longitude);
                // var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco='FFFFFF,008CFF,000000&ext=.png';
                //var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));
                var zipmarker = new google.maps.Marker({
                    'position': latLng,
                    icon: {
                        url: `img/culsterimg/zip/${iconMarkerImg}.png`,
                        scaledSize: new google.maps.Size(30, 30), // scaled size
                        origin: new google.maps.Point(0, 0)
                    },
                    usercount: `${zipDetail.userCount}`,
                    value: `${zipDetail.zip}`,
                    title: `${zipDetail.locName}`,
                    relation: `${zipDetail.relation}`,
                    mruid: `${zipDetail.mruid}`,
                    prevdate: `${zipDetail.mrudate}`,
                    icontype: iconMarkerImg
                });
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
                            mruID: mruID,
                            mruprevRelation: mruRelateTo,
                            preDate: this.prevdate,
                            currentloc: this.getPosition(),
                            icontype: this.icontype
                        },
                        clusterShow: false,
                        cities: false
                    });
                });
                this.newClusterMarkers.push(zipmarker);
            }
        }
        this.markerClusterer = new MarkerClusterer(this.map, this.newClusterMarkers, {minimumClusterSize: 10, imagePath: '../img/culsterimg/m'});
    }
    defaultMapView() {
        this.previousmarker();
        this.clearHandler();
        this.clusterMarkers = [];
        this.newClusterMarkers = [];
        var locations = this.state.nearByLocations;

        for (var i = 0; i < locations.length; ++i) {

            var iconMarkerImg = "primarycity";
            var zipDetail = locations[i];
            if (zipDetail.show) {
                if (zipDetail.relation === 'IS_AT') {
                    iconMarkerImg = "green";
                } else if (zipDetail.relation === 'IS_EXPECTED_AT') {
                    iconMarkerImg = "ember";
                } else {
                    if (i <= 30) {
                        iconMarkerImg = "darkcolor";
                    }
                }

                var latLng = new google.maps.LatLng(
                        zipDetail.latitude,
                        zipDetail.longitude
                        );
                var zipmarker = new google.maps.Marker({
                    position: latLng,
                    draggable: false,
                    icon: {
                        url: `img/culsterimg/zip/${iconMarkerImg}.png`,
                        scaledSize: new google.maps.Size(30, 30), // scaled size
                        origin: new google.maps.Point(0, 0)
                    },
                    value: `${zipDetail.zip}`,
                    title: `${zipDetail.locName}`,
                    relation: `${zipDetail.relation}`,
                    mruid: `${zipDetail.mruid}`,
                    prevdate: `${zipDetail.mrudate}`,
                    icontype: iconMarkerImg
                });
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
                            mruID: mruID,
                            mruprevRelation: mruRelateTo,
                            preDate: this.prevdate,
                            currentloc: this.getPosition(),
                            icontype: this.icontype
                        },
                        clusterShow: false,
                        cities: false
                    });
                });
                this.clusterMarkers.push(zipmarker);
            }
        }
        this.markerClusterer = new MarkerClusterer(this.map, this.clusterMarkers, {minimumClusterSize: 10000000});
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
    primaryClickhandler(index) {
        google.maps.event.trigger(this.markers[index], 'click');
    }
    mouseOverhandler(index, flag) {
        if (flag) {
            this.markers[index].setAnimation(google.maps.Animation.BOUNCE);
        } else {
            this.markers[index].setAnimation(null);
        }

    }
    render() {


        return (
                <div id="main">
                    <div id="header">
                        <h4> <span className="glyphicon glyphicon-globe" aria-hidden="true"></span> MRU APP</h4>
                    </div>
                    <div className="row text-right">
                        {(() => {
                                        return (
                                                <ol className="breadcrumb">
                                                    {
                                                                this.bredcrumRender(this.state)}
                                                </ol>
                                                )

                        })()} 
                    </div>
                
                    <div id="content">
                        <div className="row">
                
                            <div className="col-md-3 col-sm-12">
                                <UserCount usercount={this.state}></UserCount>
                                { (() => {
                                                    if (this.state.primaryCity) {
                                                        return (<PrimaryFilters allRecord={this.state.primaryCities} primaryfilterRecord={(ob) => this.primaryfilterRecord(ob)}/>)
                                }
                                })() 
                
                                }
                
                                <Criteria criteriaContainer={
                                        this.state.mruDetails.criteriaContainer} onRadioChange={e => this.onRadioChange(e)}  />
                                <SecondaryFilters criteriaContainer={this.state.mruDetails.criteriaContainer}  allRecord={this.state.secondaryCities} secondaryfilterRecord={(ob) => this.secondaryfilterRecord(ob)}/>
                
                                { (() => {
                                                            if (this.state.nearByLocations.length >= 1) {
                                                                return(
                                                                <div>
                                                                    <Mapview viewtype={(flag) => this.viewchange(flag)}/>
                                                                    <Filters allRecord={this.state.nearByLocations} filterRecord={(ob) => this.filteredRecord(ob)} />
                                                                </div>
                                                                        )
                                }
                                })() 
                                } 
                
                                {
                                                                (() => {
                                                                    if (this.state.nearByLocations.length >= 1) {
                                                                        return(<NearByLocation nearbystate={this.state.nearByLocations} onclickHandler={(e) => this.listClickhandler(e)}
                                                                                        />
                                                                                                )
                                }
                                })() 
                                }
                            </div>
                            <div className="col-md-9 col-sm-12">
                                <MruPlaceConatiner 
                                    allRecord={
                                                        this.state.nearByLocations}  filteredRecord={(ob) => this.filteredRecord(ob)}   mruDetails={ this.state.mruDetails}
                
                                    /> 
                                <div className="chart-wrapper">
                                    <div id="nearbyuser-maparea" style={ {  width: "100%", height: "750px"  }} >
                                        <div id="nearbyuser-map" className="nearby-map" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
               
                    
                    
                    </div>
                                                        );
                }
            }
            export default Adminpanel;
