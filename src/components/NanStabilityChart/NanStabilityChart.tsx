import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, StabilityData } from '../../types/types';
import { setFeatureChartConfig } from '../../chartConfigs/featureChartConfig';

type Props = {
  stabilityData: StabilityData;
  currentFeature: string;
};

const NanStabilityChart: FC<Props> = ({ stabilityData, currentFeature }) => {
  const [nanStabChartData, setNanStabChartData] = useState<ChartData>();

  const dataPath = stabilityData[currentFeature].nanStabilityAnalysis;
  const categories = dataPath.xLeftEdge;
  const data1 = dataPath.yBaseline;
  const data2 = dataPath.yProduction;

  useEffect(() => {
    const newConfig = setFeatureChartConfig(
      'nanStability-bar',
      'NanStability data',
      true,
      '10',
      categories,
      0,
      data1,
      data2
    );

    setNanStabChartData(newConfig);
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
