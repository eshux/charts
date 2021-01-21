import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, StabilityData } from '../../types/types';

type Props = {
  stabilityData: StabilityData;
  currentFeature: string;
};

const NanStabilityChart: FC<Props> = ({ stabilityData, currentFeature }) => {
  const [nanStabChartData, setNanStabChartData] = useState<ChartData>();

  useEffect(() => {
    setNanStabChartData({
      options: {
        chart: {
          id: 'anStability-bar',
        },
        xaxis: {
          categories: [
            ...stabilityData[currentFeature].nanStabilityAnalysis.xLeftEdge,
          ],
          labels: {
            show: true,
            trim: false,
            formatter(val: string) {
              return Number(val).toFixed(3);
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
        title: {
          text: 'NanStability data',
          margin: 20,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: false,
            columnWidth: `${100 / stabilityData[currentFeature].nanStabilityAnalysis.binWidth[0]}%`,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        colors: ['#196D85', '#34B7DC'],
      },
      series: [
        {
          name: 'Baseline',
          data: [
            ...stabilityData[currentFeature].nanStabilityAnalysis.yBaseline,
          ],
        },
        {
          name: 'Production',
          data: [
            ...stabilityData[currentFeature].nanStabilityAnalysis.yProduction,
          ],
        },
      ],
    });
  }, [stabilityData, currentFeature]);

  return (
    <>
      {nanStabChartData && (
        <Chart
          options={nanStabChartData.options}
          series={nanStabChartData.series}
          type="bar"
          height="400"
        />
      )}
    </>
  );
};

export default NanStabilityChart;
