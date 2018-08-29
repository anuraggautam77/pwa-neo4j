import React, { Component } from 'react';
 
 
import DeviceList from '../components/notifications/index';

export default class Notification extends Component {

    constructor(props) {
        super(props);
    }
    
   render() {

        return (
                <div>
                     <DeviceList/>  
                </div>
                )
    }
}
