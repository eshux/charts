import React, { useEffect, useState } from 'react';
import importance from './data/feature_importance.json';
import stability from './data/feature_stability.json';
import StabilityChart from './components/StabilityChart/StabilityChart';
import NanStabilityChart from './components/NanStabilityChart/NanStabilityChart';
import MainChart from './components/MainChart/MainChart';
import { ImportanceData, StabilityData } from './types/types';

const splitWords = (text: string) => {
  return text.replace(/_/g, ' ');
};

const App = () => {
  const [importanceData, setImportanceData] = useState<ImportanceData>();
  const [stabilityData, setStabilityData] = useState<StabilityData>();
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

  // Getting highest stability number and setting colors accordingly
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

  // Selecting a feature
  const click = (event: {
    target: { attributes: { val: { value: number } } };
  }) => {
    if (importanceData) {
      if (event.target.attributes.val) {
        setCurrentFeature({
          name:
            importanceData.names[
              importanceData.importance.indexOf(
                Number(event.target.attributes.val.value)
              )
            ],
          color:
            colors[
              importanceData.importance.indexOf(
                Number(event.target.attributes.val.value)
              )
            ],
        });
      }
    }
  };

  if (!importanceData && !stabilityData) {
    return <h1>loading...</h1>;
  }

  return (
    <section>
      <div className="container container-fluid">
        <div className="row">
          <div className="col-xs-12">
            {importanceData && (
              <MainChart
                click={click}
                width={width}
                colors={colors}
                importanceData={importanceData}
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
