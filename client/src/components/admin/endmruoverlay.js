import React, { Component } from "react";
import Chart from 'chart.js';

class GraphOverlay extends Component {
constructor(props) {
super(props);
        this.state = {
                overlayshow:props.showgraph
       };
       
     this.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
    };
  }
  
   componentDidMount() {
       var canvas = document.getElementById('chart');
       var ctx = canvas.getContext('2d');
       var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
					datasets: [{
						label: 'Subscribe for MRU',
						fill: false,
						backgroundColor: this.chartColors.red,
						borderColor: this.chartColors.red,
						data: [18, 33, 22, 19, 11, 39, 30]
					}]
				},
				options: {
					responsive: true,
					title: {
						display: true,
						text: "User Registration"
					},
					scales: {
						xAxes: [{
							gridLines: {display:true},
                                                        scaleLabel: { display: true, labelString: 'Date/Months' }
						}],
						yAxes: [{
							gridLines: {display:true},
							ticks: { min: 0, max: 100, stepSize: 10 },
                                                        scaleLabel: {
							display: true,
							labelString: 'User Count'
						}
						}]
					}
				}
			}
      
        );
    }
  
  
componentWillReceiveProps(props) {
    this.setState({
         overlayshow:props.showgraph
    });
  }
render() {
return (
<div className={this.state.overlayshow}>
    <div id="myModal" className="modal">
        <div className="col-md-6 col-md-push-3 col-sm-12 modal-content">
            <span className="row close" onClick={() => this.setState({'overlayshow':'dn'})}>&times;</span>
            <div className="chart-container"  >
                <canvas id="chart"></canvas>
            </div>
            
            
        </div>
    </div>
</div>
        );
}
}

export default GraphOverlay;
