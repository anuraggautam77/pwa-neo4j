import React, { Component } from "react";
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
class Mapview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showslider: "db",
            value: 3,
            // type:props.selectedmap,
            //distance:props.distance
            type: "TRUF",
            distance: 80469
        }

    }
    componentWillReceiveProps(props) {

        if (props.selectedmap !== "DEFAULT") {
            this.setState({...this.state, showslider: "db"});
        } else {
            this.setState({...this.state, showslider: "dn"});
        }

    }
    changeView(type, count, distance, recluster) {
        if (count === undefined) {
            count = this.state.value;
        }

        if (distance === undefined) {
            distance = this.state.distance;
        }


        this.setState({value: count, type: type, distance: distance}, () => {
            this.props.viewtype(type, count, distance, recluster);
        });

    }
    render() {

        return (<div className="small-box colorone border-class">
           <div className="row text-center">
                <div className="small-box-footer" style={{"margin": "10px"}}>Custom Changes  </div>
              
                <div className="col-md-4 col-md-offset-1">
                    <div className="custom-container">
                        <div className="inner">
                            <select className="form-control dropdown"  onChange={(e) => {
                            this.changeView(this.state.type, this.state.value, e.currentTarget.value)
                                                 }  }>
        
                                <option>Change Distance</option>
                                <option value="40234">25 Miles</option>
                                <option value="80469">50 Miles</option>
                                <option value="120800">75 Miles</option>
                                <option value="160934">100 Miles</option>
                            </select>
        
        
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <input type="button" className="btn btn-success btn-sm" onClick={() => {
                                this.changeView("TRUF", this.state.value, this.state.distance, "recluster")
                                                }} value="ReCluster" />    
                    &nbsp;
                    <input type="button" className="btn btn-success btn-sm" onClick={() => {
                                    this.props.placemru()
                 }} value="PlaceMRU" />  
                </div>
            </div>
            <div className="row">
                <div className="col-md-5 col-md-offset-3">
                    <br/>
                    <InputRange   maxValue={6}  minValue={2} value={this.state.value}  onChange={value => this.changeView("TRUF", value, this.state.distance)} />
                    <br/> 
                </div>       
            </div>
        </div>
                                );
        }
    }

    export default Mapview;
