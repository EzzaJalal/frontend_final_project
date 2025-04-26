import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

// Shared color palette used for both charts
const COLORS = ["#4B9CD3", "#28a745", "#FFC107", "#FF5733", "#6f42c1", "#17a2b8", "#fd7e14"];

/* ------------------------------------------
   BAR CHART COMPONENT
--------------------------------------------- */
interface BarChartComponentProps {
  data: { name: string; dataKey: number }[];
  chartTitle: string;
  dataKeyName: string;
}

const BarChartComponent = (props: BarChartComponentProps) => {
  return (
    <div style={{ animation: "fadeSlideIn 1s ease-out" }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        {props.chartTitle}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={props.data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap={40}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 14 }} />
          <YAxis tick={{ fontSize: 14 }} />
          <Tooltip contentStyle={{ borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 14 }} />
          <Bar
            dataKey="dataKey"
            name={props.dataKeyName}
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
            animationDuration={1500}
          >
            {props.data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ------------------------------------------
   DONUT CHART COMPONENT
--------------------------------------------- */
interface DonutChartProps {
  data: { name: string; value: number }[];
  chartTitle: string;
}

const DonutChartComponent = ({ data, chartTitle }: DonutChartProps) => {
  return (
    <div style={{ animation: "fadeSlideIn 1s ease-out" }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{chartTitle}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%" // Center the chart
            cy="50%"
            innerRadius={60} // Adjusted for better proportionality
            outerRadius={100}
            fill="#8884d8"
            label
            isAnimationActive
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8 }} />
          <Legend wrapperStyle={{ fontSize: 14 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export { BarChartComponent, DonutChartComponent };