import React, { Component } from "react";

class NearByLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nearByLocations: props.nearbystate
        };
    }
    componentWillReceiveProps(props) {
        this.setState({nearByLocations: props.nearbystate})
    }
    listing(arry) {
        var k = 0;
        
        const template = arry.map((obj, i) => {
            if (obj.show) {

                k++;
                return(
                        <li className="list-group-item" data={k - 1}
                            onClick={(e) => {
                                this.props.onclickHandler(e.target.getAttribute('data'));
                                                                                                                            }}
                            key={k}> 
                            {obj.locName} ( {obj.zip})
                            <span className="badge">{obj.userCount}</span>
                        </li>
                            )

            }
        });
        return template;
    }
    render() {
        var count=0;
         this.state.nearByLocations.map((obj, i) => {
               count += obj.userCount;
         });
        
        
        return (
                <div className="row panel panel-default">
                    <div className="panel-heading">
                        <h5>{this.state.nearByLocations[0].cityname} ({count}) </h5>
                    </div>
                    <ul className="list-group zipcode-dn  graph-details">
                        {
                    this.listing(this.state.nearByLocations)
                        }                   
                    </ul>
                </div>
                );
    }
}

export default NearByLocation;
