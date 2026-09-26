import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { runnerTestId, runnerExecutionScope } from "../../runtime/javascript/runnerEvidence.mjs";
import { decodeCoverageScope, encodeCoverageScope } from "../../runtime/javascript/transport.mjs";

test("registration identity preserves unique tests and keeps retries separate", () => {
  const identity = { runner: "node:test", file: import.meta.filename, line: 1, column: 1, name: "same" };
  assert.equal(runnerTestId(identity), runnerTestId({ ...identity, registrationOrdinal: 0 }));
  const variants = [identity, { ...identity, registrationOrdinal: 1 },
    { ...identity, parentTestId: "a" }, { ...identity, parentTestId: "b" }];
  assert.equal(new Set(variants.map(runnerTestId)).size, variants.length);
  assert.notEqual(runnerTestId({ ...identity, registrationOrdinal: 1 }),
    runnerTestId({ ...identity, name: "same\u0000registration\u00001" }));
  assert.notEqual(runnerTestId({ ...identity, parentTestId: "a" }),
    runnerTestId({ ...identity, name: "same\u0000parent\u0000a" }));
  const first = runnerExecutionScope(identity);
  const retry = runnerExecutionScope({ ...identity, retry: 1 });
  assert.equal(first.testId, retry.testId);
  assert.notEqual(first.attemptId, retry.attemptId);
  assert.deepEqual(decodeCoverageScope(encodeCoverageScope(first)), first);
});

test("duplicate and nested registrations retain separate witnesses across executions", t => {
  const directory = mkdtempSync(resolve(tmpdir(), "supercov-registration-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const fixture = resolve(import.meta.dirname, "fixtures/duplicate-registrations.mjs");
  const env = { ...process.env, SUPERCOV_EVIDENCE_DIR: directory, SUPERCOV_RUN_ID: "registrations" };
  delete env.NODE_TEST_CONTEXT;
  const nativeSource = readFileSync(fixture, "utf8")
    .replace("../../../runtime/javascript/nodeTest.mjs", "node:test")
    .replace("../../../runtime/javascript/nodeAssertStrict.mjs", "node:assert/strict");
  const native = spawnSync(process.execPath, ["--input-type=module", "--test-reporter=tap", "--eval", nativeSource], { env, encoding: "utf8", timeout: 15000 });
  assert.equal(native.status, 1, native.stdout + native.stderr);
  assert.match(native.stdout, /# tests 10\b/);
  assert.match(native.stdout, /# pass 9\b/);
  assert.match(native.stdout, /# fail 1\b/);
  const read = () => readdirSync(directory).filter(name => name.startsWith("node_test-") && name.endsWith(".mcdc.jsonl")).flatMap(name =>
    readFileSync(resolve(directory, name), "utf8").trimEnd().split("\n").map(line => JSON.parse(line)));
  let first;
  for (let run = 1; run <= 2; run++) {
    const result = spawnSync(process.execPath, ["--test", "--test-reporter=tap", fixture], { env, encoding: "utf8", timeout: 15000 });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /# tests 10\b/);
    assert.match(result.stdout, /# pass 9\b/);
    assert.match(result.stdout, /# fail 1\b/);
    const records = read();
    assert.equal(records.length, 10 * run);
    assert.equal(new Set(records.map(r => r.scope.attemptId)).size, records.length);
    const groups = Map.groupBy(records, r => r.scope.workerId);
    assert.equal(groups.size, run);
    for (const rows of groups.values()) {
      assert.equal(new Set(rows.map(r => r.testId)).size, 10);
      const duplicates = rows.filter(r => r.test === "duplicate registration");
      assert.deepEqual(duplicates.map(r => r.status).sort(), ["failed", "passed"]);
      for (const row of duplicates) {
        assert.equal(row.phases.length, 1);
        assert.equal(row.phases[0].status, row.status);
        assert.ok(row.phases[0].id.startsWith(row.scope.attemptId + ":"));
      }
      assert.equal(rows.filter(r => r.test === "same child").length, 4);
      assert.equal(rows.filter(r => r.test === "done callback").length, 2);
      const ids = rows.map(r => r.testId).sort();
      if (!first) first = ids;
      else assert.deepEqual(ids, first, "test IDs stay stable across process executions");
    }
  }
});

test("worker threads with a shared pid cannot overwrite one another's attempts", t => {
  const directory = mkdtempSync(resolve(tmpdir(), "supercov-registration-workers-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const fixture = pathToFileURL(resolve(import.meta.dirname, "fixtures/duplicate-registrations.mjs")).href;
  const env = { ...process.env, SUPERCOV_EVIDENCE_DIR: directory, SUPERCOV_RUN_ID: "workers" };
  delete env.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", `
    import { Worker } from 'node:worker_threads';
    import assert from 'node:assert/strict';
    const codes = await Promise.all([0, 1].map(() => new Promise((resolve, reject) => {
      const worker = new Worker(new URL(${JSON.stringify(fixture)}), { execArgv: [] });
      worker.once('error', reject);
      worker.once('exit', resolve);
    })));
    assert.deepEqual(codes, [1, 1]);
  `], { env, encoding: "utf8", timeout: 15000 });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const records = readdirSync(directory).filter(name => name.startsWith("node_test-") && name.endsWith(".mcdc.jsonl")).flatMap(name =>
    readFileSync(resolve(directory, name), "utf8").trimEnd().split("\n").map(line => JSON.parse(line)));
  assert.equal(records.length, 20);
  assert.equal(new Set(records.map(r => r.scope.attemptId)).size, 20);
  const groups = [...Map.groupBy(records, r => r.scope.workerId).values()];
  assert.deepEqual(groups.map(rows => rows.length), [10, 10]);
  assert.deepEqual(groups[0].map(r => r.testId).sort(), groups[1].map(r => r.testId).sort());
});
