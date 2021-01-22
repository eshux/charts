import { ChartData } from '../types/types';

export const setMainChartConfig = (
  click: (event: { target: { attributes: { val: { value: number } } } })=> void,
  showLabels: boolean,
  colors: string[],
  categoryArr: string[],
  respBreak: number,
  maxWidth: number,
  data: number[],
): ChartData => {
  return {
    options: {
      chart: {
        id: 'importance-bar',
        events: { click },
      },
      xaxis: {
        categories: categoryArr,
        labels: {
          show: true,
          formatter(val: string) {
            return Number(val).toFixed(1);
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          align: 'right',
          trim: false,
          maxWidth: 800,
          minWidth: 0,
          style: {
            fontSize: '10',
          },
        },
      },
      responsive: [
        {
          breakpoint: respBreak,
          options: {
            yaxis: {
              labels: {
                show: showLabels,
                maxWidth,
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
      title: {
        text: '',
        margin: 0,
      },
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
      colors,
    },
    series: [
      {
        name: 'Importance',
        data,
      },
    ],
  };
};
