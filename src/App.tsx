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

/**
 * Uses `mean +- 4*stdev` as the width.
 */
function binGaussianDistribution(
  data: number[],
  mean: number = 0,
  stdev: number = 1,
  numberOfBins: number = 100
) {
  const start = mean - 4 * stdev;
  const end = mean + 4 * stdev;
  const step = Math.abs(start - end) / numberOfBins;

  const bins: Array<number> = Array.from(
    { length: numberOfBins },
    (_: number, idx: number) => start + idx * step
  );

  const binned: Array<number> = Array(numberOfBins).fill(0);

  const dataLength = data.length;
  for (let i = 0; i < dataLength; i++) {
    const datum = data[i];

    // TODO: This isn't really that robust, I don't know if it works around the edges.
    const binIdx = bins.findIndex((v) => v >= datum);

    binned[binIdx]++;
  }

  return { bins, binned };
}

const App = () => {
  /*
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const [mean, stdev] = [0, 1]
  const randomData = Array.from({ length: 10_000 }, () => gaussianRandom(mean, stdev));

  const { bins, binned } = binGaussianDistribution(randomData, mean, stdev, 100);

  const chartData: ChartData = {
    labels: bins,
    datasets: [
      {
        label: "Bins",
        data: binned,
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
