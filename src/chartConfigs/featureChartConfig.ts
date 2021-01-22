import { ChartData } from '../types/types';

export const setFeatureChartConfig = (
  id: string,
  title: string,
  showLabels: boolean,
  xFontSize: string,
  categoryArr: number[],
  respBreak: number,
  data1: number[],
  data2: number[]
): ChartData => {
  return {
    options: {
      chart: {
        type: 'bar',
        id,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
          },
        },
      },
      title: {
        text: title,
        margin: 20,
      },
      stroke: {
        width: 2,
      },
      xaxis: {
        categories: categoryArr,
        labels: {
          show: true,
          formatter(val: string) {
            return Number(val).toFixed(3);
          },
          rotate: -45,
          offsetY: 2,
          style: {
            fontSize: xFontSize,
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
          breakpoint: respBreak,
          options: {
            yaxis: {
              labels: {
                show: showLabels,
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
          columnWidth: '100%',
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
        data: data1,
      },
      {
        name: 'Production',
        data: data2,
      },
    ],
  };
};
