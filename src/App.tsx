import { onMount } from "solid-js";

import {
  Chart,
  ChartData,
  ChartOptions,
  Colors,
  Legend,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "solid-chartjs";

/*
 * Standard Normal variate using Box-Muller transform.
 *
 * Reference: [JavaScript Math.random Normal distribution (Gaussian bell curve)? (Box-Muller Transform)](https://stackoverflow.com/a/36481059/4756173)
 */
function gaussianRandom(mean: number = 0, stdev: number = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return z * stdev + mean;
}

const App = () => {
  /*
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const idx = Array.from({ length: 1000 }, (_: number, idx: number) => idx);
  const randomData = Array.from({ length: 1000 }, () => gaussianRandom());

  const chartData: ChartData = {
    labels: idx,
    datasets: [
      {
        label: "Bins",
        data: randomData,
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Bar data={chartData} options={chartOptions} width={500} height={500} />
  );
};
export default App;
