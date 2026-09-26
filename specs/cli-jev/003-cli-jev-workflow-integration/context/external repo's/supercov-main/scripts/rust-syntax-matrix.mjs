#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const optionIndex = process.argv.indexOf("--runtime");
const selectedRuntime = optionIndex >= 0 ? process.argv[optionIndex + 1] : "all";
const supportedRuntimes = new Set(["all", "node", "browser", "chromium", "firefox", "webkit"]);
if (!supportedRuntimes.has(selectedRuntime))
  throw new Error(`--runtime must be one of ${[...supportedRuntimes].join(", ")}`);

const executionCases = JSON.parse(
  readFileSync(resolve("contracts/js-instrumenter-v1/execution-cases.json"), "utf8"),
).map((testCase) => ({ ...testCase, kind: "script" }));
const runtimeCases = JSON.parse(
  readFileSync(resolve("contracts/js-instrumenter-v1/runtime-cases.json"), "utf8"),
);
const cases = [...executionCases, ...runtimeCases];

const binary = resolve(
  process.env.SUPERCOV_RUST_BINARY ??
    `target/debug/${process.platform === "win32" ? "supercov.exe" : "supercov"}`,
);
const transformed = spawnSync(binary, ["__instrument-js"], {
  input: JSON.stringify(cases.map(({ file, source }) => ({ file, source }))),
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});
if (transformed.error) throw transformed.error;
if (transformed.status !== 0)
  throw new Error(`Rust syntax-matrix transform failed:\n${transformed.stderr}`);
const candidates = JSON.parse(transformed.stdout);
if (candidates.length !== cases.length)
  throw new Error(`Rust returned ${candidates.length} candidates for ${cases.length} cases`);

// This is a semantics-only collector. Real evidence transport is exercised by
// the ordinary fixture matrix; these helpers preserve the exact operand,
// receiver, spread, default, and inferred-name behavior while discarding hits.
function installRuntime(target) {
  const pendingDefaults = new Map();
  const emptySpread = {
    [Symbol.iterator]() {
      return { next: () => ({ done: true, value: undefined }) };
    },
  };
  target.__supercovRuntime = {
    coverageHit() {},
    mcdcBegin(_id, meta) {
      return { meta, values: Array.from({ length: meta.conditions.length }, () => null) };
    },
    mcdcCondition(frame, index, value) {
      frame.values[index] = Boolean(value);
      return value;
    },
    mcdcEnd(_frame, value) {
      return value;
    },
    registerProbeV2(definition) {
      return {
        ...definition,
        clock: { epoch: 1, fast: true },
        hitEpochs: new Uint32Array(definition.pointIds.length),
        decisionEpochs: definition.decisions.map((meta) =>
          meta.conditions.length <= 6
            ? new Uint32Array(2 * 3 ** meta.conditions.length)
            : new Map(),
        ),
        decisionVectorCounts: definition.decisions.map(
          (_meta, index) => definition.decisionVectorCounts?.[index] ?? 0,
        ),
        decisionObservationEpochs: new Uint32Array(definition.decisions.length),
        decisionObservationCounts: new Uint16Array(definition.decisions.length),
        decisionCompleteEpochs: new Uint32Array(definition.decisions.length),
      };
    },
    coverageHitV2() {},
    renderedValueV2(_file, _index, value) { return value; },
    mcdcEndV2(_file, _index, _encoded, value) {
      return value;
    },
    selectionBegin(shortId, rightId) {
      return { shortId, rightId, rightEvaluated: false };
    },
    selectionRight(frame, value, inferredName) {
      frame.rightEvaluated = true;
      return applyInferredName(value, inferredName);
    },
    selectionEnd(_frame, value) {
      return value;
    },
    parenthesizedAssignmentValue(value, inferredName) {
      let candidate;
      (candidate) = function () {};
      return candidate.name === "candidate"
        ? applyInferredName(value, inferredName)
        : value;
    },
    withRequestPhase(handler) {
      return handler;
    },
    optionalSelect(_shortId, _continuedId, value) {
      return value;
    },
    optionalCallBegin(shortId, continuedId) {
      return { shortId, continuedId, reached: false, continued: false };
    },
    optionalCallReached(frame, value) {
      frame.reached = true;
      return value;
    },
    optionalCallContinued(frame) {
      frame.continued = true;
      return emptySpread;
    },
    optionalCallEnd(_frame, value) {
      return value;
    },
    defaultSelected(defaultId, value, inferredName) {
      pendingDefaults.set(defaultId, (pendingDefaults.get(defaultId) ?? 0) + 1);
      return applyInferredName(value, inferredName);
    },
    defaultEntered(defaultId) {
      const pending = pendingDefaults.get(defaultId) ?? 0;
      if (pending <= 1) pendingDefaults.delete(defaultId);
      else pendingDefaults.set(defaultId, pending - 1);
    },
    tryBegin(successId, catchId) {
      return { successId, catchId, caught: false };
    },
    tryCatch(frame, value) {
      frame.caught = true;
      return value;
    },
    tryEnd() {},
    loopBegin(zeroId, enteredId) {
      return { zeroId, enteredId, entered: false };
    },
    loopEntered(frame) {
      frame.entered = true;
    },
    loopEnd() {},
  };
}

function applyInferredName(value, inferredName) {
  if (inferredName && typeof value === "function" && value.name === "")
    Object.defineProperty(value, "name", { value: inferredName, configurable: true });
  return value;
}

const runtimeExports = [
  "coverageHit",
  "mcdcBegin",
  "mcdcCondition",
  "mcdcEnd",
  "registerProbeV2",
  "mcdcEndV2",
  "coverageHitV2",
  "renderedValueV2",
  "selectionBegin",
  "selectionRight",
  "selectionEnd",
  "parenthesizedAssignmentValue",
  "withRequestPhase",
  "optionalSelect",
  "optionalCallBegin",
  "optionalCallReached",
  "optionalCallContinued",
  "optionalCallEnd",
  "defaultSelected",
  "defaultEntered",
  "tryBegin",
  "tryCatch",
  "tryEnd",
  "loopBegin",
  "loopEntered",
  "loopEnd",
];
const runtimeModule = runtimeExports
  .map(
    (name) =>
      `export const ${name}=(...args)=>globalThis.__supercovRuntime.${name}(...args);`,
  )
  .join("\n");
const runtimeModuleUrl = `data:text/javascript;base64,${Buffer.from(runtimeModule).toString("base64")}`;

function normalize(value, seen = new WeakSet()) {
  if (value === undefined) return { $type: "undefined" };
  if (typeof value === "number") {
    if (Number.isNaN(value)) return { $type: "number", value: "NaN" };
    if (Object.is(value, -0)) return { $type: "number", value: "-0" };
    if (!Number.isFinite(value)) return { $type: "number", value: String(value) };
  }
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return { $type: "circular" };
  seen.add(value);
  if (Array.isArray(value)) return value.map((entry) => normalize(entry, seen));
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, normalize(entry, seen)]),
  );
}

function captureSource(key) {
  return `\n;globalThis[${JSON.stringify(key)}]=(async()=>{try{return {status:'returned',value:globalThis.__matrixNormalize(await run()),effects:globalThis.__matrixNormalize(typeof observe==='function'?observe():[])}}catch(error){return {status:'threw',error:{name:String(error?.name??typeof error),message:String(error?.message??error)},effects:globalThis.__matrixNormalize(typeof observe==='function'?observe():[])}}})();`;
}

function moduleCode(source, key, instrumented) {
  const code = instrumented
    ? source.replaceAll("virtual:supercov-runtime", runtimeModuleUrl)
    : source;
  return `${code}${captureSource(key)}\n//# sourceURL=supercov-matrix-${key}.mjs`;
}

async function execute(target, testCase, source, instrumented, sequence) {
  const key = `__supercovMatrix_${sequence}_${instrumented ? "instrumented" : "original"}`;
  installRuntime(target);
  target.__matrixNormalize = normalize;
  delete target[key];
  if (testCase.kind === "module") {
    const code = moduleCode(source, key, instrumented);
    await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}#${sequence}`);
  } else {
    // The checked-in corpus is trusted test input. Function construction is
    // necessary here to preserve sloppy-script semantics such as `with`.
    // eslint-disable-next-line no-new-func
    new Function(`${source}${captureSource(key)}\n//# sourceURL=supercov-matrix-${key}.js`)();
  }
  const result = await target[key];
  delete target[key];
  delete target.__matrixNormalize;
  delete target.__supercovRuntime;
  return result;
}

async function runNode() {
  for (const [index, testCase] of cases.entries()) {
    const original = await execute(globalThis, testCase, testCase.source, false, index);
    const instrumented = await execute(
      globalThis,
      testCase,
      candidates[index].code,
      true,
      index,
    );
    if (JSON.stringify(instrumented) !== JSON.stringify(original))
      throw new Error(
        `node ${process.version} changed ${testCase.file}\noriginal=${JSON.stringify(original)}\ninstrumented=${JSON.stringify(instrumented)}`,
      );
  }
  console.log(`[rust-syntax-matrix] node ${process.version}: ${cases.length} cases preserve behavior`);
}

const browserTypes = { chromium, firefox, webkit };
async function runBrowser(name) {
  const browser = await browserTypes[name].launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const [index, testCase] of cases.entries()) {
      const pair = await page.evaluate(
        async ({ testCase, candidate, runtimeModuleUrl, index }) => {
          // Re-declare realm-local helpers because functions passed from Node
          // cannot be installed directly into the browser execution realm.
          const normalize = (value, seen = new WeakSet()) => {
            if (value === undefined) return { $type: "undefined" };
            if (typeof value === "number") {
              if (Number.isNaN(value)) return { $type: "number", value: "NaN" };
              if (Object.is(value, -0)) return { $type: "number", value: "-0" };
              if (!Number.isFinite(value)) return { $type: "number", value: String(value) };
            }
            if (value === null || typeof value !== "object") return value;
            if (seen.has(value)) return { $type: "circular" };
            seen.add(value);
            if (Array.isArray(value)) return value.map((entry) => normalize(entry, seen));
            return Object.fromEntries(
              Object.entries(value).map(([key, entry]) => [key, normalize(entry, seen)]),
            );
          };
          const applyInferredName = (value, inferredName) => {
            if (inferredName && typeof value === "function" && value.name === "")
              Object.defineProperty(value, "name", { value: inferredName, configurable: true });
            return value;
          };
          const install = () => {
            const pendingDefaults = new Map();
            const emptySpread = { [Symbol.iterator]: () => ({ next: () => ({ done: true }) }) };
            globalThis.__supercovRuntime = {
              coverageHit() {},
              mcdcBegin(_id, meta) { return { meta, values: Array(meta.conditions.length).fill(null) }; },
              mcdcCondition(frame, conditionIndex, value) { frame.values[conditionIndex] = Boolean(value); return value; },
              mcdcEnd(_frame, value) { return value; },
              registerProbeV2(definition) { return { ...definition, clock: { epoch: 1, fast: true }, hitEpochs: new Uint32Array(definition.pointIds.length), decisionEpochs: definition.decisions.map((meta) => meta.conditions.length <= 6 ? new Uint32Array(2 * 3 ** meta.conditions.length) : new Map()), decisionVectorCounts: definition.decisions.map((_meta, definitionIndex) => definition.decisionVectorCounts?.[definitionIndex] ?? 0), decisionObservationEpochs: new Uint32Array(definition.decisions.length), decisionObservationCounts: new Uint16Array(definition.decisions.length), decisionCompleteEpochs: new Uint32Array(definition.decisions.length) }; },
              coverageHitV2() {},
              renderedValueV2(_file, _index, value) { return value; },
              mcdcEndV2(_file, _decisionIndex, _encoded, value) { return value; },
              selectionBegin(shortId, rightId) { return { shortId, rightId, rightEvaluated: false }; },
              selectionRight(frame, value, inferredName) { frame.rightEvaluated = true; return applyInferredName(value, inferredName); },
              selectionEnd(_frame, value) { return value; },
              parenthesizedAssignmentValue(value, inferredName) { let hostCandidate; (hostCandidate) = function () {}; return hostCandidate.name === "hostCandidate" ? applyInferredName(value, inferredName) : value; },
              withRequestPhase(handler) { return handler; },
              optionalSelect(_shortId, _continuedId, value) { return value; },
              optionalCallBegin(shortId, continuedId) { return { shortId, continuedId, reached: false, continued: false }; },
              optionalCallReached(frame, value) { frame.reached = true; return value; },
              optionalCallContinued(frame) { frame.continued = true; return emptySpread; },
              optionalCallEnd(_frame, value) { return value; },
              defaultSelected(defaultId, value, inferredName) { pendingDefaults.set(defaultId, (pendingDefaults.get(defaultId) ?? 0) + 1); return applyInferredName(value, inferredName); },
              defaultEntered(defaultId) { const pending = pendingDefaults.get(defaultId) ?? 0; if (pending <= 1) pendingDefaults.delete(defaultId); else pendingDefaults.set(defaultId, pending - 1); },
              tryBegin(successId, catchId) { return { successId, catchId, caught: false }; },
              tryCatch(frame, value) { frame.caught = true; return value; },
              tryEnd() {},
              loopBegin(zeroId, enteredId) { return { zeroId, enteredId, entered: false }; },
              loopEntered(frame) { frame.entered = true; },
              loopEnd() {},
            };
          };
          const capture = (key) => `\n;globalThis[${JSON.stringify(key)}]=(async()=>{try{return {status:'returned',value:globalThis.__matrixNormalize(await run()),effects:globalThis.__matrixNormalize(typeof observe==='function'?observe():[])}}catch(error){return {status:'threw',error:{name:String(error?.name??typeof error),message:String(error?.message??error)},effects:globalThis.__matrixNormalize(typeof observe==='function'?observe():[])}}})();`;
          const one = async (source, instrumented, suffix) => {
            const key = `__matrix_${index}_${suffix}`;
            install();
            globalThis.__matrixNormalize = normalize;
            delete globalThis[key];
            if (testCase.kind === "module") {
              const body = `${instrumented ? source.replaceAll("virtual:supercov-runtime", runtimeModuleUrl) : source}${capture(key)}\n//# sourceURL=supercov-browser-${key}.mjs`;
              await import(`data:text/javascript;base64,${btoa(unescape(encodeURIComponent(body)))}#${key}`);
            } else {
              new Function(`${source}${capture(key)}\n//# sourceURL=supercov-browser-${key}.js`)();
            }
            const result = await globalThis[key];
            delete globalThis[key];
            delete globalThis.__matrixNormalize;
            delete globalThis.__supercovRuntime;
            return result;
          };
          return {
            original: await one(testCase.source, false, "original"),
            instrumented: await one(candidate.code, true, "instrumented"),
          };
        },
        { testCase, candidate: candidates[index], runtimeModuleUrl, index },
      );
      if (JSON.stringify(pair.instrumented) !== JSON.stringify(pair.original))
        throw new Error(
          `${name} changed ${testCase.file}\noriginal=${JSON.stringify(pair.original)}\ninstrumented=${JSON.stringify(pair.instrumented)}`,
        );
    }
  } finally {
    await browser.close();
  }
  console.log(`[rust-syntax-matrix] ${name}: ${cases.length} cases preserve behavior`);
}

if (selectedRuntime === "all" || selectedRuntime === "node") await runNode();
const requestedBrowsers =
  selectedRuntime === "all" || selectedRuntime === "browser"
    ? Object.keys(browserTypes)
    : selectedRuntime in browserTypes
      ? [selectedRuntime]
      : [];
for (const browser of requestedBrowsers) await runBrowser(browser);
