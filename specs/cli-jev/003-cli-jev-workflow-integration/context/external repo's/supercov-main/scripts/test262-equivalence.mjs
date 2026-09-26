#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, relative, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { parse as parseYaml } from "yaml";

function option(name, fallback) {
  const inline = process.argv.slice(2).find((value) => value.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

if (option("--engine", "rust") !== "rust")
  throw new Error("Rust is Supercov's only engine; --engine accepts only rust");
const supercovBinary = resolve(
  option(
    "--rust-binary",
    process.env.SUPERCOV_RUST_BINARY ??
      `target/release/supercov${process.platform === "win32" ? ".exe" : ""}`,
  ),
);

function instrumentSources(cases) {
  const transformed = spawnSync(supercovBinary, ["__instrument-js"], {
    input: JSON.stringify(cases),
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
  });
  if (transformed.error) throw transformed.error;
  if (transformed.status !== 0)
    throw new Error(`Rust instrumenter failed: ${transformed.stderr.trim()}`);
  return JSON.parse(transformed.stdout);
}

const test262Root = resolve(
  option("--test262", process.env.TEST262_DIR ?? ".cache/test262"),
);
const shardText = option("--shard", "1/1");
const shardMatch = /^(\d+)\/(\d+)$/.exec(shardText);
if (!shardMatch) throw new Error("--shard must have the form INDEX/TOTAL");
const shardIndex = Number(shardMatch[1]);
const shardTotal = Number(shardMatch[2]);
if (shardIndex < 1 || shardIndex > shardTotal)
  throw new Error("--shard index must be between 1 and the total");
const limitText = option("--limit", "");
const limit = limitText ? Number(limitText) : undefined;
if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1))
  throw new Error("--limit must be a positive integer");
const keepTemporary = process.argv.includes("--keep-temp");
const pathPattern = option("--pattern", "");

if (!existsSync(resolve(test262Root, "test")) || !existsSync(resolve(test262Root, "harness"))) {
  throw new Error(
    `Test262 corpus not found at ${test262Root}. Clone tc39/test262 there, set TEST262_DIR, or pass --test262 <path>.`,
  );
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() && entry.name.endsWith(".js") ? [path] : [];
  });
}

function metadata(source) {
  const match = /\/\*---([\s\S]*?)---\*\//.exec(source);
  if (!match) return {};
  return parseYaml(match[1].replace(/\r\n?/g, "\n")) ?? {};
}

const sourceReflectionTests = new Map([
  [
    "built-ins/RegExp/prototype/exec/S15.10.6.2_A1_T9.js",
    "coerces a Function to its implementation-defined source string and matches that source with a RegExp",
  ],
  [
    "staging/sm/async-functions/toString.js",
    "asserts exact Function.prototype.toString source text",
  ],
  [
    "staging/sm/generators/runtime.mjs",
    "asserts exact generator Function.prototype.toString source text",
  ],
]);

function exclusionReason(path, source) {
  if (path.includes("_FIXTURE")) return "fixture support file";
  const relativePath = relative(resolve(test262Root, "test"), path).replaceAll(
    "\\",
    "/",
  );
  // Supercov instruments Vite application modules, where Annex B's sloppy
  // block-level function extensions do not apply. Source reflection is an
  // inherent exception for every source-to-source coverage transformer:
  // Function#toString observes the transformed source by definition.
  if (relativePath.startsWith("annexB/"))
    return "Annex B sloppy-script extension outside Supercov's application-module target";
  if (relativePath.startsWith("built-ins/Function/prototype/toString/"))
    return "asserts Function.prototype.toString source text";
  if (sourceReflectionTests.has(relativePath))
    return sourceReflectionTests.get(relativePath);
  const data = metadata(source);
  const flags = new Set(Array.isArray(data.flags) ? data.flags : []);
  if (flags.has("module")) return "module scenario unsupported by the selected Test262 host harness";
  if (flags.has("async")) return "asynchronous Test262 harness scenario";
  if (flags.has("raw")) return "raw Test262 harness scenario";
  if (data.negative?.phase === "parse" || data.negative?.phase === "resolution")
    return "parse/resolution-negative test does not execute source";
  return undefined;
}

function runtimePrelude(transformed) {
  const importMatch = transformed.match(
    /import\s*\{([\s\S]*?)\}\s*from\s*["']virtual:supercov-runtime["'];?/,
  );
  const globalMatches = [
    ...transformed.matchAll(
      /([\w$]+)\s*=\s*globalThis\.__supercovRuntime\.([\w$]+)/g,
    ),
  ];
  if (!importMatch && globalMatches.length === 0)
    return { prelude: "", code: transformed };
  const functions = {
    mcdcBegin: "function(){return {};}",
    mcdcCondition: "function(frame,index,value){return value;}",
    mcdcEnd: "function(frame,value){return value;}",
    coverageHit: "function(){}",
    registerProbeV2: "function(definition){return Object.assign(definition,{clock:{epoch:1,fast:true},hitEpochs:new Uint32Array(definition.pointIds.length),decisionEpochs:definition.decisions.map(function(meta){return new Uint32Array(2*3**Math.min(meta.conditions.length,6));})});}",
    coverageHitV2: "function(){}",
    mcdcEndV2: "function(file,index,encoded,value){return value;}",
    selectionBegin: "function(){return {};}",
    selectionRight: "function(frame,value,name){if(name&&typeof value==='function'&&value.name==='')Object.defineProperty(value,'name',{value:name,configurable:true});return value;}",
    selectionEnd: "function(frame,value){return value;}",
    parenthesizedAssignmentValue: "function(value,name){let candidate;(candidate)=function(){};if(candidate.name==='candidate'&&name&&typeof value==='function'&&value.name==='')Object.defineProperty(value,'name',{value:name,configurable:true});return value;}",
    optionalSelect: "function(shortId,continuedId,value){return value;}",
    optionalCallBegin: "function(shortId,continuedId){return {shortId:shortId,continuedId:continuedId,reached:false,continued:false};}",
    optionalCallReached: "function(frame,value){frame.reached=true;return value;}",
    optionalCallContinued: "function(frame){frame.continued=true;return {[Symbol.iterator]:function(){return {next:function(){return {done:true};}};}};}",
    optionalCallEnd: "function(frame,value){return value;}",
    defaultSelected: "function(id,value,name){if(name&&typeof value==='function'&&value.name==='')Object.defineProperty(value,'name',{value:name,configurable:true});return value;}",
    defaultEntered: "function(){}",
    tryBegin: "function(){return {};}",
    tryCatch: "function(frame,value){return value;}",
    tryEnd: "function(){}",
    loopBegin: "function(){return {};}",
    loopEntered: "function(){}",
    loopEnd: "function(){}",
    withRequestPhase: "function(handler){return handler;}",
  };
  if (!importMatch) {
    const implementations = globalMatches.map(([, , imported]) => {
      const implementation = functions[imported];
      if (!implementation) throw new Error(`unknown runtime helper ${imported}`);
      return `${imported}:${implementation}`;
    });
    const bindingIndex = globalMatches[0].index ?? 0;
    const index = transformed.lastIndexOf("const ", bindingIndex);
    if (index < 0)
      throw new Error("script runtime binding declaration was not found");
    return {
      prelude: "",
      code: `${transformed.slice(0, index)}globalThis.__supercovRuntime={${implementations.join(",")}};\n${transformed.slice(index)}`,
    };
  }
  const aliases = Object.fromEntries(
    [...importMatch[1].matchAll(/([\w$]+)\s+as\s+([\w$]+)/g)].map(
      ([, imported, local]) => [imported, local],
    ),
  );
  const declarations = Object.entries(aliases).map(([imported, local]) => {
    const implementation = functions[imported];
    if (!implementation) throw new Error(`unknown runtime helper ${imported}`);
    // Module imports are lexical bindings and never create global object
    // properties. `let` is the closest script-host equivalent for Test262.
    return `let ${local}=${implementation};`;
  });
  // Replace the import in place. Instrumentation emits it after directive prologues, and
  // prepending the bindings would turn `"use strict"` into an ordinary string
  // expression and invalidate the equivalence test itself.
  const index = importMatch.index ?? 0;
  return {
    prelude: "",
    code: `${transformed.slice(0, index)}${declarations.join("")}\n${transformed.slice(index + importMatch[0].length)}`,
  };
}

function runHarness(input) {
  const binary = resolve(temporaryHarnessRunnerRoot, "bin/run.js");
  const machineResultPath = resolve(
    temporary,
    `harness-results-${++harnessRunSequence}.jsonl`,
  );
  const result = spawnSync(
    process.execPath,
    [
      binary,
      `--test262-dir=${test262Root}`,
      `--includes-dir=${temporaryHarnessRoot}`,
      "--reporter=simple",
      `--threads=${Math.max(1, Number(process.env.TEST262_THREADS ?? 4))}`,
      input,
    ],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 256,
      env: {
        ...process.env,
        SUPERCOV_TEST262_RESULTS: machineResultPath,
        NODE_PATH: [resolve("node_modules"), process.env.NODE_PATH]
          .filter(Boolean)
          .join(delimiter),
      },
    },
  );
  if (result.error) throw result.error;
  if (!existsSync(machineResultPath)) {
    throw new Error(
      `Test262 harness failed (${result.status ?? "signal"}):\n${result.stderr}\n${result.stdout}`,
    );
  }
  const machineRecords = readFileSync(machineResultPath, "utf8")
    .trimEnd()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const completion = machineRecords.at(-1);
  const records = machineRecords.slice(0, -1);
  const reportedTotal = completion?.end === true ? completion.total : undefined;
  if (
    result.status !== 0 ||
    reportedTotal === undefined ||
    reportedTotal !== records.length ||
    records.some(
      (record) =>
        typeof record.file !== "string" || typeof record.pass !== "boolean",
    )
  ) {
    throw new Error(
      `Test262 harness ended before publishing a complete result set ` +
        `(status=${result.status ?? "signal"}, signal=${result.signal ?? "none"}, ` +
        `records=${records.length}, reported=${reportedTotal ?? "missing"}):\n` +
        `${result.stderr}\n${result.stdout.slice(-8_192)}`,
    );
  }
  const failures = new Map();
  for (const record of records.filter((entry) => !entry.pass)) {
    const key = resultKey(record);
    const messages = failures.get(key) ?? [];
    messages.push(`${record.scenario ?? "unknown scenario"}: ${record.message}`);
    failures.set(key, messages);
  }
  return { records, failures };
}

function resultKey(record) {
  const normalized = String(record.file).replaceAll("\\", "/");
  for (const marker of ["/original/test/", "/instrumented/test/"]) {
    const index = normalized.indexOf(marker);
    if (index >= 0) return normalized.slice(index + marker.length);
  }
  return normalized;
}

const corpusRoot = resolve(test262Root, "test");
let candidates = walk(corpusRoot)
  .sort()
  .filter((path) => !pathPattern || relative(corpusRoot, path).includes(pathPattern))
  .filter((_, index) => index % shardTotal === shardIndex - 1)
  .map((path) => ({ path, source: readFileSync(path, "utf8") }));
const exclusions = candidates
  .map(({ path, source }) => ({
    file: relative(corpusRoot, path).replaceAll("\\", "/"),
    reason: exclusionReason(path, source),
  }))
  .filter((entry) => entry.reason);
let selected = candidates.filter(
  ({ path, source }) => !exclusionReason(path, source),
);
if (limit !== undefined) selected = selected.slice(0, limit);
if (selected.length === 0) throw new Error("No eligible Test262 tests were selected");

const temporary = mkdtempSync(resolve(tmpdir(), "supercov-test262-"));
const originalRoot = resolve(temporary, "original/test");
const instrumentedRoot = resolve(temporary, "instrumented/test");
const temporaryHarnessRoot = resolve(temporary, "harness");
const temporaryHarnessRunnerRoot = resolve(temporary, "test262-harness");
let harnessRunSequence = 0;

try {
  cpSync(resolve("node_modules/test262-harness"), temporaryHarnessRunnerRoot, {
    recursive: true,
  });
  const agentPoolPath = resolve(temporaryHarnessRunnerRoot, "lib/agent-pool.js");
  const agentPoolSource = readFileSync(agentPoolPath, "utf8");
  const redundantCompile = "      test.compiled = agent.compile(test.contents);";
  if (!agentPoolSource.includes(redundantCompile))
    throw new Error("Installed Test262 harness no longer matches the validated runner patch");
  writeFileSync(
    agentPoolPath,
    agentPoolSource.replace(
      redundantCompile,
      "      // Supercov: skip reporter-only recompilation after execution.",
    ),
  );
  const reporterPath = resolve(
    temporaryHarnessRunnerRoot,
    "lib/reporters/simple.js",
  );
  const reporterSource = readFileSync(reporterPath, "utf8");
  const reporterPatches = [
    [
      "const saveCompiledTest = require('../saveCompiledTest');",
      "const saveCompiledTest = require('../saveCompiledTest');\n" +
        "const fs = require('fs');\n" +
        "const machineResultPath = process.env.SUPERCOV_TEST262_RESULTS;",
    ],
    [
      "  let lastPassed = true;",
      "  let lastPassed = true;\n  const machineResults = [];",
    ],
    [
      "    passed++;\n\n    clearPassed();",
      "    passed++;\n" +
        "    machineResults.push({ pass: true, file: test.file, scenario: test.scenario });\n\n" +
        "    clearPassed();",
    ],
    [
      "    failed++;\n    clearPassed();",
      "    failed++;\n" +
        "    machineResults.push({ pass: false, file: test.file, scenario: test.scenario, message: String(test.result && test.result.message) });\n" +
        "    clearPassed();",
    ],
    [
      "  results.on('end', function () {\n    clearPassed();",
      "  results.on('end', function () {\n" +
        "    if (machineResultPath) {\n" +
        "      const records = machineResults.concat([{ end: true, total: passed + failed }]);\n" +
        "      fs.writeFileSync(machineResultPath, records.map(JSON.stringify).join('\\n') + '\\n');\n" +
        "    }\n" +
        "    clearPassed();",
    ],
  ];
  let patchedReporterSource = reporterSource;
  for (const [needle, replacement] of reporterPatches) {
    if (!patchedReporterSource.includes(needle))
      throw new Error(
        "Installed Test262 simple reporter no longer matches the validated machine-channel patch",
      );
    patchedReporterSource = patchedReporterSource.replace(needle, replacement);
  }
  writeFileSync(reporterPath, patchedReporterSource);
  const sourceHarnessRoot = resolve(test262Root, "harness");
  for (const source of walk(sourceHarnessRoot)) {
    const destination = resolve(temporaryHarnessRoot, relative(sourceHarnessRoot, source));
    mkdirSync(dirname(destination), { recursive: true });
    if (relative(sourceHarnessRoot, source) === "assert.js") {
      // eshost's host-runtime insertion regex has pathological backtracking on
      // long comment/directive prologues. This semantics-free statement ends
      // the prologue immediately after Test262's optional strict directive.
      writeFileSync(destination, `0;\n${readFileSync(source, "utf8")}`);
    } else copyFileSync(source, destination);
  }
  for (const test of selected) {
    const destination = resolve(originalRoot, relative(corpusRoot, test.path));
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, test.source);
  }

  const baselineStarted = performance.now();
  const originalRun = runHarness(resolve(originalRoot, "**/*.js"));
  const originalResults = originalRun.records;
  const baselineDurationMs = performance.now() - baselineStarted;
  const baselinePasses = new Map();
  for (const record of originalResults.filter((item) => item.pass)) {
    const key = resultKey(record);
    baselinePasses.set(key, (baselinePasses.get(key) ?? 0) + 1);
  }
  const baselineFiles = new Set(baselinePasses.keys());
  const transformationFailures = [];
  const transformationFailureFiles = new Set();

  const baselineTests = selected.filter((test) =>
    baselineFiles.has(relative(corpusRoot, test.path).replaceAll("\\", "/")),
  );
  const writeTransformed = (test, transformed) => {
    const relativePath = relative(corpusRoot, test.path).replaceAll("\\", "/");
    const runtime = runtimePrelude(transformed);
    const destination = resolve(instrumentedRoot, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    const copyright =
      test.source
        .split(/\r|\n|\u2028|\u2029/)
        .find((line) => line.includes("Copyright")) ??
      "// Copyright Supercov Test262 equivalence run";
    // A transformer may render a legacy fixture onto one very long
    // line. test262-stream's historical copyright regex has nested greedy
    // quantifiers, so retain the original short copyright line up front.
    writeFileSync(
      destination,
      `${copyright}\n${runtime.prelude}${runtime.code}`,
    );
  };
  const recordFailure = (test, error) => {
    const relativePath = relative(corpusRoot, test.path).replaceAll("\\", "/");
    transformationFailureFiles.add(relativePath);
    transformationFailures.push({
      file: relativePath,
      error: error instanceof Error ? error.message : String(error),
    });
  };

  const transformationStarted = performance.now();
  const batchSize = Math.max(1, Number(process.env.SUPERCOV_TEST262_BATCH ?? 128));
  for (let offset = 0; offset < baselineTests.length; offset += batchSize) {
    const batch = baselineTests.slice(offset, offset + batchSize);
    try {
      const transformed = instrumentSources(
        batch.map((test) => ({
          file: `test262/${relative(corpusRoot, test.path).replaceAll("\\", "/")}`,
          source: test.source,
        })),
      );
      for (const [index, test] of batch.entries())
        writeTransformed(test, transformed[index].code);
    } catch (batchError) {
      // Preserve an exact per-file failure inventory if one malformed input
      // causes the batch protocol to reject the whole batch.
      for (const test of batch) {
        try {
          const relativePath = relative(corpusRoot, test.path).replaceAll("\\", "/");
          writeTransformed(
            test,
            instrumentSources([{ file: `test262/${relativePath}`, source: test.source }])[0].code,
          );
        } catch (error) {
          recordFailure(test, error ?? batchError);
        }
      }
    }
  }
  const transformationDurationMs = performance.now() - transformationStarted;

  const instrumentedStarted = performance.now();
  const instrumentedRun = baselineFiles.size
    ? runHarness(resolve(instrumentedRoot, "**/*.js"))
    : { records: [], failures: new Map() };
  const instrumentedResults = instrumentedRun.records;
  const instrumentedDurationMs = performance.now() - instrumentedStarted;
  const instrumentedPasses = new Map();
  for (const record of instrumentedResults.filter((item) => item.pass)) {
    const key = resultKey(record);
    instrumentedPasses.set(key, (instrumentedPasses.get(key) ?? 0) + 1);
  }
  const semanticFailures = [];
  for (const [key, expectedPasses] of baselinePasses) {
    if (transformationFailureFiles.has(key)) continue;
    const actualPasses = instrumentedPasses.get(key) ?? 0;
    if (actualPasses < expectedPasses) {
      semanticFailures.push({
        test: key,
        error:
          `${actualPasses}/${expectedPasses} baseline-passing scenario(s) still pass after instrumentation` +
          (instrumentedRun.failures.get(key)?.length
            ? `; ${instrumentedRun.failures.get(key).join(" | ")}`
            : ""),
      });
    }
  }

  const baselinePassingScenarios = [...baselinePasses.values()].reduce(
    (total, count) => total + count,
    0,
  );
  const baselineFailed = originalResults.filter((record) => !record.pass).length;
  const revisionResult = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: test262Root,
    encoding: "utf8",
  });
  const revision =
    revisionResult.status === 0 ? revisionResult.stdout.trim() : "unknown";
  console.log(
    `[test262] engine=rust revision=${revision} shard=${shardText}`,
  );
  console.log(
    `[test262] selected files=${selected.length}; baseline passing scenarios=${baselinePassingScenarios}; baseline unsupported/failed scenarios=${baselineFailed}`,
  );
  console.log(`[test262] explicitly excluded files in shard=${exclusions.length}`);
  console.log(
    `[test262] durations baseline=${(baselineDurationMs / 1000).toFixed(2)}s transformation=${(transformationDurationMs / 1000).toFixed(2)}s instrumented=${(instrumentedDurationMs / 1000).toFixed(2)}s`,
  );
  const excludedByReason = new Map();
  for (const exclusion of exclusions)
    excludedByReason.set(
      exclusion.reason,
      (excludedByReason.get(exclusion.reason) ?? 0) + 1,
    );
  for (const [reason, count] of [...excludedByReason].sort(([left], [right]) =>
    String(left).localeCompare(String(right)),
  ))
    console.log(`[test262] excluded ${count}: ${reason}`);
  console.log(
    `[test262] transform failures=${transformationFailures.length}; semantic-equivalence failures=${semanticFailures.length}`,
  );
  for (const failure of [...transformationFailures, ...semanticFailures].slice(0, 100))
    console.error(`[test262] FAIL ${failure.file ?? failure.test}: ${failure.error}`);

  const minimum = Number(
    option("--minimum", String(Math.max(1, Math.floor(selected.length * 0.5)))),
  );
  if (baselinePassingScenarios < minimum)
    throw new Error(`Only ${baselinePassingScenarios} baseline scenarios passed; required ${minimum}`);
  if (transformationFailures.length || semanticFailures.length) process.exitCode = 1;
} finally {
  if (keepTemporary) console.log(`[test262] retained ${temporary}`);
  else rmSync(temporary, { recursive: true, force: true });
}
