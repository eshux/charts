import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import importance from './data/feature_importance.json';
import stability from './data/feature_stability.json';
import StabilityChart from './components/StabilityChart/StabilityChart';
import NanStabilityChart from './components/NanStabilityChart/NanStabilityChart';
import { ChartData, ImportanceData, StabilityData } from './types/types';

const splitWords = (text: string) => {
  return text.replace(/_/g, ' ');
};

const App = () => {
  const [importanceData, setImportanceData] = useState<ImportanceData>();
  const [stabilityData, setStabilityData] = useState<StabilityData>();
  const [mainChartData, setMainChartData] = useState<ChartData>();
  const [currentFeature, setCurrentFeature] = useState({ name: '', color: '' });
  const [colors, setColors] = useState<string[]>([]);
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

  useEffect(() => {
    if (importanceData && stabilityData) {
      const stabilityNumber: number[] = [];
      const colorArr: string[] = [];

      importanceData.names.forEach((item) => {
        const nanStab = stabilityData[item].nanStabilityAnalysis.stabilityGroup[0];
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

  // Chart Settings
  useEffect(() => {
    if (importanceData && colors[0]) {
      setMainChartData({
        options: {
          chart: {
            id: 'importance-bar',
            events: {
              click(event: { target: { attributes: { val: { value: number; }; }; }; }) {
                if (event.target.attributes.val) {
                  setCurrentFeature({
                    name: importanceData.names[
                      importanceData.importance.indexOf(
                        Number(event.target.attributes.val.value)
                      )
                    ],
                    color: colors[
                      importanceData.importance.indexOf(
                        Number(event.target.attributes.val.value)
                      )
                    ],
                  });
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
  }, [colors, currentFeature, importanceData, width]);

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
        {currentFeature.name && (
          <>
            <div className="row center-xs">
              <div className="col-xs-12">
                <h3>Value distribution</h3>
                <h4 className="heading" style={{ color: currentFeature.color }}>
                  {splitWords(currentFeature.name)}
                </h4>
              </div>
            </div>
            {stabilityData && (
              <div className="row">
                <div className="col-xs-12">
                  <StabilityChart
                    stabilityData={stabilityData}
                    width={width}
                    currentFeature={currentFeature.name}
                  />
                </div>
                <div className="col-md-6 col-xs-12">
                  <NanStabilityChart
                    stabilityData={stabilityData}
                    currentFeature={currentFeature.name}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default App;
