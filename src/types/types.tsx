export type ChartData = {
  options: {
    chart: {
      id: string;
      type?: string;
      events?: (event: Object) => void;
      toolbar?: {
        show?: boolean;
        tools?: {
          zoom?: boolean;
        };
      };
    };
    xaxis: {
      categories: string[] | number[];
      labels?: {
        show?: boolean;
        rotate?: number;
        offsetX?: number;
        offsetY?: number;
        trim?: boolean;
        formatter?: (val: string) => string;
        style?: {
          fontSize?: string;
        };
      };
    };
    yaxis?: {
      labels?: {
        show?: boolean;
        align?: string;
        rotate?: number;
        offsetX?: number;
        offsetY?: number;
        minWidth?: number;
        maxWidth?: number;
        trim?: boolean;
        formatter?: (val: string) => string;
        style?: {
          fontSize?: string | number;
        };
      };
      forceNiceScale?: Boolean;
    };
    stroke?: {
      width?: number;
    };
    plotOptions?: {
      bar?: {
        horizontal?: boolean;
        distributed?: boolean;
        columnWidth?: string;
        barHeight?: string;
      };
    };
    responsive?: {
      breakpoint: number;
      options?: {
        xaxis?: {
          labels?: {
            style?: {
              fontSize?: string | number;
            };
          };
        };
        yaxis?: {
          labels?: {
            maxWidth?: number;
            style?: {
              fontSize?: string | number;
            };
          };
        };
        plotOptions?: {
          bar?: {
            horizontal?: boolean;
          };
        };
      };
    }[];
    tooltip?: {
      enabled?: boolean;
      shared?: boolean;
      followCursor?: boolean;
    };
    dataLabels?: {
      enabled?: boolean;
      distributed?: boolean;
    };
    title?: {
      text?: string;
      margin?: number;
    };
    colors?: string[];
    legend?: {
      show: boolean;
    };
  };
  series: {
    name?: string;
    data: number[];
  }[];
};

export type ImportanceData = {
  importance: number[];
  names: string[];
};

export type StabilityData = {
  [key: string]: {
    nanStabilityAnalysis: {
      binWidth: number[];
      stabilityGroup: number[];
      xLeftEdge: number[];
      yBaseline: number[];
      yProduction: number[];
    };
    stabilityAnalysis: {
      binWidth: number[];
      stabilityGroup: number[];
      xLeftEdge: number[];
      yBaseline: number[];
      yProduction: number[];
    };
  };
};
