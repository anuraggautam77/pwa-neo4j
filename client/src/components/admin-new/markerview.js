import React, { Component } from "react";
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css'
        class Mapview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showslider: "dn",
            value: 3
        }

    }
    componentWillReceiveProps(props) {

        if (props.selectedmap !== "DEFAULT") {
            this.setState({...this.state, showslider: "db"});
        } else {
            this.setState({...this.state, showslider: "dn"});
        }

    }
    changeView(type, count) {
        if (count == undefined) {
            count = this.state.value;
        }
        this.setState({value: count}, () => {
            this.props.viewtype(type, count);
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
                                        <a href="javascript:void(0)" onClick={() => this.changeView("DEFAULT")}>
                                            <h3>Default View </h3>
                                            <img src="img/culsterimg/zip/primarycity.png"/>
                                        </a>
                                    </div>
                                    <div className="col-md-6">
                                        <a href="javascript:void(0)" onClick={() => this.changeView("TRUF")}>
                                            <h3>Cluster View </h3>
                                            <img src="img/culsterimg/m2.png"/>
                                        </a>
                                    </div>
                                </div>
                            </section>
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
                                        <InputRange    maxValue={6}  minValue={2} value={this.state.value}  onChange={value => this.changeView("TRUF", value)} />
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
