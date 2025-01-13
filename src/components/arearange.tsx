
import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

interface MeteogramProps {
  data: any[]
}

const TemperatureChart: React.FC<MeteogramProps> = ({ data }) => {
	const options = {
		chart: {
			type: "arearange",
			zooming: {
				type: "x",
			},
			scrollablePlotArea: {
				minWidth: 600,
				scrollPositionX: 1,
			},
		},
		title: {
			text: "Temperature Ranges (Min, Max)",
		},
		xAxis: {
			type: "datetime",
			units: [["day", [1]]],
		},
		yAxis: {
			title: {
				text: null,
			},
		},
		tooltip: {
			crosshairs: true,
			shared: true,
			valueSuffix: "°C",
			xDateFormat: "%A, %b %e",
		},
		legend: {
			enabled: false,
		},
		time: {
			timezone: "America/Los_Angeles",
		},
		series: [
			{
				name: "Temperatures",
				data: data || [],
				color: {
					linearGradient: {
						x1: 0,
						x2: 0,
						y1: 0,
						y2: 1,
					},
					stops: [
						[0, "#EBAD4D"],
						[1, "#93d2ff"],
					],
				},
			},
		],
	}

	return (
		<div className="chart-container">
			<HighchartsReact highcharts={Highcharts} options={options} />
		</div>
	);
}

export default TemperatureChart;