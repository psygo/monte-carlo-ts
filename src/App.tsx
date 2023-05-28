import { Component } from "solid-js";

/*
 * Standard Normal variate using Box-Muller transform.
 *
 * Reference: [JavaScript Math.random Normal distribution (Gaussian bell curve)?](https://stackoverflow.com/a/36481059/4756173)
 */
function gaussianRandom(mean: number = 0, stdev: number = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return z * stdev + mean;
}

const App: Component = () => {
  const a = Array.from({ length: 1000 }, () => gaussianRandom());

  return <h1>Hello World</h1>;
};
export default App;
