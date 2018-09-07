import React, { Component } from "react";

class UserCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: props.usercount
        };
    }
    componentWillReceiveProps(props) {

        this.setState({count: props.usercount});
    }
    render() {
        var mruCount = this.state.count.userCount[this.state.count.level];
        return (
                <div className="row well bg-inverse">
                    <div className="widget-tile">
                        <section>
                            <h5><strong> Registered Users :</strong> {mruCount} </h5>
                            <div className="progress progress-xs progress-white progress-over-tile"></div>
                            <div className="row">
                                <div className="col-md-4 label-white">MRU</div>
                                <div className="col-md-4 label-white">Promotion</div>
                                <div className="col-md-4 label-white">Coupon</div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">{mruCount}</div>
                                <div className="col-md-4">0</div>
                                <div className="col-md-4">0</div>
                            </div>
                        </section>
                    </div>
                </div>
                );
    }
}

export default UserCount;
