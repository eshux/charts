import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, ImportanceData } from '../../types/types';

type Props = {
  importanceData: ImportanceData;
  colors: string[];
  width: number;
  click: (event: {
    target: { attributes: { val: { value: number } } };
  }) => void;
};

const NanStabilityChart: FC<Props> = ({
  importanceData,
  colors,
  click,
  width,
}) => {
  const [mainChartData, setMainChartData] = useState<ChartData>();

  useEffect(() => {
    if (importanceData && colors[0]) {
      setMainChartData({
        options: {
          chart: {
            id: 'importance-bar',
            events: { click },
          },
          xaxis: {
            categories: [...importanceData.names],
            labels: {
              show: true,
            },
          },
          yaxis: {
            labels: {
              show: true,
              align: 'right',
              trim: false,
              maxWidth: 800,
              minWidth: 0,
            },
          },
          responsive: [
            {
              breakpoint: width,
              options: {
                yaxis: {
                  labels: {
                    show: width > 500,
                    maxWidth: width / 2,
                    style: {
                      fontSize: '8',
                    },
                  },
                },
                xaxis: {
                  labels: {
                    style: {
                      fontSize: '8',
                    },
                  },
                },
              },
            },
          ],
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          colors: [...colors],
        },
        series: [
          {
            name: 'Importance',
            data: [...importanceData.importance],
          },
        ],
      });
    }
  }, [colors, importanceData, width]);

  return (
    <>
      {mainChartData && (
        <Chart
          options={mainChartData.options}
          series={mainChartData.series}
          type="bar"
        />
      )}
    </>
  );
};

export default NanStabilityChart;
