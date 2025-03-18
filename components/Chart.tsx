import React from "react";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";

/**
 * Type for the chart type prop.
 */
export type ChartType = "pie" | "bar" | "line";

/**
 * Base props for all chart types.
 */
interface BaseChartProps {
  data: any;
  width: number;
  height: number;
  chartConfig: any;
  style?: any;
}

/**
 * Custom props for pie charts.
 */
interface PieChartCustomProps extends BaseChartProps {
  type: "pie";
  accessor?: string;
  backgroundColor?: string;
  paddingLeft?: string;
  hasLegend?: boolean;
}

/**
 * Custom props for bar charts.
 */
interface BarChartCustomProps extends BaseChartProps {
  type: "bar";
  yAxisLabel?: string;
  yAxisSuffix?: string;
  fromZero?: boolean;
  withInnerLines?: boolean;
}

/**
 * Custom props for line charts.
 */
interface LineChartCustomProps extends BaseChartProps {
  type: "line";
  fromZero?: boolean;
  bezier?: boolean;
  withInnerLines?: boolean;
}

/**
 * Union type for all chart props.
 */
export type ChartProps =
  | PieChartCustomProps
  | BarChartCustomProps
  | LineChartCustomProps;

/**
 * Chart component that renders a pie, bar, or line chart based on the type prop.
 *
 * @param props - The props for the chart component.
 */
const Chart: React.FC<ChartProps> = (props) => {
  const { type, ...rest } = props;

  // Render the appropriate chart based on the type prop
  switch (type) {
    case "pie": {
      const {
        accessor,
        backgroundColor,
        paddingLeft,
        hasLegend,
        ...otherProps
      } = rest as PieChartCustomProps;
      return (
        <PieChart
          {...otherProps}
          accessor={accessor ?? "population"}
          backgroundColor={backgroundColor ?? "transparent"}
          paddingLeft={paddingLeft ?? "15"}
          hasLegend={hasLegend ?? false}
        />
      );
    }
    case "bar": {
      const {
        yAxisLabel,
        yAxisSuffix,
        fromZero,
        withInnerLines,
        ...otherProps
      } = rest as BarChartCustomProps;
      return (
        <BarChart
          {...otherProps}
          yAxisLabel={yAxisLabel ?? ""}
          yAxisSuffix={yAxisSuffix ?? ""}
          fromZero={fromZero ?? false}
          withInnerLines={withInnerLines ?? true}
        />
      );
    }
    case "line": {
      const { fromZero, bezier, withInnerLines, ...otherProps } =
        rest as LineChartCustomProps;
      return (
        <LineChart
          {...otherProps}
          fromZero={fromZero ?? false}
          bezier={bezier ?? false}
          withInnerLines={withInnerLines ?? true}
        />
      );
    }
    default:
      return null; // Return null if the type is invalid
  }
};

export default Chart;
