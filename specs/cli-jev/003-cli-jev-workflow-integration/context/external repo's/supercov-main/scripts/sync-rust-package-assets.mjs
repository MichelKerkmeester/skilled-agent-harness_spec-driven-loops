#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const repository = resolve(import.meta.dirname, "..");
const mappings = [
  ["docs/getting-started.md", "crates/supercov-cli/assets/docs/getting-started.md"],
  ["docs/agent-loop.md", "crates/supercov-cli/assets/docs/agent-loop.md"],
  ["docs/assertions.md", "crates/supercov-cli/assets/docs/assertions.md"],
  ["docs/quality.md", "crates/supercov-cli/assets/docs/quality.md"],
  ["docs/security.md", "crates/supercov-cli/assets/docs/security.md"],
  ["docs/assertion-evidence.md", "crates/supercov-cli/assets/docs/assertion-evidence.md"],
  ["docs/assertion-maps.md", "crates/supercov-cli/assets/docs/assertion-maps.md"],
  ["docs/assertion-agent.md", "crates/supercov-cli/assets/docs/assertion-agent.md"],
  ["docs/troubleshooting.md", "crates/supercov-cli/assets/docs/troubleshooting.md"],
  ["docs/cli.md", "crates/supercov-cli/assets/docs/cli.md"],
  ["docs/coverage-model.md", "crates/supercov-cli/assets/docs/coverage-model.md"],
  ["docs/evidence.md", "crates/supercov-cli/assets/docs/evidence.md"],
  ["docs/supported-suites.md", "crates/supercov-cli/assets/docs/supported-suites.md"],
  ["docs/verification.md", "crates/supercov-cli/assets/docs/verification.md"],
  ["docs/performance.md", "crates/supercov-cli/assets/docs/performance.md"],
  ["docs/workspace-isolation.md", "crates/supercov-cli/assets/docs/workspace-isolation.md"],
  ["contracts/v1/contract.json", "crates/supercov-contracts/assets/v1/contract.json"],
  ["contracts/probe-v2/contract.json", "crates/supercov-contracts/assets/probe-v2/contract.json"],
  ["contracts/frontend-v2/contract.json", "crates/supercov-contracts/assets/frontend-v2/contract.json"],
  ["contracts/frontend-v2/examples/javascript-mixed-runners.json", "crates/supercov-contracts/assets/frontend-v2/examples/javascript-mixed-runners.json"],
  ["contracts/frontend-v2/examples/python-pytest-xdist.json", "crates/supercov-contracts/assets/frontend-v2/examples/python-pytest-xdist.json"],
  ["contracts/python-coverage-v1/contract.json", "crates/supercov-contracts/assets/python-coverage-v1/contract.json"],
  ["contracts/evidence-v3/contract.json", "crates/supercov-contracts/assets/evidence-v3/contract.json"],
  ["contracts/coverage-model-v1/contract.json", "crates/supercov-contracts/assets/coverage-model-v1/contract.json"],
  ["contracts/rust-coverage-v1/contract.json", "crates/supercov-contracts/assets/rust-coverage-v1/contract.json"],
  ["contracts/rust-compiler-companion-v1/contract.json", "crates/supercov-contracts/assets/rust-compiler-companion-v1/contract.json"],
  ["contracts/rust-probe-transport-v1/contract.json", "crates/supercov-contracts/assets/rust-probe-transport-v1/contract.json"],
  ["contracts/rust-probe-transport-v3/contract.json", "crates/supercov-contracts/assets/rust-probe-transport-v3/contract.json"],
  ["contracts/coverage-model-v1/vectors.json", "crates/supercov-engine/test-assets/coverage-model-v1/vectors.json"],
  ["contracts/probe-v2/vectors.json", "crates/supercov-engine/test-assets/probe-v2/vectors.json"],
  ...[
    "pytest-basic.json",
    "pytest-concurrency.json",
    "pytest-outcomes.json",
    "pytest-paths.json",
    "pytest-retry.json",
    "pytest-worker-crash.json",
    "pytest-xdist.json",
  ].map(name => [
    `contracts/python-coverage-v1/examples/${name}`,
    `crates/supercov-engine/test-assets/python-coverage-v1/${name}`,
  ]),
  ...["agent-error.json", "agent-page.json", "agent-success.json"].map(name => [
    `tests/golden/${name}`,
    `crates/supercov-engine/test-assets/agent/${name}`,
  ]),
  // The runtime shims the engine embeds. `runtime/` at the repository root is
  // what the npm package ships and what the language runtimes are developed
  // in; the engine reads these copies so that the crate cargo packages -- which
  // holds nothing outside its own directory -- still builds from source.
  ...runtimeFiles("javascript", [
    "atomic.mjs",
    "capability.mjs",
    "launchSupervisor.mjs",
    "nodeAssert.mjs",
    "nodeAssertAdapter.mjs",
    "nodeAssertStrict.mjs",
    "nodeTest.mjs",
    "playwright.mjs",
    "playwrightReporter.mjs",
    "provenance.mjs",
    "register.mjs",
    "resolve-loader.mjs",
    "runnerEvidence.mjs",
    "runtime.mjs",
    "transport.mjs",
    "vitest.mjs",
    "vitestBrowser.mjs",
    "jest.cjs",
    "jest.config.mjs",
    "jestReporter.mjs",
    "jestRuntime.cjs",
    "vitestReporter.mjs",
  ]),
  ...runtimeFiles("python", [
    "sitecustomize.py",
    "supercov_pytest.py",
    "supercov_runtime.py",
    "supercov_unittest.py",
    "supercov_probes.py",
    "supercov_instrument.py",
  ]),
  // Nested rather than flat: a Go package is a directory and a JVM class is
  // its package path, so the layout is part of what makes these compile.
  ...runtimeFiles("go", ["supercov/supercov.go"]),
  ...runtimeFiles("jvm", [
    "com/supercorp/supercov/Supercov.java",
    "com/supercorp/supercov/SupercovListener.java",
    "com/supercorp/supercov/SupercovTestNGListener.java",
  ]),
  ...runtimeFiles("ruby", [
    "supercov_cucumber.rb",
    "supercov_minitest.rb",
    "supercov_rspec.rb",
    "supercov_runtime.rb",
    "supercov_testunit.rb",
  ]),
];

function runtimeFiles(language, names) {
  return names.map(name => [
    `runtime/${language}/${name}`,
    `crates/supercov-engine/runtime-assets/${language}/${name}`,
  ]);
}
const check = process.argv.includes("--check");

for (const [source, destination] of mappings) {
  const expected = readFileSync(resolve(repository, source));
  const destinationPath = resolve(repository, destination);
  if (check) {
    assert.deepEqual(
      readFileSync(destinationPath),
      expected,
      `${destination} differs from ${source}; run npm run sync:rust-assets`,
    );
  } else {
    mkdirSync(dirname(destinationPath), { recursive: true });
    writeFileSync(destinationPath, expected);
  }
}

console.log(
  check
    ? `[rust-package-assets] ${mappings.length} packaged assets are exact`
    : `[rust-package-assets] synchronized ${mappings.length} packaged assets`,
);
