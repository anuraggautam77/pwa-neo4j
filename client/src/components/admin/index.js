/* global google, fetch */

import React, { Component } from "react";
import MruPlaceConatiner from "./mruplace";
import NearByLocation from "./nearbyListing";
import Criteria from "./criteria";
import Filters from "./filters";
import PrimaryFilters from "./pfilter";
import SecondaryFilters from "./sfilter";
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
      secondaryCities: [],
      nearByLocations: [],
      cluserData: [],
      turf: [],
      cluster: [],
      matrix:[],
      level: 0,
      userCount: { 0: null, 1: null, 2: null },
      clusterShow: false,
      primaryCity: false,
      viewtype: "DEFAULT",
      cities: false,
      clustercount: 3,
      breadcrum: [
        { val: "primary", label: "Primary Cities", active: 1 },
        { val: "secondary", label: "Secondary Cities", active: 0 },
        { val: "zipcode", label: "Zipcode ", active: 0 }
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
    this.newClusterMarkers = [];
    (this.trufMarkers = []), (this.markers = []);
    this.clusterMarkers = [];
  
    this.markerClusterer = null;
    this.map = null;
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
          { val: "secondary", label: "Secondary Cities", active: 0 },
          { val: "zipcode", label: "Zipcode ", active: 0 }
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
        breadcrum: [
          { val: "primary", label: "Primary Cities", active: 0 },
          { val: "secondary", label: "Secondary Cities", active: 1 },
          { val: "zipcode", label: "Zipcode ", active: 0 }
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
      body: JSON.stringify({ cityID: cityID }),
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
          breadcrum: [
            { val: "primary", label: "Primary Cities", active: 0 },
            { val: "secondary", label: "Secondary Cities", active: 1 },
            { val: "zipcode", label: "Zipcode ", active: 0 }
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
  getpointswithCluster(count, data) {
    var options = { numberOfClusters: count };
    var points = { type: "FeatureCollection", features: data };
    var clustered = turf.clustersKmeans(points, options);
    
    return clustered;
  }
  getzipcodes(loc) {
    fetch("api/nearbyloc", {
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
        var clustered = this.getpointswithCluster(
          this.state.clustercount,
          json.clusterData
        );

      var matrix= this.clusterMatrix(clustered.features,this.state.clustercount);
       var centeriod=[];
       clustered.features.map((obj)=>{
                    if(obj.properties.centroid.length>0){
                        centeriod.push(obj.properties.centroid[0]+"&&"+obj.properties.centroid[1])
                    }
      });
    
       var uniquecenter=[...new Set(centeriod)]; 
        this.setState({
          cluserData: json.clusterData,
          nearByLocations: json.mapdata,
          turf: clustered.features,
          matrix:matrix,
          trufCenter:uniquecenter,
          cluster: json.pointerDetail,
          breadcrum: [
            { val: "primary", label: "Primary Cities", active: 0 },
            { val: "secondary", label: "Secondary Cities", active: 0 },
            { val: "zipcode", label: "Zipcode ", active: 1 }
          ],
          level: 2,
          userCount: {
            ...this.state.userCount,
            2: json.usercount
          },
          clusterShow: true,
          mruDetails: {
            ...this.state.mruDetails,
            criteriaContainer: "dn"
          }
        });
      });
  }
  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
                ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
  deg2rad(deg) {
        return deg * (Math.PI / 180);
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
              typeof: "p",
              title: `${markerCitiesData[i].cityname}`,
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
            position: latLng,
            draggable: false,
            citytype: `${markerCitiesData[i].type}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: scale,
              strokeColor: color
            },
            typeof: "s",
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
          if (this.typeof === "p") {
            self.getSecondary(this.titlename);
            var bounds = new google.maps.LatLngBounds();
            var latlng = new google.maps.LatLng(
              this.getPosition().lat(),
              this.getPosition().lng()
            );
            bounds.extend(latlng);
            map.setCenter(bounds.getCenter());
            map.setZoom(6.5);
          } else {
            if (self.state.mruDetails.criteriaValue !== "") {
              self.getzipcodes(this.titlename);
              var bounds = new google.maps.LatLngBounds();
              var latlng = new google.maps.LatLng(
                this.getPosition().lat(),
                this.getPosition().lng()
              );
              self.createCircle(map, latlng,160934);
              
                //25 MILES:40234
               //50MILES: 80469
              
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
      radius: radius
    });
  };
  clusterMatrix(clusterdata,count){
      var arrmatrix=[];
      clusterdata.map((obj)=>{
          
          if(typeof arrmatrix[obj.properties.cluster]==='undefined'){
               arrmatrix[obj.properties.cluster]={cid:null,count:0,group:[],distance:[],centriod:null};
          };
       
        obj.zipdetail.distance= this.getDistanceFromLatLonInKm(obj.properties.centroid[1],obj.properties.centroid[0],obj.zipdetail.latitude,obj.zipdetail.longitude)
        arrmatrix[obj.properties.cluster]['distance'].push(this.getDistanceFromLatLonInKm(obj.properties.centroid[1],obj.properties.centroid[0],obj.zipdetail.latitude,obj.zipdetail.longitude));
        arrmatrix[obj.properties.cluster]['count']=arrmatrix[obj.properties.cluster]['count']+obj.zipdetail.userCount;
        arrmatrix[obj.properties.cluster]['group'].push(obj.zipdetail);
        arrmatrix[obj.properties.cluster]['cid']=obj.properties.cluster;
        arrmatrix[obj.properties.cluster]['centriod']=obj.properties.centroid;
     });
        return arrmatrix;
  }
  viewchange(flag, count) {
    this.previousmarker();
    this.clusterMarkers = [];
    this.newClusterMarkers = [];
    var centeriod=[];
    if (count !== undefined) {
      var clustered = this.getpointswithCluster(count, this.state.cluserData);
      var matrix= this.clusterMatrix(clustered.features,count);
      clustered.features.map((obj)=>{
            if(obj.properties.centroid.length>0){
                centeriod.push(obj.properties.centroid[0]+"&&"+obj.properties.centroid[1])
            }
        });
            
      var uniquecenter=[...new Set(centeriod)];
      
      this.setState({
        ...this.state,
        viewtype: flag,
        clusterShow: true,
        trufCenter:uniquecenter,
        matrix:matrix,
        turf: clustered.features,
        mruDetails: {
          ...this.state.mruDetails,
          mruContainer: "dn",
          criteriaContainer: "dn"
        }
      });
    } else {
      this.setState({
        ...this.state,
        viewtype: flag,
        clusterShow: true,
        mruDetails: {
          ...this.state.mruDetails,
          mruContainer: "dn",
          criteriaContainer: "dn"
        }
      });
    }
  }
  filteredRecord(obj) {
    this.previousmarker();
    this.clusterMarkers = [];
    this.setState({
      nearByLocations: obj,
      breadcrum: [
        { val: "primary", label: "Primary Cities", active: 0 },
        { val: "secondary", label: "Secondary Cities", active: 0 },
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
  displayCluster() { /*
    this.previousmarker();
    this.clearHandler();
    this.clusterMarkers = [];
    this.newClusterMarkers = [];
    for (var i = 0; i < this.state.nearByLocations.length; i++) {
      var iconMarkerImg = "primarycity";
      var zipDetail = this.state.nearByLocations[i];
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
        // var imageUrl = 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&chco='FFFFFF,008CFF,000000&ext=.png';
        //var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));
        var zipmarker = new google.maps.Marker({
          position: latLng,
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
        this.newClusterMarkers.push(zipmarker);
      }
    }
    this.markerClusterer = new MarkerClusterer(
      this.map,
      this.newClusterMarkers,
      { minimumClusterSize: 10, imagePath: "../img/culsterimg/m" }
    );
  */ }
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
    var clusterData = this.state.turf;
    var colorobj = {
      color0: "#800080",
      color1: "#C71585",
      color2: "#FFA500",
      color3: "#32CD32",
      color4: "#A0522D"
    };


      for (var i = 0; i < this.state.trufCenter.length; ++i) {
            var center = this.state.trufCenter[i];
            var latLng = new google.maps.LatLng( Number(center.split("&&")[1]),  Number(center.split("&&")[0]) );
            var  mapMarker = {
                        icon: {
                             scaledSize: new google.maps.Size(30, 30), // scaled size
                             origin: new google.maps.Point(0, 0),
                            url: `img/cluster.png`
                        },
                        position: latLng,
                        draggable: false,
                        map: this.map,
                        title: `Cluster ${i+1}`
            };
        var centriodPlace=new google.maps.Marker(mapMarker);
        this.trufMarkers.push(centriodPlace);
    }

    for (var i = 0; i < clusterData.length; ++i) {
       var position = clusterData[i];
      var latLng = new google.maps.LatLng(
        position.geometry.coordinates[1],
        position.geometry.coordinates[0]
      );
      var zips = {
        position: latLng,
        draggable: false,
         value: `${position.zipdetail.zip}`,
          title: `${position.zipdetail.locName}`,
          relation: `${position.zipdetail.relation}`,
          mruid: `${position.zipdetail.mruid}`,
          prevdate: `${position.zipdetail.mrudate}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          strokeColor: colorobj[`color${position.properties.cluster}`]
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
  primaryClickhandler(index) {
    google.maps.event.trigger(this.markers[index], "click");
  }
  mouseOverhandler(index, flag) {
    if (flag) {
      this.markers[index].setAnimation(google.maps.Animation.BOUNCE);
    } else {
      this.markers[index].setAnimation(null);
    }
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
              

              <Criteria
                criteriaContainer={this.state.mruDetails.criteriaContainer}
                onRadioChange={e => this.onRadioChange(e)}
              />
             

              {(() => {
                if (this.state.nearByLocations.length >= 1) {
                  if (this.state.viewtype === "DEFAULT") {
                    return (
                      <div>
                        <Mapview
                          selectedmap={this.state.viewtype}
                          viewtype={(flag, count) =>
                            this.viewchange(flag, count)
                          }
                        />
                         
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
                          viewtype={(flag, count) =>
                            this.viewchange(flag, count)
                          }
                        />
                      
                      </div>
                    );
                  }
                }
              })()}
            </div>
            <div className="col-md-8 col-sm-12">
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
              
              
                 <SecondaryFilters
                criteriaContainer={this.state.mruDetails.criteriaContainer}
                allRecord={this.state.secondaryCities}
                secondaryfilterRecord={ob => this.secondaryfilterRecord(ob)}
              />
                  
                   {(() => {
                if (this.state.nearByLocations.length >= 1) {
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
                  
                     return (  <ClusterMatrix matrix={this.state.matrix} centriod={this.centriodMarker}/>)                      
                                           
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
