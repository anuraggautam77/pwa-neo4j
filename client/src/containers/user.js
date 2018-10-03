/* global google, fetch */

import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import Registration from "../components/user/registration";
import Mrufilter from "../components/user/mrufilter"
        import '../style/css/user.scss';
const hashKey = "sim8o7ysxvoun2uSKktR1afoSCd1";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mapCenter: {
                latitude: 37.4419,
                longitude: -122.1419,
                radius: 4,
                zoom: 13
            },
            regtype: '',
            deviceid: null,
            lng: '',
            lat: '',
            mruid: '',
            regmruid: '',
            mrushow: "dn",
            regmrushow: "dn",
            showflagmrus: false,
            mrudetails: []
        };
        this.infoWindow = null;
        this.map = null;
        this.markers = [];
        this.handleCurrentLocation = this.handleCurrentLocation.bind(this);
    }
    componentWillMount() {
        fetch("api/getallmrus", {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(json => {
            json.mapdata.map((obj, i) => {
                obj.show = true;
            });
            console.log(json.mapdata)

            this.setState({mrudetails: json.mapdata, showflagmrus: true});
        });
    }
    componentDidUpdate(props) {
        if (this.state.showflagmrus) {
            console.log(">>>>>>")
            this.plotmrus();
        }
    }
    removePreviousmarker() {

        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    }
    plotmrus() {
        this.removePreviousmarker();
        console.log(this.state.mrudetails.length)

        for (var i = 0; i < this.state.mrudetails.length; ++i) {
            var mrudetail = this.state.mrudetails[i];
            if (mrudetail.show) {

                if (mrudetail.relation !== "WAS_AT") {
                    var latLng = new google.maps.LatLng(
                            mrudetail.latitude,
                            mrudetail.longitude
                            );

                    var mapMarker = {
                        position: latLng,
                        draggable: false,
                        icon: {
                            url: `img/mru/${mrudetail.relation}/mru.png`,
                            scaledSize: new google.maps.Size(70, 70), // scaled size
                            origin: new google.maps.Point(0, 0)
                        },
                        map: this.map,
                        title: mrudetail.mruid + " at " + mrudetail.zipcode,
                        text: mrudetail.atdate,
                        text2: mrudetail.relation
                                // animation: google.maps.Animation.DROP
                    };

                    var marker = new google.maps.Marker(mapMarker);
                    var self = this;
                    marker.addListener("click", function () {

                        var infotext = ``;
                        if (this.text2 === "IS_EXPECTED_AT") {
                            infotext = `is expected to placed at same Location on <b>(${this.text})`;
                        } else if (this.text2 === "WAS_AT") {
                            infotext = `was at same Location <b>(${this.text}) </b>`;
                        } else {
                            infotext = `is currently at same Location <b>(${this.text}) </b>`;
                        }

                        var infoHtml = `<div class="info">  MRU number :${ this.title} <br> ${infotext}</div>`;
                        var latLng = new google.maps.LatLng(this.getPosition().lat(), this.getPosition().lng());
                        self.infoWindow.setContent(infoHtml);
                        self.infoWindow.setPosition(latLng);
                        self.infoWindow.open(self.map);

                    });

                    this.markers.push(marker);
                    this.map.setCenter(marker.getPosition());
                }
            }

        }
    }
    componentDidMount() {
        this.initialize();
        this.setAutoComplete();
    }
    initialize() {

        var latlng = {
            lat: this.state.mapCenter.latitude,
            lng: this.state.mapCenter.longitude
        };
        this.map = new google.maps.Map(document.getElementById("googleMap"), {
            zoom: 4,
            center: new google.maps.LatLng(latlng.lat, latlng.lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
        });
        this.infoWindow = new google.maps.InfoWindow();

    }
    setAutoComplete() {
        var input = document.getElementById('id_address');
        var options = {
            types: ['address'],
            componentRestrictions: {country: "us"}
        };

        var autocomplete = new google.maps.places.Autocomplete(input, options);
        google.maps.event.addListener(autocomplete, 'place_changed', (i, k) => {
            var place = autocomplete.getPlace();
            var gcoder = new google.maps.Geocoder();
            gcoder.geocode(
                    {'location': {lat: parseFloat(place.geometry.location.lat()), lng: parseFloat(place.geometry.location.lng())}},
                    (results, status) => {

                console.log(results)
                if (status == "OK") {
                    var zipcode = this.getZipcode(results);
                    gcoder.geocode({'address': zipcode}, (results, status) => {

                        this.setState({
                            deviceid: window.localStorage.getItem('deviceToken'),
                            "cur_lng": place.geometry.location.lng(),
                            "postal": zipcode,
                            "cur_lat": place.geometry.location.lat(),
                            "zip_lng": results[0].geometry.location.lng(),
                            "zip_lat": results[0].geometry.location.lat()

                        })
                    })
                } else {
                    this.setState({
                        "deviceid": window.localStorage.getItem('deviceToken'),
                        "cur_lng": place.geometry.location.lng(),
                        "cur_lat": place.geometry.location.lat()

                    })
                }
            })
            this.drawMap(place.geometry.location.lat(), place.geometry.location.lng());
        });
    }
    getZipcode(place) {
        var zipcodes = [];
        if (Array.isArray(place)) {
            for (var k = 0; k < place.length; k++) {
                for (var i = 0; i < place[k].address_components.length; i++) {
                    for (var j = 0; j < place[k].address_components[i].types.length; j++) {
                        if (place[k].address_components[i].types[j] == "postal_code") {
                            zipcodes.push(place[k].address_components[i].long_name)
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "postal_code") {
                        zipcodes.push(place.address_components[i].long_name);
                    }
                }
            }

        }
        if (zipcodes.length > 0) {
            return zipcodes[0];
        } else {
            return '';
        }
    }
    drawMap(lt, lg) {

        var lat, lng = '';
        if (lt !== undefined && lt !== undefined) {
            lat = lt;
            lng = lg;
        } else {
            lat = this.state.lat;
            lng = this.state.lng;
        }

        var map = new google.maps.Map(document.getElementById("googleMap"), {
            center: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
            zoom: 13
        });
    }
    handleCurrentLocation() {

  
  
  
  if(this.state.cur_lng!==undefined){
      
       var dataobject = {};
        dataobject.cur_lng = this.state.cur_lng;
        dataobject.cur_lat = this.state.cur_lat;
        dataobject.deviceid = this.state.deviceid;
        //dataobject.geohash = response.result.geohash;

        if (this.state.hasOwnProperty('postal')) {
            dataobject.type = 'withZip';
            dataobject.zip = this.state.postal;
            dataobject.zip_lng = this.state.zip_lng;
            dataobject.zip_lat = this.state.zip_lat;

        } else {
            dataobject.type = 'withoutZip';
        }

    

        fetch("api/registeruser", {
            method: "post",
            body: JSON.stringify({data: dataobject}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(json => {
            alert("Registration successfully for this Location!!");
        });
      
  }else{
      alert("Please enter Location first!!");
  }
       
       

    }
    filterRecord(sortdata) {
        console.log(">>>>>>>>>>>", sortdata)
        this.setState({mrudetails: sortdata, showflagmrus: true});
    }
    render() {
        return (
                <div className="userpanel main-landing row content">
                    <div id="header">
                        <h4> <span class="glyphicon glyphicon-globe" aria-hidden="true"></span>  MRU APP</h4>
                    </div>
                    <div className="landing-page">
                        
                       
              <div className="col-md-12 col-sm-12">
                       <div className="panel panel-default">
                             <div className="panel-body">
                              <div className="col-md-6 col-sm-12">
                                <Registration handleCurrentLocation={this.handleCurrentLocation} ondropdownchange={ (value) => { this.setState({"regtype": value});} }/>
                              </div>     
                            
                                   
                <div className="col-md-1 col-sm-12"></div>
                        <div className="col-md-5 col-sm-12">
                             <Mrufilter filterRecord={ (sortdata) => this.filterRecord(sortdata)} allmru ={  this.state.mrudetails} />
                        </div> 
                       </div>
                   </div>
             </div>   
                        
                
                        <div className="col-md-12 col-sm-12">
                            <div className="panel panel-default">
                                <div className="">  </div>
                                <div className="panel-body">
                                    <div id="googleMap" className="mapsize"></div>     
                                </div>
                            </div>
                
                        </div>
                    </div>
                </div>
                        );
        }
    }

    export default MainPage;
