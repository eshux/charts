import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import importance from './data/feature_importance.json';
import stability from './data/feature_stability.json';
import './App.scss';

import { ChartData, ImportanceData, StabilityData } from './types/types';

const splitWords = (text: string) => {
  return text.replace(/_/g, ' ');
};

const App = () => {
  const [importanceData, setImportanceData] = useState<ImportanceData>();
  const [stabilityData, setStabilityData] = useState<StabilityData>();
  const [mainChartData, setMainChartData] = useState<ChartData>();
  const [nanStabChartData, setNanStabChartData] = useState<ChartData>();
  const [stabChartData, setStabChartData] = useState<ChartData>();
  const [colors, setColors] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentFeatureColor, setCurrentFeatureColor] = useState('');
  const [showBar, setShowBar] = useState(false);
  const [width, setWidth] = useState(1200);


  useEffect(() => {
    setImportanceData(importance.data.featureImportance.metrics);
    setStabilityData(stability.data.productionModelMetrics.parameterStability);

    if (window.innerWidth <= 500) {
      setWidth(500);
    } else if (window.innerWidth <= 660) {
      setWidth(660);
    } else if (window.innerWidth <= 1023) {
      setWidth(1023);
    } 
  }, []);

  // get the highest stability numbers from feature_stability
  // set colors accordingly
  useEffect(() => {
    if (importanceData && stabilityData) {
      const stabilityNumber: number[] = [];
      const colorArr: string[] = [];

      importanceData.names.forEach((item) => {
        const nanStab =
          stabilityData[item].nanStabilityAnalysis.stabilityGroup[0];
        const stab = stabilityData[item].stabilityAnalysis.stabilityGroup[0];

        if (nanStab > stab) {
          stabilityNumber.push(nanStab);
        } else {
          stabilityNumber.push(stab);
        }
      });

      stabilityNumber.forEach((item) => {
        switch (item) {
          case 1:
            colorArr.push('#73C200');
            break;
          case 2:
            colorArr.push('#F09C00');
            break;
          default:
            colorArr.push('#D63700');
            break;
        }
      });

      setColors(colorArr);
    }
  }, [importanceData, stabilityData]);

  // Main Chart Data
  useEffect(() => {
    if (importanceData && colors[0]) {
      setMainChartData({
        options: {
          chart: {
            id: 'importance-bar',
            events: {
              // @ts-ignore
              click(event) {
                if (event.target.attributes.val) {
                  setCurrentFeature(
                    importanceData.names[
                      importanceData.importance.indexOf(
                        Number(event.target.attributes.val.value)
                      )
                    ]
                  );
                  setCurrentFeatureColor(
                    colors[
                      importanceData.importance.indexOf(
                        Number(event.target.attributes.val.value)
                      )
                    ]
                  );
                }
              },
            },
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
                    show: (width > 500),
                    maxWidth: width/2,
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
  }, [colors, currentFeature, importanceData, width]);

  // nanStability Chart Data
  useEffect(() => {
    if (stabilityData && currentFeature) {
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

              columnWidth: `${
                100 / // @ts-ignore
                stabilityData[currentFeature].nanStabilityAnalysis.binWidth
              }%`,
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
    }
  }, [stabilityData, currentFeature]);

  // Stability Chart Data
  useEffect(() => {
    if (stabilityData && currentFeature) {
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
                    show: (width > 500),
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
            data: [
              ...stabilityData[currentFeature].stabilityAnalysis.yBaseline,
            ],
          },
          {
            name: 'Production',
            data: [
              ...stabilityData[currentFeature].stabilityAnalysis.yProduction,
            ],
          },
        ],
      });
    }
  }, [stabilityData, currentFeature, showBar]);

  if (!importanceData && !stabilityData) {
    return <h1>loading...</h1>;
  }

  return (
    <section>
      <div className="container container-fluid">
        <div className="row">
          <div className="col-xs-12">
            {mainChartData && (
              <Chart
                options={mainChartData.options}
                series={mainChartData.series}
                type="bar"
              />
            )}
          </div>
        </div>
        {stabChartData && nanStabChartData && (
          <>
            <div className="row center-xs">
              <div className="col-xs-12">
                <h3>Value distribution</h3>
                <h4 className="heading" style={{ color: currentFeatureColor }}>
                  {splitWords(currentFeature)}
                </h4>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <button
                  type="button"
                  className="toggleButton"
                  onClick={() => setShowBar(!showBar)}
                >
                  {showBar ? 'Switch to lines' : 'Switch to bars'}
                </button>
                <Chart
                  options={stabChartData.options}
                  series={stabChartData.series}
                  type={!showBar ? 'line' : 'bar'}
                  height="500"
                />
              </div>
              <div className="col-md-6 col-xs-12">
                <Chart
                  options={nanStabChartData.options}
                  series={nanStabChartData.series}
                  type="bar"
                  height="400"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default App;
