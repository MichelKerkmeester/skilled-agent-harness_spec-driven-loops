#!/usr/bin/env node

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const repository = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const binary = resolve(repository, "target/debug/supercov");
const project = mkdtempSync(resolve(tmpdir(), "supercov-html-report-"));

try {
  mkdirSync(resolve(project, "src"));
  writeFileSync(
    resolve(project, "package.json"),
    JSON.stringify({ name: "portable-report-fixture", type: "module" }),
  );
  writeFileSync(
    resolve(project, "src/access.js"),
    [
      'const hostile = "</script><script>alert(1)</script>";',
      "export function access(member, owner) {",
      '  if (member && owner) return `owner:${hostile.length}`;',
      '  return "visitor";',
      "}",
      "",
    ].join("\n"),
  );
  writeFileSync(
    resolve(project, "access.test.js"),
    [
      'import test from "node:test";',
      'import assert from "node:assert/strict";',
      'import { access } from "./src/access.js";',
      'test("owner access", () => {',
      "  assert.match(access(true, true), /^owner:/);",
      "});",
      "",
    ].join("\n"),
  );

  execFileSync(binary, ["--", "node", "--test"], {
    cwd: project,
    encoding: "utf8",
    stdio: "pipe",
  });
  execFileSync(
    binary,
    ["report", "--runs", "1", "--no-open", "--output", "report.html"],
    { cwd: project, encoding: "utf8", stdio: "pipe" },
  );
  // With no --output the report lands inside the store, whose own .gitignore
  // keeps it out of a careless commit. An explicit path resolves against the
  // working directory, which is also where the store is looked up.
  const defaultReport = execFileSync(
    binary,
    ["report", "--runs", "1", "--no-open"],
    { cwd: project, encoding: "utf8", stdio: "pipe" },
  );
  assert.match(defaultReport, /\.supercov\/reports\/supercov-report\.html/);
  assert(statSync(resolve(project, ".supercov/reports/supercov-report.html")).size > 0);
  assert.match(readFileSync(resolve(project, ".supercov/.gitignore"), "utf8"), /^\*/m);

  // One flow, authored the way an agent would: a claim on the return statement,
  // validated for its token, then acknowledged. Credit needs a passing
  // assertion and execution of the claimed statement in the same selected
  // test, which the named test above supplies.
  const runId = readdirSync(resolve(project, ".supercov/runs"))[0];
  const mapPath = resolve(project, ".supercov/runs", runId, "assertions.json");
  const map = JSON.parse(readFileSync(mapPath, "utf8"));
  assert.equal(map.assertions.length, 1);
  map.assertions[0].observes = ["The returned string starts with owner:."];
  map.assertions[0].flows = [
    {
      id: "owner-return",
      basis: null,
      appliesTo: [{ file: "access.test.js", name: "owner access" }],
      explanation: "access returns the owner string the assertion matches.",
      nodes: [
        {
          id: "return",
          at: {
            file: "src/access.js",
            line: 3,
            column: 24,
            text: "return `owner:${hostile.length}`;",
          },
        },
      ],
      edges: [{ from: "return", to: "$assertion", kind: "data" }],
      countsAsAsserted: ["return"],
      watch: [],
    },
  ];
  writeFileSync(mapPath, JSON.stringify(map, null, 2));
  const validation = JSON.parse(
    execFileSync(
      binary,
      ["runs", runId, "assertions", "validate", "--view", "flows", "--json"],
      { cwd: project, encoding: "utf8", stdio: "pipe" },
    ),
  );
  assert.equal(validation.data.valid, true);
  map.assertions[0].flows[0].basis = validation.data.items[0].expectedBasis;
  writeFileSync(mapPath, JSON.stringify(map, null, 2));
  execFileSync(binary, ["runs", runId, "assertions", "check", "--json"], {
    cwd: project,
    encoding: "utf8",
    stdio: "pipe",
  });

  // A saved assessment, written by hand so this stays offline and free. What
  // decides pairing is the per-file digest, so it is taken from the file on
  // disk; a made-up one must stay unpaired.
  const sourcePath = resolve(project, "src/access.js");
  const sourceDigest = createHash("sha256")
    .update(readFileSync(sourcePath))
    .digest("hex");
  const snapshot = resolve(project, ".supercov/quality/snapshots/q_00000000000000aa");
  mkdirSync(snapshot, { recursive: true });
  writeFileSync(
    resolve(snapshot, "manifest.json"),
    JSON.stringify({
      schema_version: 4,
      id: "q_00000000000000aa",
      created_at: "2026-09-18T00:00:00.000Z",
      instrument: "catalog",
      catalog_version: "properties-v1",
      model: "jev-1.13.0",
      assessed_files_fingerprint: "c".repeat(64),
      assessed_files: 1,
      health: 4.84,
      counts: { files: 1, scored: 1 },
      policy: { cutoffs: "none", fail_on_finding: false },
    }),
  );
  writeFileSync(
    resolve(snapshot, "files.json"),
    JSON.stringify({
      files: [
        {
          path: "src/access.js",
          bytes: 120,
          sha256: sourceDigest,
          status: "completed",
          health: 3.5,
          present: [{ check: "long_method", value: 0.95 }],
          checks: { long_method: 0.95 },
        },
      ],
      directories: [],
    }),
  );
  execFileSync(
    binary,
    ["report", "--runs", "1", "--no-open", "--output", "paired.html"],
    { cwd: project, encoding: "utf8", stdio: "pipe" },
  );
  const pairedHtml = readFileSync(resolve(project, "paired.html"), "utf8");
  const pairedScripts = [
    ...pairedHtml.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g),
  ];
  const paired = JSON.parse(
    gunzipSync(Buffer.from(pairedScripts[0][1].trim(), "base64")).toString("utf8"),
  );
  assert.equal(paired.qualities.length, 1);
  assert.equal(paired.timeline.length, 1);
  assert.equal(paired.timeline[0].kind, "paired");
  assert.equal(paired.timeline[0].qualityId, "q_00000000000000aa");
  assert.equal(paired.qualities[0].files[0].path, "src/access.js");
  // With a flow acknowledged, the map explains something, and the report says
  // where: per file, and per statement so the source view can mark the line.
  // Credit is per statement, not per line — line 3 also holds the unclaimed
  // guard — so the run's line-level figure would refuse it while the
  // statement still shows.
  const credited = paired.runs[0].assertions;
  assert.equal(credited.summary.status, "available");
  assert.equal(credited.summary.statements.asserted, 1);
  assert.deepEqual(credited.files, {
    "src/access.js": { total: 4, declared: 1, asserted: 1 },
  });
  assert.deepEqual(credited.statements, [
    {
      file: "src/access.js",
      line: 3,
      column: 24,
      text: "return `owner:${hostile.length}`;",
      asserted: true,
      flows: [`${map.assertions[0].id}/owner-return`],
    },
  ]);
  // Statements that run past their first line are carried with their span so
  // continuation lines can show the state recorded on the first; the fixture
  // has none, and a single-line statement must not appear here.
  assert.deepEqual(credited.spans, []);
  assert.equal(credited.sites.length, 1);
  assert.equal(credited.sites[0].file, "access.test.js");
  assert.deepEqual(credited.sites[0].observes, [
    "The returned string starts with owner:.",
  ]);
  // The card beside a credited line shows the flow's own reasoning and the
  // tests it was selected for; the explanation lives only in the map.
  assert.deepEqual(credited.sites[0].flows, [
    {
      id: "owner-return",
      eligible: true,
      explanation: "access returns the owner string the assertion matches.",
      tests: [{ file: "access.test.js", name: "owner access", status: "observed" }],
    },
  ]);
  assert.doesNotMatch(JSON.stringify(paired), /\/(Users|home)\/[a-z]/i);

  // A snapshot of different bytes must not be folded into the run, however
  // close in time it was taken.
  writeFileSync(
    resolve(snapshot, "files.json"),
    readFileSync(resolve(snapshot, "files.json"), "utf8").replace(
      sourceDigest,
      "b".repeat(64),
    ),
  );
  execFileSync(
    binary,
    ["report", "--runs", "1", "--no-open", "--output", "unpaired.html"],
    { cwd: project, encoding: "utf8", stdio: "pipe" },
  );
  const unpairedHtml = readFileSync(resolve(project, "unpaired.html"), "utf8");
  const unpairedScripts = [
    ...unpairedHtml.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g),
  ];
  const unpaired = JSON.parse(
    gunzipSync(Buffer.from(unpairedScripts[0][1].trim(), "base64")).toString("utf8"),
  );
  assert.equal(unpaired.timeline.length, 2);
  assert.deepEqual(
    unpaired.timeline.map((item) => item.kind).sort(),
    ["quality", "run"],
  );

  const reportPath = resolve(project, "report.html");
  const html = readFileSync(reportPath, "utf8");
  assert(statSync(reportPath).size < 24 * 1024 * 1024);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /DecompressionStream\("gzip"\)/);
  assert.doesNotMatch(html, /SUPERCOV_REPORT_PAYLOAD/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.doesNotMatch(html, /Private · offline/);
  assert.doesNotMatch(html, /Historical .* snapshot/i);
  assert.doesNotMatch(html, /This saved run passed/i);
  assert.doesNotMatch(html, /needed coverage in this run/i);
  assert.doesNotMatch(html, />Unchanged</i);
  assert.doesNotMatch(html, /Coverage history/);
  assert.match(html, /review: "Overview"/);
  assert.doesNotMatch(html, /Included code/);
  assert.match(html, /const tabs = \["review", "explore", "tests"\]/);
  assert.match(html, /function testsCoveringFile/);
  assert.match(html, /testFileFilter/);
  assert.match(html, /testKind/);
  assert.match(html, /testSuite/);
  assert.match(html, /End-to-end/);
  assert.match(html, /function groupedTestFiles/);
  assert.match(html, /function groupedTestsInFile/);
  assert.match(html, /Find a test file or test/);
  assert.match(html, /Covered source files/);
  assert.match(html, /function closedGapsByFile/);
  assert.match(html, /file-mark\.improved/);
  assert.match(html, /Covered executable line/);
  assert.doesNotMatch(html, /Affected code/);
  assert.doesNotMatch(html, /Previous run/);

  // The judgments a report can carry, and the way it offers the ones it lacks.
  assert.match(html, /function renderQuality/);
  assert.match(html, /function renderAssertions/);
  assert.match(html, /function assertionFileSummary/);
  assert.match(html, /Credited by an assertion/);
  assert.match(html, /file-row-trail/);
  assert.match(html, /function renderAssertionCard/);
  assert.match(html, /function assertionsCreditingFile/);
  assert.match(html, /code-annotation/);
  assert.match(html, /const continuationOf = /);
  assert.match(html, /function openTest/);
  assert.match(html, /code-expand/);
  assert.doesNotMatch(html, /Show more context/);
  assert.doesNotMatch(html, /max-height: 620px/);
  assert.match(html, /function renderMissing/);
  assert.match(html, /function renderQualityOnly/);
  assert.match(html, /function openImprove/);
  // A file:// report has no clipboard API, so the selection path must survive.
  assert.match(html, /execCommand\("copy"\)/);
  assert.match(html, /function copyBySelection/);
  // Banding must match the command line, including rounding before comparing.
  assert.match(html, /rounded >= 8 \? "good" : rounded >= 5 \? "fair" : "weak"/);
  // Quality is a ranking, not a target, and the report has to say so.
  assert.match(html, /not a target/);
  // No price is quoted; a report outlives the rates.
  assert.doesNotMatch(html, /\$\d/);

  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 2);
  new Function(scripts[1][1]);
  const bundle = JSON.parse(
    gunzipSync(Buffer.from(scripts[0][1].trim(), "base64")).toString("utf8"),
  );
  assert.equal(bundle.schemaVersion, 2);
  assert.equal(bundle.project, "portable-report-fixture");
  assert.equal(bundle.runs.length, 1);
  for (const kind of ["statements", "functions", "branches"]) {
    assert.equal(Object.values(bundle.runs[0].fileTotals).reduce((sum, totals) => sum + (totals[kind] || 0), 0), bundle.runs[0].summary.coverage[kind].total, `per-file ${kind} totals reconcile with the run`);
  }
  const breakdownHelpers = html.slice(html.indexOf("const OBLIGATION_KINDS ="), html.indexOf("    function filesOwing("));
  const filePool = new Function(`${breakdownHelpers}; return fileObligationPool;`)();
  const firstFilePool = filePool(bundle.runs[0], "src/access.js");
  assert.equal(firstFilePool.kinds.branches.percentage, 50, "one observed decision outcome is half of branch coverage");
  assert.equal(firstFilePool.kinds.branches.total, bundle.runs[0].summary.coverage.branches.total);
  const optionSource = html.match(/const PROMPT_OPTIONS = ([\s\S]*?);\n    function promptMetric/)[1];
  for (const options of Object.values(new Function(`return (${optionSource})`)())) assert.equal(options.length, 2);

  // Nothing has been assessed here, so the run stands alone on the timeline
  // and the report says quality is missing rather than implying a zero.
  assert.equal(bundle.qualities.length, 0);
  assert.equal(bundle.timeline.length, 1);
  assert.equal(bundle.timeline[0].kind, "run");
  assert.equal(bundle.timeline[0].runId, bundle.runs[0].id);
  assert.equal(bundle.timeline[0].qualityId, null);
  assert.equal(bundle.selectedId, bundle.runs[0].id);
  // A run carries its own fingerprint as evidence, but it keys a build cache and
  // never pairs anything: that is decided per file.
  assert.match(bundle.runs[0].sourceFingerprint, /^[0-9a-f]{64}$/);
  assert.equal(bundle.timeline[0].sourceFingerprint, undefined);
  // Every run writes a map, so the section is carried. Nothing explains a flow
  // yet, so it reports that status and no percentage rather than a zero.
  const asserted = bundle.runs[0].assertions;
  assert.equal(asserted.available, true);
  assert.equal(asserted.summary.status, "notAssessed");
  assert.equal(asserted.summary.statements.percentage, null);
  assert.match(asserted.basis, /agent-assessed/);
  // The query path carries the map's absolute path; a shareable report must not.
  assert.equal(asserted.map, undefined);
  // A report is attached to pull requests; it must not carry a home directory.
  assert.doesNotMatch(JSON.stringify(bundle), /\/(Users|home)\/[a-z]/i);
  assert.equal(bundle.runs[0].sourceMode, "exact");
  assert.match(bundle.runs[0].sources["src/access.js"].contents, /hostile/);
  assert(bundle.runs[0].fileDetails["src/access.js"].gapLines.length > 0);

  // Syntax-checking the bundle proves it parses, not that it renders. A report
  // that throws on open still passes every text assertion above, so the last gate
  // actually opens it and fails on the first page error.
  // A second run, reaching the branch the first one left open, so the render gate
  // also exercises
  // the run-to-run comparison. With a single run that path never draws, and a
  // defect in it reaches a reader before it reaches this test.
  writeFileSync(
    resolve(project, "member.test.js"),
    [
      'import test from "node:test";',
      'import assert from "node:assert/strict";',
      'import { access } from "./src/access.js";',
      'test.skip("skipped access", () => {});',
      'test("member access", () => {',
      '  assert.equal(access(true, false), "visitor");',
      "});",
      "",
    ].join("\n"),
  );
  execFileSync(binary, ["--", "node", "--test"], { cwd: project, encoding: "utf8", stdio: "pipe" });
  execFileSync(
    binary,
    ["report", "--runs", "2", "--no-open", "--output", "report-two.html"],
    { cwd: project, encoding: "utf8", stdio: "pipe" },
  );
  const comparedPath = resolve(project, "report-two.html");

  // Security fixtures stay offline; the source digests must decide pairing.
  const securityId = "q_00000000000000bb";
  const securityDir = resolve(project, `.supercov/security/snapshots/${securityId}`);
  mkdirSync(securityDir, { recursive: true });
  writeFileSync(resolve(securityDir, "manifest.json"), JSON.stringify({
    id: securityId, created_at: "2026-09-23T12:00:00.000Z", instrument: "security",
    catalog_version: "security-v4", model: "jev-1.13.0", health: null,
    counts: { assessed: 3, flagged: 2 }, catalog: [{ check: "missing_authorization", cwe: ["CWE-862"] }],
  }));
  const extraSecurityFiles = ["clean", "sink", "failed"].map(name => {
    const contents = `export const ${name} = true;\n`;
    return { path: `src/${name}.js`, sha256: createHash("sha256").update(contents).digest("hex"), status: name === "failed" ? "failed" : "completed", present: [] };
  });
  const securityFiles = { files: [{ path: "src/access.js", sha256: sourceDigest, status: "completed",
    present: [{ check: "missing_authorization", value: 0.9, tier: "line", lines: [{ line: 2, text: "if (role === 'owner')", value: 0.9 }] }],
  }, ...extraSecurityFiles], paths: [{ check: "missing_authorization", caller: { file: "src/access.js", line: 2, function: "access" }, callee: { file: "src/sink.js", line: 1, function: "sink" } }] };
  writeFileSync(resolve(securityDir, "files.json"), JSON.stringify(securityFiles));
  const olderSecurityId = "q_00000000000000bc";
  const olderSecurityDir = resolve(project, `.supercov/security/snapshots/${olderSecurityId}`);
  mkdirSync(olderSecurityDir, { recursive: true });
  const olderManifest = JSON.parse(readFileSync(resolve(securityDir, "manifest.json"), "utf8"));
  olderManifest.id = olderSecurityId;
  olderManifest.created_at = "2026-09-23T11:00:00.000Z";
  writeFileSync(resolve(olderSecurityDir, "manifest.json"), JSON.stringify(olderManifest));
  writeFileSync(resolve(olderSecurityDir, "files.json"), JSON.stringify(securityFiles));
  execFileSync(binary, ["report", "--runs", "1", "--no-open", "--output", "security.html"], { cwd: project, stdio: "pipe" });
  const securityHtml = readFileSync(resolve(project, "security.html"), "utf8");
  const securityPayload = securityHtml.match(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/)[1].trim();
  const securityBundle = JSON.parse(gunzipSync(Buffer.from(securityPayload, "base64")).toString("utf8"));
  assert.equal(securityBundle.securities[0].id, securityId);
  assert.equal(securityBundle.timeline.find(item => item.runId)?.securityId, securityId);
  assert.equal(securityBundle.securities[0].health, null);
  assert.equal(securityBundle.securities.length, 2, "both saved audits remain available");
  assert.equal(securityBundle.timeline.filter(item => item.kind === "security").length, 0, "repeated audits of the same source do not create extra timeline rows");
  securityFiles.files[0].sha256 = "d".repeat(64);
  writeFileSync(resolve(securityDir, "files.json"), JSON.stringify(securityFiles));
  execFileSync(binary, ["report", "--runs", "1", "--no-open", "--output", "security-unpaired.html"], { cwd: project, stdio: "pipe" });

  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const rendered = {};
  try {
    const page = await browser.newPage();
    const failures = [];
    page.on("pageerror", error => failures.push(String(error)));
    page.on("console", message => { if (message.type() === "error") failures.push(message.text()); });
    await page.goto(`file://${comparedPath}`, { waitUntil: "load" });
    await page.waitForSelector(".instrument", { timeout: 15000 });
    assert.deepEqual(failures, [], "the report must open without a console or page error");
    await page.getByRole("button", { name: "View breakdown", exact: true }).click();
    Object.assign(rendered, await page.evaluate(() => ({
      headline: document.querySelector(".figure-unit")?.textContent ?? "",
      number: document.querySelector(".figure-number")?.textContent ?? "",
      metaCount: document.querySelector(".figure-sub .meta-count")?.textContent ?? "",
      metaNote: document.querySelector(".figure-sub .meta-note")?.textContent ?? "",
      kinds: [...document.querySelectorAll(".kind-row")].map(row => row.querySelector(".kind-name")?.textContent ?? ""),
      linked: document.querySelectorAll(".kind-row.go").length,
      marks: document.querySelectorAll(".jmark svg").length,
      gapCards: document.querySelectorAll(".obligation").length,
      // In light mode nothing may paint itself a dark block: the source listing and
      // the run record follow the theme like everything else.
      darkBlocks: (() => {
        document.documentElement.setAttribute("data-theme", "light");
        const tooDark = element => {
          const parsed = getComputedStyle(element).backgroundColor.match(/\d+/g);
          if (!parsed || parsed.length < 3) return false;
          if (parsed.length > 3 && Number(parsed[3]) === 0) return false;
          return (Number(parsed[0]) + Number(parsed[1]) + Number(parsed[2])) / 3 < 90;
        };
        return [...document.querySelectorAll(".record, .code, .prompt-command")].filter(tooDark).length;
      })(),
    })));
    // The share leads and the counts follow it, rather than a bare gap count.
    assert.equal(rendered.headline, "covered by tests");
    assert.match(rendered.number, /^\d+(\.\d)?%$/);
    assert.equal(rendered.metaCount, "");
    assert.equal(rendered.metaNote, "");
    assert.equal(await page.locator(".kind-share svg").count(), 5);
    assert.equal(await page.locator(".kind-left").count(), 0);
    assert.deepEqual(rendered.kinds, ["Lines", "Statements", "Branches", "MC/DC", "Functions"]);
    assert(rendered.linked > 0, "this fixture leaves work, so a kind must lead to it");
    assert(rendered.marks > 0, "the judgments must draw their marks");
    assert.equal(rendered.darkBlocks, 0, "light mode must not keep a dark block");
    assert.match(await page.locator(".run-test-summary").textContent(), /2 tests passed.*1 skipped/);
    assert.deepEqual(await page.locator(".overview-label").allTextContents(), ["Coverage", "Assertions", "Quality", "Security"]);
    assert.equal(await page.locator(".sidebar-foot").count(), 0);
    await page.getByRole("button", { name: "Close dialog", exact: true }).click();
    assert.equal(await page.getByRole("dialog").count(), 0);
    await page.getByRole("button", { name: "Test command", exact: true }).click();
    assert.match(await page.getByRole("dialog", { name: "Command", exact: true }).textContent(), /node --test/);
    assert.equal(await page.locator("#report-modal-title").evaluate(title => title === document.activeElement), true, "opening a modal focuses its heading, not its close button");
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("button", { name: "Copy command", exact: true }).count(), 0);
    assert.equal(await page.getByRole("button", { name: "Close dialog", exact: true }).evaluate(button => button === document.activeElement), true);
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("button", { name: "Close dialog", exact: true }).evaluate(button => button === document.activeElement), true, "Tab stays inside the modal");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(await page.getByRole("button", { name: "Test command", exact: true }).evaluate(button => button === document.activeElement), true, "closing the modal restores focus to its button");
    await page.getByRole("button", { name: "New run", exact: true }).click();
    const newRunPrompt = await page.getByRole("dialog", { name: "New run", exact: true }).locator(".improve-prompt").textContent();
    assert.match(newRunPrompt, /using Supercov run run_/);
    assert.match(newRunPrompt, /Current coverage: [\d.]+%/);
    assert.match(newRunPrompt, /Current assertions: Not measured/);
    assert.match(newRunPrompt, /new run with npx supercov/);
    assert.match(newRunPrompt, /Use the saved run’s test command/);
    assert.doesNotMatch(newRunPrompt, /node --test|Regenerate/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".record-context .record-command").count(), 1);
    assert.equal(await page.locator(".overview-files .overview-row:not(.overview-row-head)").count() > 0, true);
    const positions = await page.evaluate(() => ({
      metricsBottom: document.querySelector(".overview-metrics").getBoundingClientRect().bottom,
      summaryTop: document.querySelector(".run-test-summary").getBoundingClientRect().top,
    }));
    assert(positions.summaryTop >= positions.metricsBottom, "test result belongs below the two charts");
    // Picking a kind opens the files owing it, behind a scope the reader can see.
    await page.getByRole("button", { name: "View breakdown", exact: true }).click();
    await page.locator(".kind-row.go").first().click();
    await page.waitForSelector(".scope-note", { timeout: 15000 });
    const scoped = await page.evaluate(() => ({
      note: document.querySelector(".scope-note")?.textContent ?? "",
      rows: document.querySelectorAll(".file-row").length,
    }));
    assert.match(scoped.note, /still owes?\s+\d+/);
    assert.match(scoped.note, /Show every file/);
    assert(scoped.rows > 0, "a kind that leads somewhere must land on at least one file");
    assert.deepEqual(failures, [], "browsing the report must not raise an error");
    // Every column sorts, and the header says which one and in which direction.
    await page.click(".scope-note .link");
    await page.waitForSelector(".file-head-cell", { timeout: 15000 });
    const sorting = await page.evaluate(() => {
      const names = () => [...document.querySelectorAll(".file-row-name")].map(cell => cell.textContent);
      const header = label => [...document.querySelectorAll(".file-head-cell")].find(cell => cell.textContent.startsWith(label));
      const first = names();
      header("File").click();
      const byName = names();
      header("File").click();
      return { first, byName, reversed: names(), active: document.querySelector(".file-head-cell.active")?.textContent ?? "" };
    });
    assert(sorting.first.length > 0, "the file list must render rows to sort");
    assert.deepEqual(sorting.reversed, sorting.byName.slice().reverse(), "clicking a column twice reverses it");
    assert.match(sorting.active, /\u2191|\u2193/, "the active column must show its direction");
    // Walking the timeline renders the comparison between the two runs. Each click
    // re-renders, so the rows are looked up again rather than held as handles.
    const runCount = await page.locator(".run-item").count();
    assert(runCount >= 2, "both runs belong on the timeline");
    await page.locator(".run-item").nth(runCount - 1).click();
    await page.waitForTimeout(200);
    await page.locator(".run-item").nth(0).click();
    await page.waitForTimeout(200);
    assert.deepEqual(failures, [], "comparing two runs must not raise an error");

    // One compact gutter button opens both kinds of evidence, even on a line with no
    // assertion credit. Exercise real recorded gaps, attribution and flow links.
    await page.goto(`file://${resolve(project, "paired.html")}`, { waitUntil: "load" });
    await page.waitForSelector(".overview-sort");
    assert.equal(await page.getByText("Files to review", { exact: true }).count(), 0);
    assert.equal(await page.getByText("Lowest quality files", { exact: true }).count(), 0);
    const qualitySort = page.getByRole("button", { name: /^Quality.*Sort/ });
    await qualitySort.click();
    assert.match(await qualitySort.getAttribute("aria-label"), /sorted descending/);
    await qualitySort.click();
    assert.match(await qualitySort.getAttribute("aria-label"), /sorted ascending/);
    assert.equal(await page.locator(".concern-pill svg").count() > 0, true);
    assert.equal(await page.locator(".concern-pill .concern-value").count(), 0);
    assert.match(await page.locator(".concern-pill").first().getAttribute("title"), /0.95/);
    assert.equal(await page.locator(".overview-row .file-state-dot").first().isVisible(), false);
    assert.equal(await page.locator(".quality-scale-weak").count() > 0, true);
    assert.equal(await page.locator('.run-item[aria-current="true"] .run-metric').count(), 4);
    assert.equal(await page.locator(".run-context, .run-score, .run-dot").count(), 0);
    assert.equal(await page.locator('.run-item[aria-current="true"] .run-metric').nth(0).getAttribute("aria-label"), "Coverage: " + await page.locator('.overview-metric .figure-number').first().textContent());
    assert.equal(await page.locator(".jmark svg text").count(), 0, "quality gauges do not repeat score endpoints");

    await page.getByRole("button", { name: "Improve quality", exact: true }).click();
    assert.match(await page.locator(".improve-prompt").textContent(), /Current quality: 4\.8\/10 \(weak\)/);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });

    const assertionSort = page.getByRole("button", { name: /^Assertions.*Sort/ });
    await assertionSort.click();
    assert.match(await assertionSort.getAttribute("aria-label"), /sorted ascending/);
    await assertionSort.click();
    assert.match(await assertionSort.getAttribute("aria-label"), /sorted descending/);
    await page.getByRole("button", { name: "All files ›", exact: true }).click();
    assert.match(await page.locator(".file-head-cell.active").textContent(), /Assertions.*↓/);
    assert.equal(await page.locator(".file-table .file-row-name").first().textContent(), "src/access.js");
    assert.equal(await page.locator(".file-table .path-basename").first().textContent(), "access.js");
    await page.locator(".file-table .file-row").first().click();
    await page.getByRole("button", { name: "View breakdown", exact: true }).click();
    assert.equal(await page.locator(".breakdown-file").textContent(), "src/access.js");
    assert.equal(await page.locator(".kind-share svg").count(), 5);
    const fileRecord = paired.runs[0].files.find(file => file.file === "src/access.js");
    const totalStatements = paired.runs[0].fileTotals["src/access.js"].statements;
    const expectedStatements = Math.round((totalStatements - fileRecord.uncoveredStatements) / totalStatements * 1000) / 10;
    assert.equal(await page.locator(".kind-share > span:last-child").nth(1).textContent(), `${expectedStatements}%`);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await page.getByRole("button", { name: "Improve assertions for src/access.js", exact: true }).click();
    const improve = page.getByRole("dialog", { name: "Improve assertions", exact: true });
    assert.match(await improve.locator(".improve-prompt").textContent(), /src\/access\.js/);
    const improvePrompt = await improve.locator(".improve-prompt").textContent();
    assert.match(improvePrompt, /using Supercov run run_/);
    assert.match(improvePrompt, /Improve assertion coverage/);
    assert.match(improvePrompt, /Current assertions: [\d.]+%/);
    assert(improvePrompt.includes(`Current assertions: ${await page.locator(".detail-stat").nth(1).locator(".detail-stat-value").textContent()}`));
    assert(improvePrompt.length < 500, "agent prompts stay concise");
    assert.match(improvePrompt, /npx supercov/);
    assert.doesNotMatch(improvePrompt, /Recorded test command|Regenerate/);
    assert.equal(await improve.locator("#report-modal-title").evaluate(el => el === document.activeElement), true);
    await page.evaluate(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { window.copiedPrompt = text; } } }); });
    await improve.getByRole("button", { name: "Copy prompt", exact: true }).click();
    await page.waitForFunction(() => Boolean(window.copiedPrompt));
    assert.equal(await page.evaluate(() => window.copiedPrompt), await improve.locator(".improve-prompt").textContent());
    assert.equal(await improve.getByRole("button", { name: "Copied", exact: true }).count(), 1);
    assert.equal(await improve.getByText("Prompt copied.", { exact: true }).count(), 0);
    assert.equal(await improve.getByRole("radio").count(), 2);
    assert.equal(await improve.getByRole("group", { name: "Prompt language" }).count(), 0);
    assert.doesNotMatch(await improve.locator(".improve-prompt").textContent(), /\n/);
    await improve.getByRole("radio", { name: /Map assertions/ }).check();
    assert.match(await improve.locator(".improve-prompt").textContent(), /map existing assertions/);
    await improve.getByRole("button", { name: "Copy prompt", exact: true }).click();
    await page.waitForFunction(() => window.copiedPrompt.includes("map existing assertions"));
    assert.equal(await page.evaluate(() => window.copiedPrompt), await improve.locator(".improve-prompt").textContent());
    await page.keyboard.press("Escape");
    await improve.waitFor({ state: "detached" });
    assert.equal(await improve.count(), 0);
    await page.getByRole("button", { name: "Improve quality for src/access.js", exact: true }).click();
    assert.match(await page.locator(".improve-prompt").textContent(), /Current quality: 3\.5\/10 \(weak\)/);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await page.locator(".detail-stats").getByRole("button", { name: "Improve security for src/access.js", exact: true }).click();
    assert.match(await page.locator(".improve-prompt").textContent(), /Current security: Not assessed/);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    const coverageButton = page.locator('.code-row[data-line="3"] .code-evidence');
    assert.equal(await page.locator('.code-row[data-line="3"] button').count(), 1, "the gutter is one keyboard stop");
    const assertionButton = page.locator('.code-row[data-line="3"] .code-assert');
    await coverageButton.click();
    const evidence = page.getByRole("region", { name: "Evidence for line 3", exact: true });
    assert.deepEqual(await evidence.locator("h4").allTextContents(), ["Coverage", "Assertions"]);
    assert.match(await evidence.locator(".line-test-name").textContent(), /owner access/);
    assert.match(await evidence.locator(".annotation-title").first().textContent(), /./);
    assert.match(await evidence.textContent(), /assert.match/);
    assert.match(await evidence.textContent(), /Missing/);
    assert.equal(await coverageButton.getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator('.code-row[data-line="3"] .code-state').count(), 1);
    await assertionButton.click();
    assert.equal(await evidence.count(), 0, "clicking the gutter again closes its panel");
    await coverageButton.focus();
    await page.keyboard.press("Enter");
    assert.equal(await evidence.count(), 1, "gutter evidence is keyboard accessible");
    await evidence.getByRole("button", { name: "Close", exact: true }).click();
    await page.locator('.code-row[data-line="4"] .code-evidence').click();
    assert.match(await page.getByRole("region", { name: "Evidence for line 4", exact: true }).textContent(), /No recorded assertion links/);
    await page.locator(".file-assertions .evidence-row").first().click();
    assert.equal(await evidence.count(), 1, "a file assertion jumps to its credited source line");
    assert.equal(await page.locator('.code-row[data-line="3"]').evaluate(row => row.classList.contains("selected")), true);
    assert.match(await page.locator(".file-quality .quality-concern").textContent(), /Long method/);
    assert.match(await page.locator(".file-quality .quality-concern-value").textContent(), /0.95/);
    assert.equal(await page.getByText("Assessment details", { exact: true }).count(), 0);
    assert.match(await page.locator(".file-quality .quality-rating").textContent(), /weak/);
    assert.deepEqual(await page.locator(".detail-stat-label").allTextContents(), ["Coverage", "Assertions", "Quality", "Security"]);
    assert.equal(await page.locator(".detail-stat-note").count(), 0);
    assert.match(await page.locator(".file-security").textContent(), /Not assessed/);
    assert.equal(await page.locator(".detail-stats").getByRole("img", { name: "Security: not assessed", exact: true }).count(), 1);
    assert.deepEqual(await page.locator(".detail-view > .detail-card").evaluateAll(cards => cards.map(card => card.querySelector("h3")?.textContent)), ["Tests covering this file", "Assertions", "Quality", "Security"]);
    assert.equal(await page.locator(".file-tests .evidence-row").count(), 1);
    await page.locator(".file-tests .evidence-row").first().click();
    assert.match(await page.locator(".test-detail-header.detail-card .detail-heading").textContent(), /owner access/);
    assert.equal(await page.locator(".test-covered-files.detail-card .relation-row").count(), 1);
    assert.equal(await page.locator("details, summary").count(), 0);
    await page.goBack();
    await page.locator(".file-tests .overview-footer .link").click();
    assert.match(await page.locator(".file-list-head").textContent(), /access.js/);
    assert.equal(await page.locator(".test-table .file-row").count(), 1);
    await page.locator(".test-table .file-row").click();
    assert.equal(await page.locator(".test-table .test-row").count(), 1);
    await page.locator(".test-table .test-row").click();
    assert.equal(await page.locator(".test-detail-header.detail-card").count(), 1);
    assert.equal(await page.locator("details, summary").count(), 0);
    assert.deepEqual(failures, [], "source evidence and file previews must navigate without errors");
    await page.goto(`file://${resolve(project, "unpaired.html")}`, { waitUntil: "load" });
    await page.waitForSelector(".run-item");
    const qualityOnly = await page.locator(".run-item").evaluateAll(items => items.findIndex(item => item.querySelector('.run-metric[aria-label="Coverage: Not assessed"]') && !item.querySelector('.run-metric[aria-label="Quality: Not assessed"]')));
    assert(qualityOnly >= 0, "the unmatched quality assessment stays on the timeline");
    await page.locator(".run-item").nth(qualityOnly).click();
    assert.equal(await page.locator('.overview-metric').getByRole("img", { name: "Coverage: not measured", exact: true }).count(), 1);
    assert.equal(await page.locator('.overview-metric').getByRole("img", { name: "Assertions: not measured", exact: true }).count(), 1);
    await page.getByRole("button", { name: "New run", exact: true }).click();
    const firstRunPrompt = await page.getByRole("dialog", { name: "New run", exact: true }).locator(".improve-prompt").textContent();
    assert.match(firstRunPrompt, /no Supercov coverage run is recorded yet/);
    assert.match(firstRunPrompt, /Current coverage: Not measured/);
    assert.match(firstRunPrompt, /Current assertions: Not measured/);
    assert.match(firstRunPrompt, /Quality assessment:/);
    assert.doesNotMatch(firstRunPrompt, /saved run’s test command/);
    await page.keyboard.press("Escape");
    await page.getByRole("tab", { name: "Files", exact: true }).click();
    assert.deepEqual(await page.locator(".file-head-cell").allTextContents(), ["File", "Coverage", "Assertions", "Quality ↑", "Security"]);
    assert.equal(await page.locator(".file-row").first().locator(".file-row-mark").count(), 4);
    await page.locator(".file-row").first().click();
    assert.equal(await page.locator(".detail-stat-line .jmark").count(), 4);
    assert.deepEqual(failures, [], "unmeasured states preserve the report layout");
    // Narrow lists retain their metrics and navigation without horizontal scrolling.
    const checkMobileList = async selector => {
      const issues = await page.locator(selector).evaluateAll(elements => elements.flatMap(element => {
        const box = element.getBoundingClientRect();
        return element.scrollWidth > element.clientWidth + 1 || box.right > innerWidth + 1
          ? [`${element.className}: ${element.scrollWidth}/${element.clientWidth}`] : [];
      }));
      assert.deepEqual(issues, [], `${selector} must fit the mobile viewport`);
    };
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.getByRole("tab", { name: "Files", exact: true }).click();
      await checkMobileList(".file-table, .file-row, .file-row-marks");
      assert.equal(await page.locator(".file-row").first().locator(".mobile-metric-label:visible").count(), 4);
      await page.getByRole("tab", { name: "Overview", exact: true }).click();
      await checkMobileList(".overview-files, .overview-row");
      await page.goto(`file://${comparedPath}`, { waitUntil: "load" });
      await page.waitForSelector(".overview-row");
      await checkMobileList(".overview-files, .overview-row");
      assert.equal(await page.locator(".overview-row:not(.overview-row-head)").first().locator(".mobile-metric-label:visible").count(), 2);
      await page.locator(".overview-row-head").first().getByRole("button", { name: /^File/ }).click();
      await page.getByRole("tab", { name: "Files", exact: true }).click();
      await checkMobileList(".file-table, .file-row, .file-row-marks");
      await page.locator(".file-row").first().click();
      await checkMobileList(".evidence-list, .evidence-row");
      await page.getByRole("tab", { name: "Tests", exact: true }).click();
      await checkMobileList(".test-table, .file-row");
      await page.locator(".test-table .file-row").first().click();
      await checkMobileList(".test-table, .test-row");
      await page.locator(".test-table .test-row").first().click();
      await checkMobileList(".relation-row");
    }
    assert.deepEqual(failures, [], "mobile sorting and navigation must work without errors");
    await page.goto(`file://${resolve(project, "security.html")}`, { waitUntil: "load" });
    await page.waitForSelector('.overview-card[aria-label="Security"]');
    const securityCard = page.locator('.overview-card[aria-label="Security"]');
    assert.match(await securityCard.textContent(), /2 files flagged/);
    assert.equal(await page.locator('.run-item[aria-current="true"] .run-metric[aria-label="Security: 2 files flagged"]').count(), 1);
    await securityCard.getByRole("button", { name: "All files ›", exact: true }).click();
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.equal(await page.locator('.file-head-cell[aria-sort="descending"]').textContent(), "Security↓");
    assert.equal(await page.locator('.file-row').first().getByRole("img", { name: "Security: 2 findings", exact: true }).count(), 1);
    assert.match(await page.locator('.cross-file-findings').textContent(), /missing authorization/);
    const securityOrder = () => page.locator('.file-row .file-row-identity').allTextContents();
    assert.deepEqual(await securityOrder(), ["src/access.js", "src/sink.js", "src/clean.js", "src/failed.js"]);
    await page.locator('.file-head-cell').filter({ hasText: "Security" }).click();
    assert.deepEqual(await securityOrder(), ["src/clean.js", "src/sink.js", "src/access.js", "src/failed.js"]);
    assert.equal(await page.locator('.file-row').first().getByRole("img", { name: "Security: no findings", exact: true }).count(), 1);
    assert.equal(await page.locator('.file-row').last().getByRole("img", { name: "Security: assessment failed", exact: true }).count(), 1);
    await page.locator('.cross-file-findings .security-file-link').last().click();
    assert.equal(await page.locator('.detail-heading').textContent(), "src/sink.js");
    assert.match(await page.locator('.file-security').textContent(), /1 finding/);
    await page.getByRole("button", { name: "‹ All files", exact: true }).click();
    await checkMobileList(".file-table, .file-row, .file-row-marks, .cross-file-findings");
    await page.locator('.cross-file-findings .security-file-link').first().click();
    assert.match(page.url(), /src%2Faccess.js/);
    assert.match(await page.locator('.file-security').textContent(), /CWE-862/);
    assert.match(await page.locator('.file-security').textContent(), /Confirmed at a line/);
    assert.match(await page.locator('.file-security').textContent(), /Cross-file paths/);
    await page.getByRole("tab", { name: "Overview", exact: true }).click();
    assert.doesNotMatch(await securityCard.textContent(), /security-v4|jev-1.13.0|exploitability/);
    await securityCard.locator(".evidence-row").first().click();
    assert.equal(await page.getByRole("dialog").count(), 0);
    assert.match(page.url(), /#explore\/.*\/src%2Faccess.js/);
    assert.equal(await page.locator(".detail-heading").textContent(), "src/access.js");
    assert.match(await page.locator(".file-security").textContent(), /missing authorization/);
    await page.getByRole("button", { name: "Improve security for src/access.js", exact: true }).first().click();
    assert.match(await page.locator(".improve-prompt").textContent(), /npx supercov security/);
    assert.match(await page.locator(".improve-prompt").textContent(), /Current security: 2 findings/);
    await page.keyboard.press("Escape");
    await page.goto(`file://${resolve(project, "security-unpaired.html")}#review/${securityId}`, { waitUntil: "load" });
    await page.waitForSelector('.overview-card[aria-label="Security"]');
    assert.equal(await page.locator('.run-item[aria-current="true"] .run-metric[aria-label="Security: 2 files flagged"]').count(), 1);
    assert.equal(await page.locator('.overview-metric').getByRole("img", { name: "Coverage: not measured", exact: true }).count(), 1);
    await page.locator('.overview-card[aria-label="Security"]').getByRole("button", { name: "All files ›", exact: true }).click();
    assert.deepEqual(await securityOrder(), ["src/access.js", "src/sink.js", "src/clean.js", "src/failed.js"]);
    await page.locator('.file-head-cell').filter({ hasText: "Security" }).click();
    assert.deepEqual(await securityOrder(), ["src/clean.js", "src/sink.js", "src/access.js", "src/failed.js"]);
    await checkMobileList(".file-table, .file-row, .file-row-marks, .cross-file-findings");
    await page.locator('.file-row').filter({ hasText: "src/access.js" }).click();
    assert.match(await page.locator(".file-security").textContent(), /missing authorization/);
    assert.deepEqual(failures, [], "security findings and standalone assessments render without errors");



  } finally {
    await browser.close();
  }

  console.log(
    `[html-report] generated, decoded, syntax-checked and rendered ${statSync(reportPath).size} byte portable report (${rendered.marks} marks, ${rendered.linked} kinds with work left)`,
  );
} finally {
  rmSync(project, { recursive: true, force: true });
}
