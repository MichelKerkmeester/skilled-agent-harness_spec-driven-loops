---
id: CQ-011
category: quality_gate
title: 'A multi-file change gets one syntax finding per bad file from the parallel pool'
description: "This scenario validates the gate run for `CQ-011`. It builds a temporary repository with twenty changed `.mjs` files, two of them with a syntax error, and confirms the `syntax-node` check reports exactly one finding per bad file, reads every other file clean and ends inside its deadline. It then drives the pool helper directly to confirm input-order records and the usage error for a payload that is not JSON."
expected_intent: QUALITY
expected_resources:
  - scripts/lib/parallel-node-check.cjs
  - references/runner-contract.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.1.4.0
---

# CQ-011: A Multi-File Change Gets One Syntax Finding Per Bad File From The Parallel Pool

This document captures the run contract, execution process, source anchors and metadata for `CQ-011`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-011`. The `syntax-node` check runs `node --check` once per changed `.js` or `.mjs` file, and it starts those commands through one helper, `parallel-node-check.cjs`, that holds a bounded pool of children under a single deadline. The helper keeps the per-file command, the result and the order exactly as a sequential loop produced them and overlaps only the waiting, so the parent rebuilds its findings from the same evidence.

The fixture changes twenty `.mjs` files, two with a syntax error, which is more files than the pool holds at once. The scenario reads the check row and the findings the gate reports, and then starts the helper by hand to read its two contracts: one record per input file in input order, and a usage error for a file list that is not JSON.

### Why This Matters

The pool exists because one interpreter start per file made a large change slow, and a speed-up that loses a file or reorders a result is worse than the slowness. A file dropped from the pool reads as clean when it never ran. A record attached to the wrong file blames the wrong author. A pool with no shared deadline lets one hung file hold the check past its budget.

The scenario pins what must not change. Two bad files give exactly two findings, each naming its own file, and the eighteen good files give none. The row keeps its `RAN_FAIL` state and the count of files it read. The helper's refusal of a malformed payload is pinned too, because the parent treats any output it cannot parse as a check that did not return, and a helper that guessed at a bad payload would hide that.

---

## 2. SCENARIO CONTRACT

Operators confirm that a twenty-file change with two syntax errors yields exactly two `syntax-node` findings naming those files, that the check row counts all twenty files and ends inside its deadline, and that the helper returns ordered records and refuses a payload that is not JSON.

- Objective: confirm the finding count and names, the check row state, file count and duration, the helper's record order and the helper's usage error.
- Real user request: `I changed twenty modules and two of them may have syntax errors. Run the quality gate before I claim done.`
- Prompt: `Run the quality gate on my twenty changed modules and tell me which ones fail the syntax check.`

**Exact prompt**:

```text
Run the quality gate on my twenty changed modules and tell me which ones fail the syntax check.
```

- Fixture: a temporary git repository outside the working tree, built from the fixture builder the runner suite uses. The change adds twenty files, the first and last of them `<fixture>/pool/f01.mjs` and `<fixture>/pool/f20.mjs`. The fourth and seventeenth hold `export const broken = ;`, and the other eighteen hold a valid export.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| `<fixture>/pool/f04.mjs`, `<fixture>/pool/f17.mjs` | `export const broken = ;` | one `syntax.mjs` finding each, P0, exact, check `syntax-node`, line 1 |
| the other eighteen files | a valid `export const` line | no finding |
| run deadline | `--timeout 30` | the `syntax-node` row ends well under 30 seconds |
| helper payload | a JSON array of paths, then the text `not json` | ordered records, then the usage error and exit 2 |

- Expected execution process: the operator replays the helper's unit cases, builds the fixture by hand, runs the gate in JSON with a 30 second per-check deadline and reads the findings and the check row. The operator then starts the helper directly with a JSON payload and again with a payload that is not JSON. The gate run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: the gate is the blocking value with exit `1`, the `syntax-node` row is `RAN_FAIL` with `files` `20` and a `duration_ms` under the deadline, and the findings are exactly two, for the fourth and seventeenth files. The helper prints a two-element JSON array whose `file` fields follow the input order, with `status` `0` for the good file and a non-zero `status` for the bad one. The helper given `not json` writes `the file list was not JSON` to stderr and exits `2`.
- Desired user-visible outcome: the author fixes exactly the two named files, and no file is blamed twice or skipped.
- Pass/fail: PASS if every value in the expected-result table below holds, the command exits 0 and the snapshot check passes. FAIL if any good file carries a finding, a bad file is missing or repeated, the row is not `RAN_FAIL`, the row's file count is not 20, the run exceeds its deadline, the helper's records are out of order, or the helper accepts the malformed payload.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my twenty changed modules and tell me which ones fail the syntax check.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs`
2. `sed -n "1,60p" .skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs`
3. Build the fixture by hand, run the gate, drive the helper directly and assert the fields.

```bash
TMP="$(mktemp -d)"
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const change = {};
for (let i = 1; i <= 20; i += 1) {
  const name = "pool/f" + String(i).padStart(2, "0") + ".mjs";
  change[name] = (i === 4 || i === 17) ? "export const broken = ;\n" : "export const v" + i + " = " + i + ";\n";
}
const repo = buildRepo({ change });
try {
  const run = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json", "--timeout", "30"]));
  const verdict = run.verdict;
  const row = verdict.checks.find((entry) => entry.id === "syntax-node");
  const found = verdict.findings.filter((entry) => entry.check === "syntax-node").map((entry) => entry.file).sort();
  assert.equal(run.status, 1);
  assert.equal(verdict.summary.p0_blocking, 2);
  assert.deepEqual([row.state, row.files], ["RAN_FAIL", 20]);
  assert.ok(row.duration_ms < 30000, "the syntax-node row outlived its deadline");
  assert.deepEqual(found, ["pool/f04.mjs", "pool/f17.mjs"]);
  assert.equal(verdict.findings.length, 2);
  assert.ok(verdict.findings.every((entry) => entry.rule === "syntax.mjs" && entry.severity === "P0" && entry.confidence === "exact"));
  console.log("blocking gate exit " + run.status + " p0_blocking " + verdict.summary.p0_blocking);
  console.log("row " + row.state + " files " + row.files + " within deadline");
  console.log("findings " + found.join(","));
} finally {
  repo.cleanup();
}
const helper = path.join(Q, "lib/parallel-node-check.cjs");
fs.writeFileSync(path.join(process.argv[1], "good.mjs"), "export const ok = 1;\n");
fs.writeFileSync(path.join(process.argv[1], "bad.mjs"), "export const broken = ;\n");
const files = [path.join(process.argv[1], "bad.mjs"), path.join(process.argv[1], "good.mjs")];
const ordered = spawnSync(process.execPath, [helper, process.execPath, "2", "30000"], { input: JSON.stringify(files), encoding: "utf8" });
assert.equal(ordered.status, 0);
const records = JSON.parse(ordered.stdout);
assert.deepEqual(records.map((record) => record.file), files);
assert.notEqual(records[0].status, 0);
assert.equal(records[1].status, 0);
console.log("helper records in input order: bad then good");
const refused = spawnSync(process.execPath, [helper, process.execPath, "2", "30000"], { input: "not json", encoding: "utf8" });
assert.equal(refused.status, 2);
assert.match(refused.stderr, /the file list was not JSON/);
console.log("helper exit " + refused.status + ": " + refused.stderr.trim().split(":").slice(0, 2).join(":"));
' "$TMP"
echo "exit $?"
```

4. `for p in scripts/lib/parallel-node-check.cjs references/runner-contract.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`
5. Clean up: `rm -rf "$TMP"`

### Expected

Step 1 replays the helper's unit cases and prints `# fail 0`. Step 2 shows the helper's header comment: one `node --check` per file, a bounded pool, one record per input file in input order, and the usage line. Step 3 prints `blocking gate exit 1 p0_blocking 2`, `row RAN_FAIL files 20 within deadline`, `findings` followed by the two bad file names, `helper records in input order: bad then good` and a `helper exit 2` line carrying `the file list was not JSON`, and the command exits 0. Step 4 prints `OK` for all three paths. Step 5 prints nothing and leaves no scratch folder behind.

| Signal | Expected value |
| --- | --- |
| `gate` | the blocking value, exit `1` |
| `summary.p0_blocking` | `2` |
| `exit_code` | `1` |
| `syntax-node` row `state` | `RAN_FAIL` |
| `syntax-node` row `files` | `20` |
| `syntax-node` row `duration_ms` | under the 30 second deadline |
| findings | exactly two, for the fourth and seventeenth files |
| each finding | rule `syntax.mjs`, severity `P0`, confidence `exact`, check `syntax-node` |
| findings for the eighteen good files | none |
| helper records for a two-file payload | two, in input order, bad file with a non-zero `status`, good file with `status` `0` |
| helper given a payload that is not JSON | exit `2`, stderr holds `the file list was not JSON` |
| fixture snapshot after the gate run | unchanged |

### Evidence

Command transcript from steps 1 to 5, the frontmatter block with `expected_intent: QUALITY`, the check row quoted with `state`, `files` and `duration_ms`, the two finding file names, the helper's two outputs, and the command's exit 0, which is the result of the snapshot check and every assertion. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the gate is the blocking value with exit `1`, the `syntax-node` row is `RAN_FAIL` over 20 files inside its deadline, exactly the two bad files are named once each as `syntax.mjs` P0 findings, the helper returns its records in input order and refuses the malformed payload with exit `2`, and the command exits 0 with the snapshot check passed.
- **Fail**: a good file carries a finding, a bad file is missing or named twice, the row file count differs from 20, the row reads `TIMEOUT` or `ERROR`, the helper's records are out of order, the helper accepts the malformed payload, or the snapshot check throws.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which helper case failed.
2. If the `syntax-node` row reads `ERROR` with no findings, the parent could not parse the helper's output, which it reports as a check that never returned. Run the helper by hand as step 3 does and read its stderr.
3. If the row reads `TIMEOUT`, the shared deadline passed. Raise `--timeout` and rerun, and confirm no single file is hanging `node --check`.
4. If a bad file is missing from the findings, compare the `files` count with the changed count. A file the runner does not read, such as one under an excluded folder, never reaches the pool.
5. If the helper exits 1 rather than 2 for a payload that is not JSON, the usage guard moved after the pool started. Read the helper's `main` function.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
| --- | --- |
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: no entry; the nearest is [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog describes the runner and its built-in checks, and names no pool entry |

### Implementation And Test Anchors

| File | Role |
| --- | --- |
| [SKILL.md](../../SKILL.md) §4 | The gate workflow line that treats a blocking run as a stop before completion |
| [parallel-node-check.cjs](../../scripts/lib/parallel-node-check.cjs) | The bounded pool helper, its input-order records and its usage errors |
| [parallel-node-check.test.cjs](../../scripts/tests/parallel-node-check.test.cjs) | The helper unit cases this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §2 and §5 | The built-in `syntax-node` check and the `syntax.mjs` rule |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The parent that starts the helper once, reads its records and builds the findings |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/parallel-syntax-pool.md`
