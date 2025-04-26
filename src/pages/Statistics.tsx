import { useEffect, useState } from "react";
import { getTrainingsData } from "../services/TrainingService";
import { Training } from "../types";
import { BarChartComponent, DonutChartComponent } from "../components/ActivityChart";
import _ from "lodash";
import Grid from "@mui/material/Grid";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

//
// RadialProgressChartComponent for goal progress tracking
//
interface RadialProgressChartProps {
  progress: number; // percentage value (0-100)
  goalLabel: string;
}

const RadialProgressChartComponent = ({
  progress,
  goalLabel,
}: RadialProgressChartProps) => {
  // Using one data point for progress
  const data = [{ name: "Progress", value: progress }];

  return (
    <div style={{ animation: "fadeSlideIn 1s ease-out" }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{goalLabel}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            fill="#28a745"
            isAnimationActive={true}
            animationDuration={1500}
          />
          <Tooltip contentStyle={{ borderRadius: 8 }} />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 14 }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

function Statistics() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  const fetchData = async () => {
    try {
      const data = await getTrainingsData();
      console.log(data);
      setTrainings(data || []);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group trainings by activity to compute aggregated metrics
  const groupedByActivity = _.groupBy(trainings, "activity");

  // Prepare average duration (in minutes) per activity for the first bar chart
  const averageDurationsArray = _.map(
    groupedByActivity,
    (trainings: Training[], activity: string) => ({
      name: activity,
      dataKey: _.meanBy(trainings, "duration"),
    })
  );

  // Prepare training count per activity for the second bar chart
  const trainingCountsArray = _.map(
    _.countBy(trainings, "activity"),
    (count, activity) => ({
      name: activity,
      dataKey: count,
    })
  );

  // Prepare donut chart data from training counts
  const donutData = trainingCountsArray.map((item) => ({
    name: item.name,
    value: item.dataKey,
  }));

  // For radial progress, calculate the total training duration vs. a defined goal
  const totalDuration = trainings.reduce(
    (sum, training) => sum + training.duration,
    0
  );
  const goalMinutes = 1000; // Define your goal in minutes
  const progressPercentage =
    totalDuration >= goalMinutes ? 100 : (totalDuration / goalMinutes) * 100;

  return (
    <div>
      <h1 hidden>Statistics</h1>
      {/* Grid Container with 2x2 grid layout */}
      <Grid container spacing={3}>
        {/* First Row */}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <BarChartComponent
            data={averageDurationsArray}
            chartTitle="Average Durations by Activity"
            dataKeyName="Minutes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <BarChartComponent
            data={trainingCountsArray}
            chartTitle="Training Counts by Activity"
            dataKeyName="Count"
          />
        </Grid>
        {/* Second Row */}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <DonutChartComponent
            data={donutData}
            chartTitle="Activity Distribution (Donut Chart)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <RadialProgressChartComponent
            progress={parseFloat(progressPercentage.toFixed(1))}
            goalLabel={`Goal Progress (${totalDuration} / ${goalMinutes} minutes)`}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default Statistics;