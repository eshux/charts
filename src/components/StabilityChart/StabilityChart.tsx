import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, StabilityData } from '../../types/types';
import './StabilityChart.scss';
import { setFeatureChartConfig } from '../../chartConfigs/featureChartConfig';

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

  const dataPath = stabilityData[currentFeature].stabilityAnalysis;
  const categories = dataPath.xLeftEdge;
  const data1 = dataPath.yBaseline;
  const data2 = dataPath.yProduction;


  useEffect(() => {
    const newConfig = setFeatureChartConfig(
      'stability-bar',
      'Stability data',
      width > 500,
      '8.5',
      categories,
      width,
      data1,
      data2
    );

    setStabChartData(newConfig);
  }, [currentFeature, width, showBar]);

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
