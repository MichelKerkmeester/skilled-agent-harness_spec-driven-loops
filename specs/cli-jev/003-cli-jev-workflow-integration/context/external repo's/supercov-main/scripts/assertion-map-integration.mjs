import { acknowledgeMap } from './assertion-map-test-author.mjs';
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gunzipSync } from 'node:zlib';
import { requireSupercov, executeSupercov, latestRun, coverageQuery } from "./coverage-test-helpers.mjs";

const root = mkdtempSync(join(tmpdir(), "supercov-assertion-maps-"));
const read = path => JSON.parse(readFileSync(path, "utf8"));
const write = (path, data) => writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
function query(run, ...args) { return coverageQuery(root, run, "assertions", ...args).data; }
function run() { requireSupercov(root, ["--", "node", "--test"]); return latestRun(root); }
try {
  mkdirSync(join(root, "src")); mkdirSync(join(root, "tests"));
  write(join(root, "package.json"), { name: "map-pilot", private: true, type: "module" });
  writeFileSync(join(root, "src/core.js"), "export function value() {\n  return 1;\n}\n");
  writeFileSync(join(root, "tests/core.test.js"), "import assert from 'node:assert/strict';\nimport test from 'node:test';\nimport { value } from '../src/core.js';\ntest('value', () => {\n  assert.equal(value(), 1);\n});\n");
  const first = run();
  const archive = gunzipSync(readFileSync(join(root, '.supercov/runs', first, 'evidence.raw.gz')));
  const magic = Buffer.from('SUPERCOV-EVIDENCE-3\n');
  assert(archive.subarray(0, magic.length).equals(magic));
  let inputManifest;
  for (let offset = magic.length; offset < archive.length;) {
    const length = archive.readUInt32BE(offset); offset += 4;
    const header = JSON.parse(archive.subarray(offset, offset + length)); offset += length;
    if (header.path === 'assertion-inputs.json') inputManifest = JSON.parse(archive.subarray(offset, offset + header.bytes));
    offset += header.bytes;
  }
  assert.equal(inputManifest.schemaVersion, 2);
  assert.equal(typeof inputManifest.files['src/core.js'], 'object');
  assert.equal(inputManifest.files['src/core.js'].bytes, readFileSync(join(root, 'src/core.js')).length);
  assert.match(inputManifest.files['src/core.js'].sha256, /^[a-f0-9]{64}$/);
  assert(!JSON.stringify(inputManifest).includes('export function value()'), 'full source is absent from assertion inputs');
  assert.equal(coverageQuery(root, first).data.confidence.lines.asserted, 0);
  const automatic = coverageQuery(root, first).data.assertionCoverage;
  assert.equal(automatic.summary.statements.percentage, null);
  assert.equal(automatic.summary.assertionsWithoutFlows, 1);
  assert.equal(automatic.inheritance.from, null);
  const initialized = query(first);
  assert.equal(initialized.map, automatic.map);
  const map = read(initialized.map);
  assert.equal(map.assertions.length, 1);
  assert.equal(initialized.items.length, 1);
  assert.deepEqual(initialized.items[0].flows, []);
  assert.equal(automatic.summary.status, 'notAssessed');
  assert.equal(initialized.items[0].inMap, true);
  const a = map.assertions[0];
  const source = coverageQuery(root, first, 'source', 'src/core.js', '--offset', '1', '--limit', '1');
  assert.equal(source.command, 'coverage.source');
  assert.deepEqual(source.data.items, [{ line: 2, text: '  return 1;' }]);
  const sourceText = requireSupercov(root, ['runs', first, 'source', 'src/core.js', '--offset', '1', '--limit', '1']).stdout;
  assert.match(sourceText, /2 │   return 1;/);
  assert(!sourceText.includes('"text"'));
  assert.match(sourceText, /--offset 2 --limit 1/);
  const listText = requireSupercov(root, ['runs', first, 'assertions']).stdout;
  assert(listText.includes(a.id));
  assert.match(listText, /no flows · 1 passing test/);
  for (const resource of [['source'], ['source', 'missing.ts'], ['assertion'], ['assertion', 'unknown-id'], ['assertion', a.id, '--limit', '0'], ['assertions', 'inventory']]) {
    assert.equal(executeSupercov(root, ['runs', first, ...resource]).status, 2, resource.join(' '));
  }
  // Removing a map entry must not hide a recognized assertion from the list.
  write(initialized.map, { schemaVersion:2, assertions: [] });
  const missing = query(first);
  assert.equal(missing.items.length, 1);
  assert.equal(missing.items[0].inMap, false);
  assert.equal(missing.items[0].id, a.id);
  assert.equal(missing.summary.missingInventoryAssertions, 1);
  assert.equal(coverageQuery(root, first, 'assertion', a.id).data.assertion.inMap, false);
  write(initialized.map, map);
  assert.equal(a.at.line, 5);
  a.observes = ["value returns one"];
  a.flows = [{ id: "return-value", basis:null, appliesTo:[{file:"tests/core.test.js",name:"value"}], explanation: "The returned integer is compared to one by this assertion.", nodes: [
    { id: "return", at: { file: "src/core.js", line: 2, column: 3, text: "return 1;" } }
  ], edges: [{from:"return",to:"$assertion",kind:"data"}], countsAsAsserted: ["return"], watch: ["src/core.js", "tests/core.test.js"] }];
  write(initialized.map, map);
  assert.equal(query(first).summary.lines.asserted, 0, "editing a map is not review acknowledgement");
  assert.match(requireSupercov(root, ["runs", first]).stdout, /Assertions pending/);
  acknowledgeMap((...args) => query(first, ...args), initialized.map, map);
  let report = query(first);
  assert.equal(report.summary.lines.asserted, 1, JSON.stringify(report));
  assert.equal(report.summary.statements.asserted, 1);
  assert.equal(report.summary.staleFlows, 0);
  assert.equal(query(first, "--view", "creditedLines").items[0].assertions[0], a.id);
  assert.equal(coverageQuery(root, first).data.assertionCoverage.summary.lines.asserted, 1);
  const detail = coverageQuery(root, first, 'assertion', a.id);
  assert.equal(detail.command, 'coverage.assertion');
  assert.deepEqual(detail.data.assertion.observes, a.observes);
  assert.deepEqual(detail.data.assertion.flows[0].nodes, a.flows[0].nodes);
  assert.deepEqual(detail.data.assertion.flows[0].watch, a.flows[0].watch);
  assert.equal(detail.data.assertion.flows[0].explanation, a.flows[0].explanation);
  assert.equal(detail.data.assertion.flows[0].current, true);
  assert.equal(detail.data.assertion.flows[0].eligible, true);
  assert.equal(detail.data.assertion.flows[0].nodeCredit[0].status, 'credited');
  assert.equal(detail.data.assertion.flows[0].nodeCredit[0].reasons[0].code, 'same_test_execution');
  assert.equal(detail.data.revision, report.revision);
  assert.equal(detail.data.tests.length, 1);
  const detailText = requireSupercov(root, ['runs', first, 'assertion', a.id]).stdout;
  assert(detailText.includes(a.flows[0].explanation));
  assert.match(detailText, /Node return — src\/core.js:2:3/);
  assert.match(detailText, /current, eligible for credit/);
  assert.match(detailText, /\[Credited\]/);
  assert.match(detailText, /Credit reason: Current agent claim/);
  const regular = coverageQuery(root, first).data.assertionCoverage;
  assert.equal(regular.summary.statements.percentage, 100);
  assert.equal(regular.revision, report.revision);
  assert.match(requireSupercov(root, ["runs", first]).stdout, /Assertions 100\.00% \(1\/1\)/);
  // Large details must remain readable without truncating any authored graph.
  const originalFlows = a.flows;
  a.flows = Array.from({length: 7}, (_, index) => ({
    ...structuredClone(originalFlows[0]), id: `large-${index}`,
    explanation: 'The checked return value. '.repeat(520),
  }));
  write(initialized.map, map);
  acknowledgeMap((...args) => query(first, ...args), initialized.map, map);
  const collected = [];
  let offset = 0;
  do {
    const page = coverageQuery(root, first, 'assertion', a.id, '--offset', String(offset)).data;
    assert.equal(page.pagination.total, 7);
    assert(page.pagination.returned > 0);
    if (offset === 0) assert(page.pagination.returned < 7, 'JSON pages adapt to the byte limit');
    collected.push(...page.assertion.flows);
    assert.equal(page.summary.statements.asserted, 1, 'paging does not change credit');
    offset = page.pagination.nextOffset;
  } while (offset !== null);
  assert.deepEqual(collected.map(f => f.id), a.flows.map(f => f.id));
  for (const [index, flow] of collected.entries()) {
    assert.deepEqual(flow.nodes, a.flows[index].nodes);
    assert.equal(flow.explanation, a.flows[index].explanation);
    assert.equal(flow.nodeCredit[0].status, 'credited');
  }
  const pagedText = requireSupercov(root, ['runs', first, 'assertion', a.id, '--offset', '1', '--limit', '1']).stdout;
  assert.match(pagedText, /Showing flows 2-2 of 7/);
  assert.match(pagedText, /--offset 2 --limit 1/);
  const emptyText = requireSupercov(root, ['runs', first, 'assertion', a.id, '--offset', '7']).stdout;
  assert.match(emptyText, /No flows on this page/);
  assert(!emptyText.includes('No flows mapped yet'));
  a.flows = originalFlows;
  write(initialized.map, map);
  // The regular report must refresh after map edits without rerunning tests.
  a.flows[0].explanation += " Reviewed again.";
  write(initialized.map, map);
  const edited = coverageQuery(root, first).data.assertionCoverage;
  assert.notEqual(edited.revision, regular.revision);
  assert.equal(edited.summary.statements.percentage, null);
  assert.match(requireSupercov(root, ["runs", first]).stdout, /1 stale/);
  writeFileSync(initialized.map, "{broken JSON");
  assert.equal(coverageQuery(root, first).data.assertionCoverage.available, false);
  assert.equal(coverageQuery(root, first, 'source', 'src/core.js').data.items[1].text, '  return 1;', 'source remains readable with malformed map JSON');
  assert.match(requireSupercov(root, ["runs", first]).stdout, /Assertions unavailable: assertions.json/);
  write(initialized.map, map);
  acknowledgeMap((...args) => query(first, ...args), initialized.map, map);
  assert.equal(coverageQuery(root, first).data.assertionCoverage.summary.statements.percentage, 100);
  const firstMapBytes = readFileSync(initialized.map);
  const firstStatePath = join(root, '.supercov/runs', first, 'assertions.state.json');
  const firstStateBytes = readFileSync(firstStatePath);
  const validation = query(first, 'validate');
  const tokenPage = query(first, 'validate', '--view', 'flows', '--limit', '1');
  assert.equal(tokenPage.items[0].expectedBasis, a.flows[0].basis);
  assert.equal(tokenPage.revision, validation.revision);
  assert.equal(tokenPage.pagination.total, 1);
  assert.equal(query(first, 'validate', '--view', 'errors').pagination.total, 0);
  assert.equal(query(first, '--needs-attention').pagination.total, 0);
  assert.deepEqual(readFileSync(initialized.map), firstMapBytes, 'queries never edit map tokens');
  assert.deepEqual(readFileSync(firstStatePath), firstStateBytes, 'queries never mutate managed state');
  const currentSource = coverageQuery(root, first, "source", "src/core.js").data.items;
  assert.equal(currentSource[1].text, "  return 1;");
  assert.notEqual(executeSupercov(root, ["runs",first,"assertions","init"]).status, 0, "the init command is removed");
  assert.notEqual(executeSupercov(root, ["runs",first,"asserted"]).status, 0, "legacy analyzer command is gone");
  const second = run();
  assert.equal(query(second).inheritance.from, first);
  assert.equal(query(second).summary.staleFlows, 0);
  assert.equal(query(second).summary.lines.asserted, 1);
  writeFileSync(join(root,"src/core.js"), "export function value() {\n  return 2 - 1;\n}\n");
  const third = run();
  const carried = query(third);
  assert.equal(carried.inheritance.from, second);
  report = query(third);
  assert.equal(report.summary.staleFlows,1);
  assert.equal(report.summary.lines.asserted,0);
  for (const resource of [['source', 'src/core.js'], ['assertions'], ['assertions', 'review', '--all'], ['assertions', 'validate']]) {
    assert.equal(executeSupercov(root, ['runs', first, ...resource]).status, 2, 'old run must not use changed source');
  }
  assert.equal(coverageQuery(root, first).data.assertionCoverage.available, false);
  assert(query(first, 'files').items.some(f => f.file === 'src/core.js' && /^[a-f0-9]{64}$/.test(f.sha256)), 'old manifest stays inspectable');
  const updated=read(carried.map);assert.equal(updated.assertions[0].id,a.id);
  updated.assertions[0].flows[0].nodes[0].at.text="return 2 - 1;";
  write(carried.map,updated);
  acknowledgeMap((...args) => query(third, ...args), carried.map, updated);
  assert.equal(query(third).summary.lines.asserted,1);
  assert.equal(read(initialized.map).assertions[0].flows[0].nodes[0].at.text,"return 1;");
  // A different test command starts its own map and cannot eclipse this suite.
  requireSupercov(root, ["--", "node", "--test", "tests/core.test.js"]);
  const focused = latestRun(root);
  assert.equal(query(focused).inheritance.from, null);
  const fourth = run();
  assert.equal(query(fourth).inheritance.from, third);
  assert.equal(query(fourth).summary.statements.asserted, 1);

  // Newer malformed work stays untouched. An older fallback requires review.
  writeFileSync(query(fourth).map, "{broken JSON");
  const fallback = run();
  const recovered = query(fallback);
  assert.equal(recovered.inheritance.from, third);
  assert.equal(recovered.inheritance.skipped[0].run, fourth);
  assert.equal(recovered.summary.staleFlows, 1);
  assert.equal(recovered.summary.statements.asserted, 0);
  assert.match(requireSupercov(root, ["runs", fallback]).stdout, /Map reuse skipped 1 newer candidate/);
  assert.equal(readFileSync(join(root, '.supercov/runs', fourth, 'assertions.json'), 'utf8'), '{broken JSON');
  const stillDirty = run();
  assert.equal(query(stillDirty).inheritance.from, fallback);
  assert.equal(query(stillDirty).summary.staleFlows, 1, 'fallback review requirement persists');
  acknowledgeMap((...args) => query(stillDirty, ...args), query(stillDirty).map);
  assert.equal(query(stillDirty).summary.statements.asserted, 1);

  // Anchors follow their statements when lines are added above them, and a
  // blank line changes nothing a program can observe: the acknowledgement
  // stands, credit is kept, and there is no change to assess.
  const testPath = join(root, 'tests/core.test.js');
  const corePath = join(root, 'src/core.js');
  writeFileSync(testPath, '\n' + readFileSync(testPath, 'utf8'));
  writeFileSync(corePath, '\n' + readFileSync(corePath, 'utf8'));
  const moved = run();
  const movedReport = query(moved);
  const movedMap = read(movedReport.map);
  assert.equal(movedMap.assertions[0].id, a.id);
  assert.equal(movedMap.assertions[0].at.line, 6);
  assert.equal(movedMap.assertions[0].flows[0].nodes[0].at.line, 3);
  assert.equal(movedReport.summary.statements.asserted, 1);
  assert.equal(movedReport.summary.staleFlows, 0);
  assert.equal(query(moved, 'report', '--view', 'changes').pagination.total, 0, 'blank lines are not a change to assess');
  // A statement added to the selected test is a change to the test the claim
  // applies to, and the reason says so and names what moved.
  writeFileSync(testPath, readFileSync(testPath, 'utf8').replace("import test from 'node:test';", "import test from 'node:test';\nconst extra = 1;"));
  const testEdited = run();
  const testEditedReport = query(testEdited);
  assert.equal(testEditedReport.summary.statements.asserted, 0);
  assert.equal(testEditedReport.summary.staleFlows, 1);
  const testEditedFlow = query(testEdited, 'report', '--view', 'assertions').items[0].flows[0];
  assert(testEditedFlow.reasons.some(r => r.startsWith('tests/core.test.js: top level changed') && r.includes('is the test this claim applies to')), JSON.stringify(testEditedFlow.reasons));
  acknowledgeMap((...args) => query(testEdited, ...args), testEditedReport.map, read(testEditedReport.map));
  assert.equal(query(testEdited).summary.statements.asserted, 1);

  // Failed runs still have maps, but cannot inherit passing execution credit.
  writeFileSync(corePath, readFileSync(corePath, 'utf8').replace('return 2 - 1;', 'return 2;'));
  assert.notEqual(executeSupercov(root, ["--", "node", "--test"]).status, 0);
  const failed = latestRun(root);
  assert.equal(query(failed).inheritance.from, testEdited);
  assert.equal(query(failed).summary.runPassed, false);
  assert.equal(query(failed).summary.statements.asserted, 0);
  assert.deepEqual(readFileSync(initialized.map), firstMapBytes);
  assert.deepEqual(readFileSync(firstStatePath), firstStateBytes);
  console.log(JSON.stringify({pilot:"assertion-map-cli",runs:9,assertions:1,creditedLines:1,inheritance:"unchanged tokens reused; source impact and edited flows acknowledged in JSON",sourceStorage:"hash manifest; current checkout required"}));
} finally { rmSync(root,{recursive:true,force:true}); }

const rustRoot = mkdtempSync(join(tmpdir(), "supercov-assertion-map-rust-"));
try {
  mkdirSync(join(rustRoot,"src"));
  writeFileSync(join(rustRoot,"Cargo.toml"),'[package]\nname="map-pilot"\nversion="0.1.0"\nedition="2024"\n');
  writeFileSync(join(rustRoot,"src/lib.rs"),"pub fn value() -> i32 {\n  return 1;\n}\n#[cfg(test)] mod tests {\n  #[test] fn value_test() {\n    assert_eq!(super::value(), 1);\n    assert!(true);\n  }\n}\n");
  requireSupercov(rustRoot,["--","cargo","test"]);
  const run=latestRun(rustRoot);
  const queryRust=(...args)=>coverageQuery(rustRoot,run,"assertions",...args).data;
  const init=queryRust();
  const sites=queryRust("--view","assertions").items;
  assert.equal(sites.length,2);
  assert(sites.every(a=>a.observedPassingTests.length===1),JSON.stringify(sites));
  const map=read(init.map);
  const a=map.assertions[0];a.observes=["value returns one"];
  const t=queryRust("report","--view","tests").items[0];
  a.flows=[{id:"return-value",basis:null,appliesTo:[{file:t.file,name:t.name}],explanation:"This macro compares the returned integer with one.",nodes:[{id:"return",at:{file:"src/lib.rs",line:2,column:3,text:"return 1;"}}],edges:[{from:"return",to:"$assertion",kind:"data"}],countsAsAsserted:["return"],watch:["src/lib.rs"]}];
  write(init.map,map);acknowledgeMap(queryRust,init.map,map);
  assert.equal(queryRust().summary.statements.asserted,1);
  console.log(JSON.stringify({pilot:"assertion-map-rust",assertions:2,passingSites:2,creditedStatements:1}));
} finally { rmSync(rustRoot,{recursive:true,force:true}); }
