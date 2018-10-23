import React, { Component } from "react";

class Map extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            lng: props.mapCenter.longitude,
            lat: props.mapCenter.latitude,
            zoom: props.mapCenter.zoom
        };

        this.radiusMarker = null;
        this.map = null;
        this.businessMarkers = [];
        this.registerUserMarker = [];

    }

    setBusinessMarkers() { }

    setRegisterUrserMarkers() { }

    componentDidUpdate() {
        this.createCircle(this.map, {lat: this.props.mapCenter.latitude, lng: this.props.mapCenter.longitude}, this.props.mapCenter.radius)

    }

    componentDidMount() {
        var latlng = {lat: this.state.lat, lng: this.state.lng}
        this.map = new google.maps.Map(document.getElementById('admin-map'), {
            zoom: 13,
            center: latlng
        });

        const onDragEnd = e => {
            var lngLat = e.latLng;
            var viewport = {
                latitude: lngLat.lat(),
                longitude: lngLat.lng(),
                zoom: this.map.getZoom()
            };
            this.props.mapSearchPointChange(viewport);
            this.createCircle(this.map, {lat: lngLat.lat(), lng: lngLat.lng()}, this.props.mapCenter.radius);
        };

        var marker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: latlng
        }).addListener('dragend', onDragEnd);
        this.createCircle(this.map, latlng, this.props.mapCenter.radius);

    }

    createCircle = (map, latlng, radius) => {
        if (this.radiusMarker !== null) {
            this.radiusMarker.setMap(null);
        }

        this.radiusMarker = new google.maps.Circle({
            strokeColor: '#a9d26d',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#a9d26d',
            fillOpacity: 0.35,
            map: map,
            center: latlng,
            radius: Math.sqrt(radius) * 1000
        });

    }

    render() {
        return (<div id="admin-map" className="admin-map"></div>);
    }
}

export default Map;
