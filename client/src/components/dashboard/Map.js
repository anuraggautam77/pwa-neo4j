import React, { Component } from "react";
 class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lng: props.mapCenter.longitude,
            lat: props.mapCenter.latitude,
            zoom: props.mapCenter.zoom
        };
        this.businessMarkers = [];
        this.registerUserMarker = [];

    }

    createGeoJSONCircle = (center, radiusInKm, points) => {
        if (!points)
            points = 64;
        var coords = {
            latitude: center[1],
            longitude: center[0]
        };
        var km = radiusInKm;
        var ret = [];
        var distanceX = km / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
        var distanceY = km / 110.574;

        var theta, x, y;
        for (var i = 0; i < points; i++) {
            theta = i / points * (2 * Math.PI);
            x = distanceX * Math.cos(theta);
            y = distanceY * Math.sin(theta);

            ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);

        return {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Polygon",
                            coordinates: [ret]
                        }
                    }
                ]
            }
        };
    }

    businessPopupHTML = business => {
        return `<ul>
    <li>
      <strong>Name: </strong> ${business.name}
    </li>
    <li>
      <strong>Address: </strong> ${business.address}
    </li>
    <li>
      <strong>City: </strong> ${business.city}
    </li>
    <li>
      <strong>Categories: </strong> ${business.categories.join(", ")}
    </li>
  </ul>`;
    }

    userPopupHTML = userdetail => {
        return `<ul>
    <li>
      <strong>Device Id of user: </strong> ${userdetail}
    </li>
    <li>
      <strong>User name: dummmy Name</strong>
    </li>
  </ul>`;
    }

    setBusinessMarkers() {
        console.log("<<<<<<<<<<<<<<<");

        console.log(this.props)
        const {businesses} = this.props;
        this.businessMarkers.map(m => {
            m.remove();
            return true;
        });

        this.businessMarkers = businesses.map(b => {
            console.log(b);
            return new mapboxgl.Marker().setLngLat([b.location.x, b.location.y]).setPopup(
                    new mapboxgl.Popup({offset: 25}).setHTML(this.businessPopupHTML(b))
                    )
                    .addTo(this.map);
        });
    }

    setRegisterUrserMarkers() {
        const {registerData} = this.props;
        this.registerUserMarker.map(m => {
            m.remove();
            return true;
        });

 

        this.registerUserMarker = registerData.map(b => {
            console.log(b._fields[1], b._fields[0]);
         //   var el = document.createElement('div');
         //   el.className = 'marker_anurag';
            return new mapboxgl.Marker().setLngLat([b._fields[1], b._fields[0]]).setPopup(
                    new mapboxgl.Popup({offset: 25}).setHTML(this.userPopupHTML(b._fields[1]+'--'+b._fields[0]))
                    )
                    .addTo(this.map);
        });
    }

    componentDidUpdate() {

        this.setBusinessMarkers();
        this.setRegisterUrserMarkers();
        if (this.mapLoaded) {
            this.map.getSource("polygon")
                    .setData(
                            this.createGeoJSONCircle(
                                    [this.props.mapCenter.longitude, this.props.mapCenter.latitude],
                                    this.props.mapCenter.radius
                                    ).data
                            );
        }
    }

    componentDidMount() {
        const {lng, lat, zoom} = this.state;
 

        this.map.addControl(new mapboxgl.NavigationControl({position: 'bottom-left'}));

        this.map.on("load", () => {
            this.mapLoaded = true;
            this.map.addSource("polygon", this.createGeoJSONCircle([lng, lat], this.props.mapCenter.radius)
                    );
            this.map.addLayer({id: "polygon", type: "fill", source: "polygon",
                layout: {}, paint: {"fill-color": "blue", "fill-opacity": 0.6}
            });

        });

        const onDragEnd = e => {
            
            
            console.log("drag>>>>>>>>>>.")
            var lngLat = e.target.getLngLat();

            const viewport = {
                latitude: lngLat.lat,
                longitude: lngLat.lng,
                zoom: this.map.getZoom()
            };
            this.props.mapSearchPointChange(viewport);
            this.map.getSource("polygon").setData(
                    this.createGeoJSONCircle([lngLat.lng, lngLat.lat], this.props.mapCenter.radius).data
           );
        };

        

        this.map.on("move", () => {
            
            console.log("move>>>>>>>>>>.")
            const {lng, lat} = this.map.getCenter();

            this.setState({
                lng: lng,
                lat: lat,
                zoom: this.map.getZoom().toFixed(2)
            });
        });

        //  this.setBusinessMarkers();

        this.setRegisterUrserMarkers();
    }

    render() {
        return (
                <div>
                    <div
                        ref={el => (this.mapContainer = el)}
                        className="absolute top right left bottom"
                        />
                </div>
                );
    }
}

export default Map;
