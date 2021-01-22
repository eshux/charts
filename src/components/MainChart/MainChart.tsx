import React, { FC, useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { ChartData, ImportanceData } from '../../types/types';
import { setMainChartConfig } from '../../chartConfigs/mainChartConfig';

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
    const newConfig = setMainChartConfig(
      click,
      width > 500,
      colors,
      importanceData.names,
      width,
      width / 2,
      importanceData.importance,
    );

    setMainChartData(newConfig);
  }, [width]);

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
