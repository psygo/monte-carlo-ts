import { onMount } from "solid-js";

import { Box, Stack, Typography } from "@suid/material";

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
function binDistribution(
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

function calcMean(arr: number[]) {
  return arr.reduce((p, v) => p + v) / arr.length;
}

function calcStd(arr: number[]) {
  const n = arr.length;
  const mean = calcMean(arr);
  return Math.sqrt(
    arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

const App = () => {
  /*
   * You must register optional elements before using the chart,
   * otherwise you will have the most primitive UI
   */
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors);
  });

  const [mean1, stdev1] = [0, 1];
  const [mean2, stdev2] = [2, 1];
  const randomData1 = Array.from({ length: 10_000 }, () =>
    gaussianRandom(mean1, stdev2)
  );
  const randomData2 = Array.from({ length: 10_000 }, () =>
    gaussianRandom(mean2, stdev2)
  );

  const randomDataSum = randomData1.map((v, i) => v + randomData2[i]);
  const randomDataSumMean = calcMean(randomDataSum);
  const randomDataStd = calcStd(randomDataSum);

  const { bins: bins1, binned: binned1 } = binDistribution(
    randomData1,
    mean1,
    stdev1,
    100
  );
  const { bins: bins2, binned: binned2 } = binDistribution(
    randomData2,
    mean1,
    stdev2,
    100
  );
  const { bins: binsSum, binned: binnedSum } = binDistribution(
    randomDataSum,
    randomDataSumMean,
    randomDataStd,
    100
  );

  const chartData1: ChartData = {
    labels: bins1,
    datasets: [
      {
        label: "Bins",
        data: binned1,
      },
    ],
  };
  const chartData2: ChartData = {
    labels: bins2,
    datasets: [
      {
        label: "Bins",
        data: binned2,
      },
    ],
  };
  const chartDataSum: ChartData = {
    labels: binsSum,
    datasets: [
      {
        label: "Bins",
        data: binnedSum,
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: false,
    maintainAspectRatio: false,
  };

  return (
    <Stack>
      <Box>
        <Typography>Dist 1</Typography>
        <Bar
          data={chartData1}
          options={chartOptions}
          width={500}
          height={500}
        />
      </Box>

      <Box>
        <Typography>Dist 2</Typography>
        <Bar
          data={chartData2}
          options={chartOptions}
          width={500}
          height={500}
        />
      </Box>

      <Box>
        <Typography>Dist Sum</Typography>
        <Bar
          data={chartDataSum}
          options={chartOptions}
          width={500}
          height={500}
        />
      </Box>
    </Stack>
  );
};
export default App;
