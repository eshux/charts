import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, StabilityData } from '../../types/types';

type Props = {
  stabilityData: StabilityData;
  currentFeature: string;
  width: number;
};

const StabilityChart: FC<Props> = ({
  stabilityData,
  currentFeature,
  width,
}) => {
  const [stabChartData, setStabChartData] = useState<ChartData>();
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    setStabChartData({
      options: {
        chart: {
          type: 'bar',
          id: 'stability-bar',
          toolbar: {
            show: true,
            tools: {
              zoom: true,
            },
          },
        },
        title: {
          text: 'Stability data',
          margin: 20,
        },
        stroke: {
          width: 2,
        },
        xaxis: {
          categories: [
            ...stabilityData[currentFeature].stabilityAnalysis.xLeftEdge,
          ],
          labels: {
            show: true,
            formatter(val) {
              return Number(val).toFixed(3);
            },
            rotate: -45,
            offsetY: 2,
            style: {
              fontSize: '8',
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            align: 'right',
            minWidth: 100,
            maxWidth: 400,
            style: {
              fontSize: '10',
            },
          },
        },
        responsive: [
          {
            breakpoint: width,
            options: {
              yaxis: {
                labels: {
                  show: width > 500,
                  style: {
                    fontSize: '9',
                  },
                },
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          followCursor: true,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: false,
            columnWidth: `${
              100 / // @ts-ignore
              stabilityData[currentFeature].nanStabilityAnalysis.binWidth
            }%`,
          },
        },
        colors: ['#196D85', '#34B7DC'],
        legend: {
          show: false,
        },
      },
      series: [
        {
          name: 'Baseline',
          data: [...stabilityData[currentFeature].stabilityAnalysis.yBaseline],
        },
        {
          name: 'Production',
          data: [
            ...stabilityData[currentFeature].stabilityAnalysis.yProduction,
          ],
        },
      ],
    });
  }, [stabilityData, currentFeature, width, showBar]);

  return (
    <>
      <button
        type="button"
        className="toggleButton"
        onClick={() => setShowBar(!showBar)}
      >
        {showBar ? 'Switch to lines' : 'Switch to bars'}
      </button>
      {stabChartData && (
        <>
          <Chart
            options={stabChartData.options}
            series={stabChartData.series}
            type={!showBar ? 'line' : 'bar'}
            height="500"
          />
        </>
      )}
    </>
  );
};

export default StabilityChart;
