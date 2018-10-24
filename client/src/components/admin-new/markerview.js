import React, { Component } from "react";
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
        class Mapview extends Component {
    constructor(props) {
        super(props);
          console.log(props);
        this.state = {
            showslider: "db",
            value: 3,
           // type:props.selectedmap,
            //distance:props.distance
            type:"TRUF",
            distance:80469
            
            
        }

    }
    componentWillReceiveProps(props) {
        
        if (props.selectedmap !== "DEFAULT") {
            this.setState({...this.state, /*distance:props.distance,  type:props.selectedmap,*/ showslider: "db"});
        } else {
            this.setState({...this.state, /* distance:props.distance,  type:props.selectedmap,*/ showslider: "dn"});
        }

    }
    changeView(type, count,distance) {
        
        
        
        if (count === undefined) {
            count = this.state.value;
        }
        
         if (distance === undefined) {
            distance = this.state.distance;
        }
        
        
        this.setState({value:count,type:type,distance:distance}, () => {
            console.log(this.state);
            
            this.props.viewtype(type,count,distance);
        });

    }
    render() {

        return (<div>
            <div className="row zipcode-filter" >
                <div className="well panel-heading alignheading">
                    <div className="widget-tile">
                        <section>
                            <h5>
                                <strong> MAP VIEW</strong>  
                            </h5>
                            <div className="progress progress-xs progress-white progress-over-tile"></div>
                            <div className="row">
                                <div className="col-md-6">
                                    <a href="javascript:void(0)" onClick={() => this.changeView("TRUF")}>
                                        <h5>Cluster </h5>
                                    </a>
                                </div>
                                <div className="col-md-6">
                                    <a href="javascript:void(0)" onClick={() => this.changeView("DEFAULT")}>
                                        <h5>Default </h5>
                                    </a>
                                </div>
                            </div>
                            
        
                        </section>
                    </div>
                
                    <div className="widget-tile">
                        <div className="row">
                                <div className="col-md-12">
                                     <h5>Change Distance </h5>
                                </div>
                                <div className="col-md-12">
                                    <select className=""  onChange={(e)=>{ 
                                         this.changeView(this.state.type,this.state.value,e.currentTarget.value)
                                        }
                                        }>
                                        
                                       <option>Select Distance</option>
                                            <option value="40234">25 Miles</option>
                                            <option value="80469">50 Miles</option>
                                            <option value="120800">75 Miles</option>
                                            <option value="160934">100 Miles</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            
            
            <div className= {`row zipcode-filter ${this.state.showslider}`}>
                <div className="well panel-heading alignheading">
                    <div className="widget-tile">
                        <section>
                            <h5>
                                <strong>Cluster Count: {this.state.value}</strong>  
                            </h5>
                            <div className="progress progress-xs progress-white progress-over-tile"></div>
        
                            <div className=''>
                                <div className="col-md-1"></div>
                                <div className="col-md-12">
                                    <br/>
                                    <InputRange   maxValue={6}  minValue={2} value={this.state.value}  onChange={value => this.changeView("TRUF", value,this.state.distance)} />
                                    <br/>
                                </div>
                                <div className="col-md-1"></div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>

                );
    }
}

export default Mapview;
