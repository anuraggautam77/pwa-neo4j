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
     const template=  arry.map((obj,i) => {
            if (obj.show) {
                  k++;
                return(
                        <li className="list-group-item" data={k-1}
                           onClick={(e) =>{ 
                             this.props.onclickHandler(e.target.getAttribute('data'));
                            }}
                    key={k}> 
                            {obj.zip}
                            <span className="badge">{obj.userCount}</span>
                        </li>
                        )
              
            }
        });
        return template;
    }
    render() {
        return (
                <ul className="list-group zipcode-dn  graph-details">
                    {
                      this.listing(this.state.nearByLocations)
                    }                   
                </ul>
                );
    }
}

export default NearByLocation;
