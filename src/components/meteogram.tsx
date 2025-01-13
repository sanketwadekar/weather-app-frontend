import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import Windbarb from 'highcharts/modules/windbarb';

HighchartsMore(Highcharts);
Windbarb(Highcharts);

interface MeteogramProps {
  data: {
    humidity: any[];
    wind: any[];
    temperature: any[];
    pressure: any[];
  };
}

const Meteogram: React.FC<MeteogramProps> = ({ data }) => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize chart data and options
  useEffect(() => {
    const { humidity, wind, temperature, pressure } = data;
    
    const precipitations = humidity;
    const precipitationsError: any[] = []; // Use appropriate data type
    const winds = wind;
    const temperatures = temperature;
    const pressures = pressure;

    // Build chart options
    const options = {
      chart: {
        renderTo: chartContainerRef.current,
        marginBottom: 80,
        marginRight: 40,
        marginTop: 70,
        plotBorderWidth: 1,
        height: 400,
        alignTicks: false,
        scrollablePlotArea: {
          minWidth: 720,
        },
      },
      defs: {
        patterns: [
          {
            id: 'precipitation-error',
            path: {
              d: [
                'M', 3.3, 0, 'L', -6.7, 10,
                'M', 6.7, 0, 'L', -3.3, 10,
                'M', 10, 0, 'L', 0, 10,
                'M', 13.3, 0, 'L', 3.3, 10,
                'M', 16.7, 0, 'L', 6.7, 10,
              ].join(' '),
              stroke: '#68CFE8',
              strokeWidth: 1,
            },
          },
        ],
      },
      title: {
        text: 'Hourly Weather (For Next 5 Days)',
        align: 'center',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },
      },
      credits: {
        text: 'Forecast',
        position: {
          x: -40,
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br/>',
      },
      xAxis: [
        {
          type: 'datetime',
          tickInterval: 6 * 36e5, // two hours
          minorTickInterval: 36e5, // one hour
          tickLength: 0,
          gridLineWidth: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 40,
          showLastLabel: true,
          labels: {
            format: '{value:%H}',
          },
          crosshair: true,
        },
        {
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: -1,
          },
          opposite: true,
          tickLength: 20,
          gridLineWidth: 1,
        },
      ],
      yAxis: [
        {
          title: { text: null },
          labels: {
            format: '{value}°',
            style: {
              fontSize: '10px',
            },
            x: -3,
          },
          plotLines: [
            {
              value: 0,
              color: '#BBBBBB',
              width: 1,
              zIndex: 2,
            },
          ],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
        },
        {
          title: { text: null },
          labels: { enabled: false },
          gridLineWidth: 0,
          tickLength: 0,
          minRange: 10,
          min: 0,
        },
        {
          allowDecimals: false,
          title: {
            text: 'inHg',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
              fontSize: '10px',
              color: '#F2AE43',
            },
            textAlign: 'left',
            x: 3,
          },
          labels: {
            style: {
              fontSize: '8px',
              color: '#F2AE43',
            },
            y: 2,
            x: 3,
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: false,
        },
      ],
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          pointPlacement: 'between',
        },
      },
      series: [
        {
          name: 'Temperature',
          data: temperatures,
          type: 'spline',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
              ' ' +
              '{series.name}: <b>{point.y}°F</b><br/>',
          },
          zIndex: 1,
          color: '#F4373A',
          negativeColor: '#48AFE8',
        },
        {
          name: 'Humidity',
          data: precipitationsError,
          type: 'column',
          color: 'url(#precipitation-error)',
          yAxis: 1,
          groupPadding: 0,
          pointPadding: 0,
          tooltip: {
            valueSuffix: ' %',
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
              ' ' +
              '{series.name}: <b>{point.minvalue} % - ' +
              '{point.maxvalue} %</b><br/>',
          },
          grouping: false,
          dataLabels: {
            enabled: true,
            filter: {
              operator: '>',
              property: 'maxValue',
              value: 0,
            },
            style: {
              fontSize: '8px',
              color: 'gray',
            },
          },
        },{
					name: 'Humidity',
					data: precipitations,
					type: 'column',
					color: '#86CDFE',
					yAxis: 1,
					groupPadding: 0,
					pointPadding: 0,
					grouping: false,
					dataLabels: {
							enabled: true,
							filter: {
									operator: '>',
									property: 'y',
									value: 1
							},
							style: {
									fontSize: '8px',
									color: '#666'
							}
					},
					tooltip: {
							valueSuffix: ' %'
					}
			},
        {
          name: 'Air pressure',
          color: '#F2AE43',
          data: pressures,
          marker: {
            enabled: false,
          },
          shadow: false,
          tooltip: {
            valueSuffix: ' inHg',
          },
          dashStyle: 'shortdot',
          yAxis: 2,
        },
        {
					name: 'Wind',
					type: 'windbarb',
					id: 'windbarbs',
					color: "#000000",
					lineWidth: 1.5,
					data: winds,
					vectorLength: 10,
					xOffset: 4,
					yOffset: -23,
					tooltip: {
							valueSuffix: ' m/s'
					}
			}
      ],
    };

    setChartOptions(options);
  }, [data]);

  return <div>
      <div ref={chartContainerRef}></div>
      {chartOptions && (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      )}
    </div>
};

export default Meteogram;
