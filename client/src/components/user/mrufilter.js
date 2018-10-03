import React, { Component } from "react";

class Mrufilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allMru: props.allmru
        };

        this.changeFilter = this.changeFilter.bind(this);
    }
    componentWillReceiveProps(props) {
        this.setState({allMru: props.allmru});
    }
    changeFilter(flag) {


        switch (flag) {
            case "IS_AT":

                this.state.allMru.map((obj, i) => {

                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }

                });

                break;

            case "IS_EXPECTED_AT":

                this.state.allMru.map((obj, i) => {

                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }

                });

                break;

            default:
                this.state.allMru.map((obj, i) => {
                    obj.show = true;
                });

                break;

        }

        console.log(this.state.allMru)

        return this.state.allMru;

    }
    render() {
        return (  
            <div className="row">
                <div className="col-md-4 col-sm-12" style={{"padding":"0px","margin":"0"}} >
                    <span  onClick={() => this.props.filterRecord(this.changeFilter("IS_AT"))}> <img style={{"width":"50px"}} src="img/mru/IS_AT/mru.png"/>
                    Current locations</span>
                  
                </div> 
                <div className="col-md-5 col-sm-12" style={{"padding":"0px","margin":"0"}} >
                <span onClick={() => this.props.filterRecord(this.changeFilter("IS_EXPECTED_AT"))}>
                   <img style={{"width":"50px"}}  src="img/mru/IS_EXPECTED_AT/mru.png"/>
                   Expected locations
                   </span>
                  
                </div>
                <div className="col-md-1 col-sm-12" style={{"padding":"0px","margin":"0"}} >
                      <button type="button" onClick={() => this.props.filterRecord(this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button>
                </div>
            </div>
               
               );
    }
}

export default Mrufilter;
