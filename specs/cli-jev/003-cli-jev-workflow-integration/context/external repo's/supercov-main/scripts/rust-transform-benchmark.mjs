#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const budget = JSON.parse(
  readFileSync(resolve("benchmarks/rust-transform-budget.json"), "utf8"),
);
const binary = resolve(
  process.env.SUPERCOV_RUST_BINARY ??
    `target/release/supercov${process.platform === "win32" ? ".exe" : ""}`,
);
const cases = Array.from({ length: budget.corpusFiles }, (_, index) => ({
  file: `benchmark/${index}.js`,
  source: `
    export function decision${index}(input, fallback = ${index % 7}) {
      let total = 0;
      try {
        for (const value of input?.values ?? []) {
          if ((value > ${index % 5} && input.enabled) || input.force) total += value;
          else if (value === 0 || fallback > 3) continue;
          else total -= fallback;
        }
      } catch (error) {
        total = error?.code === "EXPECTED" ? fallback : -1;
      }
      return total > 0 && input.valid ? total : fallback;
    }
  `,
}));
const input = JSON.stringify(cases);

function median(values) {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
}

function internalSample() {
  const child = spawnSync(binary, ["__benchmark-js-transform"], {
    input,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 64,
  });
  if (child.error) throw child.error;
  if (child.status !== 0)
    throw new Error(`Rust transform benchmark failed: ${child.stderr.trim()}`);
  const result = JSON.parse(child.stdout);
  if (result.files !== cases.length)
    throw new Error(`Rust benchmark transformed ${result.files}/${cases.length} files`);
  return Number(result.durationNs) / 1_000_000;
}

internalSample();
const internal = [];
for (let index = 0; index < 7; index += 1) {
  internal.push(internalSample());
}
const engineMedian = median(internal);
const engineP95 = Math.max(...internal);
const extrapolatedMonorepoMs =
  engineMedian * (budget.monorepoFiles / budget.corpusFiles);

console.log(
  `[rust-transform] engine median=${engineMedian.toFixed(2)}ms p95=${engineP95.toFixed(2)}ms files=${cases.length}`,
);
console.log(
  `[rust-transform] ${budget.monorepoFiles.toLocaleString("en-US")}-file linear extrapolation=${extrapolatedMonorepoMs.toFixed(0)}ms`,
);

const failures = [];
if (engineMedian > budget.engineMedianMsMax)
  failures.push(
    `engine median ${engineMedian.toFixed(2)}ms > ${budget.engineMedianMsMax}ms`,
  );
if (engineP95 > budget.engineP95MsMax)
  failures.push(`engine p95 ${engineP95.toFixed(2)}ms > ${budget.engineP95MsMax}ms`);
if (extrapolatedMonorepoMs > budget.monorepoExtrapolatedMsMax)
  failures.push(
    `${budget.monorepoFiles}-file extrapolation ${extrapolatedMonorepoMs.toFixed(0)}ms > ${budget.monorepoExtrapolatedMsMax}ms`,
  );
if (failures.length > 0) {
  for (const failure of failures) console.error(`[rust-transform] ${failure}`);
  process.exitCode = 1;
}
