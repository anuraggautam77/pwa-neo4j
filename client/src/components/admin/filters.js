import React, { Component } from "react";

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRecord: props.allRecord

        };
    }
    componentWillReceiveProps(props) {
        this.setState({allRecord: props.allRecord})
    }
    changeFilter(flag) {
         
        switch (flag) {
            case "IS_AT":
               this.state.allRecord.map((obj, i) => {
                 
                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                break;

            case "IS_EXPECTED_AT":
                 this.state.allRecord.map((obj, i) => {
                    if (obj.relation === flag) {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                 break;

              case "TOP_MOST":
                this.state.allRecord.map((obj, i) => {
                      if (i <= 30 && obj.relation !== "IS_EXPECTED_AT" && obj.relation !== "IS_AT") {
                        obj.show = true;
                    } else {
                        obj.show = false;
                    }
                });
                 break;
            default:
                this.state.allRecord.map((obj, i) => {
                       obj.show = true;
                });
                break;
        }
        
        return this.state.allRecord;
 
    }
    render() {
        return (<div className="filter-container">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h5><b>Filters</b> </h5>
                </div> 
                <div className="panel-body">
                    <ul>
                        <li onClick={() => this.props.filterRecord(this.changeFilter("IS_AT"))}>
                            <button type="button" className="btn green btn-circle btn-lg"></button>
                            <span>Current MRU Location</span>
                        </li>
                        <li  onClick={() =>this.props.filterRecord( this.changeFilter("IS_EXPECTED_AT"))}>
                            <button type="button" className="btn yellow btn-circle btn-lg"></button>
                            <span>In future MRU Location </span>
                        </li>
                        <li  onClick={() =>this.props.filterRecord( this.changeFilter("TOP_MOST"))}>
                            <button type="button" className="btn topmost btn-circle btn-lg"></button>
                            <span>Recommended Location </span>
                        </li>
        
                    </ul>
                </div>
        
                <div className="panel-footer">
                    <button type="button" onClick={() =>this.props.filterRecord( this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button>
                </div>
            </div>    
        
        </div>
                );
    }
}

export default Filters;
