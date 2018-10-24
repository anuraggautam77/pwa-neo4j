/* global google, fetch */

import React, { Component } from "react";
import MruPlaceConatiner from "./mruplace";
import NearByLocation from "./nearbyListing";
import Filters from "./filters";
import PrimaryFilters from "./pfilter";
import UserCount from "./usercount";
import Mapview from "./markerview";
import MarkerClusterer from "../../common/markerclusterer";
import ClusterMatrix from "./clustermatrix";
import moment from "moment";
const defaultradius = 16091;

class Adminpanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryCities: [],
      nearByLocations: [],
      level: 0,
      userCount: { 0: null, 1: null,},
      clusterData:[],
      trufCenter:[],
      clusterShow: false,
      primaryCity: false,
      viewtype: "TRUF",
      cities: false,
      clustercount: 3,
      zipcodeDistance:80469,
      breadcrum: [
        { val: "primary", label: "Primary Cities", active: 1 },
        { val: "zipcode", label: "Zipcode ", active: 0 }
      ],
      mapCenter: {
        latitude: 37.3788789,
        longitude: -93.9515576
      },
      mruDetails: {
        mruContainer: "dn",
        criteriaValue: "popularLocation"
      }
    };
    this.directionsDisplay = null;
    this.newClusterMarkers = [];
    this.markers=[];
    this.clusterMarkers = [];
    this.markerClusterer = null;
    this.locid=null;
    this.trufMarkers=[];
    
     this.mruPlaceMarker=[];
    this.map = null;
    this.platlng=null;
    this.radiusMarker = null;
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
        breadcrum: [
          { val: "primary", label: "Primary Cities", active: 1 },
          { val: "zipcode", label: "Zipcode ", active: 0 }
        ],
        cities: true,
        nearByLocations: [],
        primaryCity: true,
        clusterShow: false,
        mruDetails: {
          criteriaContainer: "dn",
          mruContainer: "dn"
        }
      });
      this.map.setZoom(4);
    }  
  }
  componentWillMount() {
    this.getPrimaryCites();
  }
  getPrimaryCites() {
    fetch("api/allprimarycities", {
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
  
  
  getClusterdata(loc,count,distance){
       console.log(this.map);
       console.log(count);
       console.log(distance);
      this.createCircle(this.map,this.platlng,distance);
      this.locid=loc;
      fetch(`https://django-pwa.herokuapp.com//pwa/api/clustering/kmeans/getKMeansRandomCentroidClusters/?cityid=${loc}&locfilter=popularLocation&distance=${distance}&nclust=${count}`, {
      method: "get",
      headers: {
        "Access-Control-Allow-Credentials" : "true",
            "Access-Control-Allow-Origin" : "https://graph-pwa.herokuapp.com/",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
       
         this.setState({
          ...this.state,
          clusterData: json.data,
          trufCenter:json.centriods,
          primaryCity: false,
          breadcrum: [
            { val: "primary", label: "Primary Cities", active: 0 },
            { val: "zipcode", label: "Zipcode ", active: 1 }
          ],
          level: 1,
          userCount: {
            ...this.state.userCount,
            1: json.usercount
          },
          clusterShow: true,
          mruDetails: {
            ...this.state.mruDetails
          }
        });  
      });
      
      
      
      
  }
  getzipcodes(loc) {
    fetch("api/allzipcodes", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        locid: loc,
        criteria: this.state.mruDetails.criteriaValue,
        todaydate: moment().format("YYYY-MM-DD")
      })
    })
      .then(res => res.json())
      .then(json => {
      
        this.setState({
          nearByLocations: json.mapdata,
          primaryCity: false,
          breadcrum: [
            { val: "primary", label: "Primary Cities", active: 0 },
            { val: "zipcode", label: "Zipcode ", active: 1 }
          ],
          level: 1,
          userCount: {
            ...this.state.userCount,
            1: json.usercount
          },
          clusterShow: true,
          mruDetails: {
            ...this.state.mruDetails,
          }
        });
      });
  }
  componentDidMount() {
    this.plotmap();
  }
  componentDidUpdate(props) {
    if (this.state.clusterShow) {
      if (this.state.viewtype === "DEFAULT") {
        this.defaultMapView();
      } else if (this.state.viewtype === "TRUF") {
        this.displaytrufCluster();
      }  
    } else {
      if (this.state.cities) {
          this.plotcites();
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
  plotcites() {
    this.previousmarker();
    var markerCitiesData = [];
    markerCitiesData = this.state.primaryCities;

    for (var i = 0; i < markerCitiesData.length; ++i) {
      if (markerCitiesData[i].show) {
        var latLng = new google.maps.LatLng(
          markerCitiesData[i].lat,
          markerCitiesData[i].lng
        );
        var mapMarker = null;
          if (markerCitiesData[i].userCount > 0) {
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
              position: latLng,
              draggable: false,
              citytype: `${markerCitiesData[i].type}`,
              label: {
                text: `${markerCitiesData[i].userCount}`,
                color: "#000"
              },
              map: this.map,
              title: `${markerCitiesData[i].cityname}`,
              titlename: `${markerCitiesData[i].cityID}`
            };
          }
     
        var marker = new google.maps.Marker(mapMarker);
        this.markers.push(marker);
        var self = this;
        var map = this.map;
        marker.addListener("click", function() {
              self.getClusterdata(this.titlename,self.state.clustercount,self.state.zipcodeDistance);
              var bounds = new google.maps.LatLngBounds();
              self.platlng = new google.maps.LatLng(
                this.getPosition().lat(),
                this.getPosition().lng()
              );
               self.createCircle(map,self.platlng,self.state.zipcodeDistance);
              bounds.extend(self.platlng);
              map.setCenter(bounds.getCenter());
              map.setZoom(7.3);
        });
      }
    }
  }
  createCircle = (map, latlng, radius) => {
    this.resetCircle();
    this.radiusMarker = new google.maps.Circle({
      strokeColor: "#a9d26d",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#fff",
      fillOpacity: 0.5,
      map: map,
      center: latlng,
      radius: Number(radius)
    });
  };
  viewchange(flag, count,distance) {
    this.previousmarker();
    this.clusterMarkers = [];
    this.newClusterMarkers = [];
    if(flag==='TRUF'){
        this.getClusterdata(this.locid,count,distance);
    }
    /*
      this.setState({
        ...this.state,
        viewtype: flag,
        clusterShow: true,
        mruDetails: {
          ...this.state.mruDetails,
          mruContainer: "dn",
          criteriaContainer: "dn"
        }
      });*/
    
  }
  filteredRecord(obj) {
    this.previousmarker();
    this.clusterMarkers = [];
    this.setState({
      nearByLocations: obj,
      breadcrum: [
        { val: "primary", label: "Primary Cities", active: 0 },
        { val: "zipcode", label: "Zipcode ", active: 1 }
      ],
      clusterShow: true,
      mruDetails: {
        ...this.state.mruDetails,
        mruContainer: "dn",
        criteriaContainer: "dn"
      }
    });
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
        if (zipDetail.relation === "IS_AT") {
          iconMarkerImg = "green";
        } else if (zipDetail.relation === "IS_EXPECTED_AT") {
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
          title: `${(zipDetail.locName===null)?'':zipDetail.locName}`,
          relation: `${zipDetail.relation}`,
          mruid: `${zipDetail.mruid}`,
          prevdate: `${zipDetail.mrudate}`,
          icontype: iconMarkerImg
        });
        /**
         * bind events of handler
         */
        var self = this;
        zipmarker.addListener("click", function(e) {
          var mruRelateTo = this.relation === "null" ? "" : this.relation;
          var mruID = this.mruid === "null" ? "" : this.mruid;
          var alreadyText = "";
          if (mruRelateTo === "IS_AT") {
            alreadyText =
              "Mru is already placed at this location. Click End Mru button to End Service!";
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
    this.markerClusterer = new MarkerClusterer(this.map, this.clusterMarkers, {
      minimumClusterSize: 10000000
    });
  }
  displaytrufCluster() {
      
     
    this.previousmarker();
    this.clearHandler();
    var colorobj = {
      color0: "#800080",
      color1: "#C71585",
      color2: "#FFA500",
      color3: "#32CD32",
      color4: "#A0522D"
    };
    
     var clusterData = this.state.clusterData;
     for (var i = 0; i < this.state.trufCenter.length; ++i) {
            var center = this.state.trufCenter[i];
            var latLng = new google.maps.LatLng( Number(center[0]),  Number(center[1]) );
            var  mapMarker = {
                        icon: {
                             scaledSize: new google.maps.Size(30, 30), // scaled size
                             origin: new google.maps.Point(0, 0),
                            url: `img/cluster.png`
                        },
                        position: latLng,
                        draggable: false,
                        map: this.map,
                        title: `Cluster ${i+1} ,Count :`
            };
        var centriodPlace=new google.maps.Marker(mapMarker);
        this.trufMarkers.push(centriodPlace);
    }
     for (var i = 0; i < clusterData.length; ++i) {
       var position = clusterData[i];
      var latLng = new google.maps.LatLng(
     
        position.latitude,   position.longitude
      );
      var zips = {
        position: latLng,
        draggable: false,
         value: `${position.zip}`,
          title: `${position.locName}`,
          relation: `${position.relation}`,
          mruid: `${position.mruid}`,
          prevdate: `${position.mrudate}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          strokeColor: colorobj[`color${position.cluster}`]
        },
        map: this.map
      };
      var zipmarker = new google.maps.Marker(zips);
       var self = this;
       zipmarker.addListener("click", function(e) {
          var mruRelateTo = this.relation === "null" ? "" : this.relation;
          var mruID = this.mruid === "null" ? "" : this.mruid;
          var alreadyText = "";
          if (mruRelateTo === "IS_AT") {
            alreadyText =
              "Mru is already placed at this location. Click End Mru button to End Service!";
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
       this.trufMarkers.push(zipmarker);
    }
    
    
  }
  bredcrumRender(state) {
    var flag = "";
    return state.breadcrum.map((obj, i) => {
      if (obj.active === 1) {
        flag = true;
        return (
          <li className="breadcrumb-item active" key={i}>
            {obj.label}
          </li>
        );
      } else {
        if (flag !== true) {
          return (
            <li className="breadcrumb-item active" key={i}>
              <a
                href="javascript:void(0)"
                onClick={() => this.breadcrumbHandler(obj.val)}
              >
                {obj.label}
              </a>
            </li>
          );
        }
      }
    });
  }
  listClickhandler(index) {
    google.maps.event.trigger(this.clusterMarkers[index], "click");
  }
  previousmarker() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    
     for (var i = 0; i < this.trufMarkers.length; i++) {
      this.trufMarkers[i].setMap(null);
    }
   
  }
  clearHandler() {
    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
    }
  }
  resetCircle() {
    if (this.radiusMarker !== null) {
      this.radiusMarker.setMap(null);
    }
  }
  placeMru(){
     for (var i = 0; i < this.mruPlaceMarker.length; i++) {
          this.mruPlaceMarker[i].setMap(null);
            }

            var latLng = new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng() );
            var  mruplace = {
                        icon: {
                            url: `img/culsterimg/pin.png`
                        },
                        position: latLng,
                        draggable: true,
                        map: this.map,
                        title: `Mru-Placement`
            };
      var mrumarker= new google.maps.Marker(mruplace);
      this.mruPlaceMarker.push(mrumarker);
       var self = this;
       mrumarker.addListener("click", function(e) {
          self.setState({
            mruDetails: {
              ...self.state.mruDetails,
              zipcode:"",
              mruContainer: "db",
              alreadyTextmru: "",
              cityname: "",
              mruRelateTo: "",
              mruID:"",
              mruprevRelation:"",
              preDate: "",
              currentloc: this.getPosition(),
              icontype: ""
            },
            clusterShow: false,
            cities: false
          });
        });
        
        
        
  }
  render() {
        return (
      <div id="main">
        <div id="header">
          <h4>
            <span
              className="glyphicon glyphicon-globe"
              aria-hidden="true"
            /> 
            MRU APP
          </h4>
        </div>
        <div className="row text-right">
          {(() => {
            return (
              <ol className="breadcrumb">{this.bredcrumRender(this.state)}</ol>
            );
          })()}
        </div>

        <div id="content">
          <div className="row">
         
     <div className="col-md-2 col-sm-12">
        <UserCount usercount={this.state} />
            <input type="button" onClick={()=>{this.placeMru()}} value="PlaceMRU" />
          
              {(() => {
                  if(this.state.clusterShow){
                      
                 
                if (this.state.nearByLocations.length >= 1 || this.state.clusterData.length>=1 ) {
                  if (this.state.viewtype === "DEFAULT") {
                    return (
                      <div>
                        <Mapview    selectedmap={this.state.viewtype}  
                                    viewtype={(flag,count,distance) => this.viewchange(flag,count,distance)
                          } />
                         
                        <NearByLocation
                          nearbystate={this.state.nearByLocations}
                          onclickHandler={e => this.listClickhandler(e)}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <Mapview
                          selectedmap={this.state.viewtype} 
                          viewtype={(flag, count, distance) => this.viewchange(flag, count,distance) }
                        />
                      
                      </div>
                    );
                  }
                }
                }
              })()}
            </div>
           
            <div className="col-md-8 col-sm-12 ">
              <MruPlaceConatiner
                allRecord={this.state.nearByLocations}
                filteredRecord={ob => this.filteredRecord(ob)}
                mruDetails={this.state.mruDetails}
              />
              <div className="chart-wrapper">
                <div
                  id="nearbyuser-maparea"
                  style={{ width: "100%", height: "750px" }}
                >
                  <div id="nearbyuser-map" className="nearby-map" />
                </div>
              </div>
            </div>
            
              <div className="col-md-2 col-sm-12">
                        {(() => {
                if (this.state.primaryCity) {
                  return (
                    <PrimaryFilters
                      allRecord={this.state.primaryCities}
                      primaryfilterRecord={ob => this.primaryfilterRecord(ob)}
                    />
                  );
                }
              })()}
                   {(() => {
                       
                   if(this.state.clusterShow){
                       
                   
                if (this.state.nearByLocations.length >= 1 || this.state.clusterData.length>=1) {
                  if (this.state.viewtype === "DEFAULT") {
                    return (
                      <div>
                        <Filters
                          allRecord={this.state.nearByLocations}
                          filterRecord={ob => this.filteredRecord(ob)}
                        />
                      </div>
                    );
                  }else{
                  
                     return (  <ClusterMatrix matrix={[]} centriod={[]}/>)                      
                                           
                 }  
                }
                }
              })()}
                  
                  
              </div>
            
          </div>
        </div>
      </div>
    );
  }
}
export default Adminpanel;
