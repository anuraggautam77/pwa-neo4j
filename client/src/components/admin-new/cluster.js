import React, { Component } from "react";
import MarkerClusterer  from '../../common/markerclusterer';
const imageUrl = 'https://chart.apis.google.com/chart?cht=mm&chs=24x32&chco=FFFFFF,008CFF,000000&ext=.png';
class Cluster extends Component {
 
    constructor(props) {
        super(props);
        this.markerClusterer = null
        this.map = null;
        this.infoWindow = null;
        this.state = {}
    }

    componentDidMount() {
        fetch('api/nearbyloc', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lat: 'lat', lng: 'lng'})
        }).then(res => res.json()).then(json => {
            this.setState({clusters: json.mapdata});
        });

    }

    componentDidUpdate(props) {

        this.map = new google.maps.Map(document.getElementById('cluster-map'), {
            zoom: 3,
            center: new google.maps.LatLng(this.props.mapCenter.latitude, this.props.mapCenter.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.infoWindow = new google.maps.InfoWindow();
        this.markeCluster();
    }

    markeCluster() {

        if (this.markerClusterer) {
            this.markerClusterer.clearMarkers();
        }

        var markers = [];
        var markerImage = new google.maps.MarkerImage(imageUrl, new google.maps.Size(24, 32));


        for (var i = 0; i < 1000; ++i) {
            var latLng = new google.maps.LatLng(
                    this.state.clusters.photos[i].latitude,
                    this.state.clusters.photos[i].longitude
                    );
            var marker = new google.maps.Marker({
                position: latLng,
                draggable: false,
                icon: markerImage,
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
            var markerClickHandler = this.markerClickFunction(this.state.clusters.photos[i], latLng)
            google.maps.event.addListener(marker, 'click', markerClickHandler);

        }


        this.markerClusterer = new MarkerClusterer(this.map, markers, {
            maxZoom: 5,
            gridSize: 40,
            imagePath: 'img/culsterimg/m'
        });

    }

    markerClickFunction = (pic, latlng) => {
        return  (e) => {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }
            var title = pic.photo_title;
            var url = pic.photo_url;
            var fileurl = pic.photo_file_url;

            var infoHtml = '<div class="info"><h3>' + title +
                    '</h3><div class="info-body">' +
                    '<a href="' + url + '" target="_blank"><img src="' +
                    fileurl + '" class="info-img"/></a></div>' +
                    '<br/>' +
                    '<a href="' + pic.owner_url + '" target="_blank">' + pic.owner_name +
                    '</a></div></div>';

            this.infoWindow.setContent(infoHtml);
            this.infoWindow.setPosition(latlng);
            this.infoWindow.open(this.map);
        };
    }  

    render() {
        return (<div id="cluster-map" className="cluster-map" ></div>);
    }
}

export default Cluster;
