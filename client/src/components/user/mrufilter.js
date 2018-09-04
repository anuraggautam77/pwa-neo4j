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
        return (<div>
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h5><b>Filters </b> </h5>
                </div>
                <div className="panel-body">
                    <ul>
                        <li onClick={() => this.props.filterRecord(this.changeFilter("IS_AT"))}>
                            <img src="img/mru/IS_AT/mru.png"/>
                            <span>Is at locations</span>
                        </li>
                        <li  onClick={() => this.props.filterRecord(this.changeFilter("IS_EXPECTED_AT"))}>
                            <img src="img/mru/IS_EXPECTED_AT/mru.png"/>
                            <span>Is Expected locations</span>
                        </li>
        
                    </ul>
                </div>
                <div className="panel-footer">
                    <button type="button" onClick={() => this.props.filterRecord(this.changeFilter(""))} className="btn btn-primary btn-xs"> Reset filter</button>
                </div>
            </div>
        </div>
                );
    }
}

export default Mrufilter;
