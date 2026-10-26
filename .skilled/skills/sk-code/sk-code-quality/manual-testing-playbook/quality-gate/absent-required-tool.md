---
id: CQ-006
category: quality_gate
title: 'Absent required tool reports unverified'
description: "This scenario validates the gate run for `CQ-006`. It builds fixture F06, a temporary repository whose committed config names a required P0 check for a tool that is not installed, and confirms the row reads `SKIPPED_ABSENT` with a repair line, the run is UNVERIFIED with exit 4, and the envelope keeps the changed file and makes no pass claim."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - references/quality-config.md
  - scripts/quality-gate.cjs
version: 1.1.3.0
---

# CQ-006: Absent Required Tool Reports Unverified

This document captures the run contract, execution process, source anchors and metadata for `CQ-006`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-006`. Fixture F06 commits one repository config, `.sk-code/quality.json`, that names a single required P0 check, then seeds one changed function in `app.go`. The tool the check names is not installed, so the check cannot start. The runner contract says a required check that produced no evidence reads `SKIPPED_ABSENT` with a repair row, and the run is `UNVERIFIED` with exit 4.

The scenario renders both forms the operator uses. The JSON verdict carries the check row, the repair text and the unverified list. The envelope carries the gate, the exit code, the changed file and the handoff field the verify workflow reads, and it carries no pass status.

### Why This Matters

An absent tool is the cheapest way to claim a gate that never ran. The tool is missing on one machine and present on another, so the same command can read clean here and fail in CI. If the run folded that absence into `NO_BLOCKER_FOUND`, an author would record a pass over a check that never executed. Exit 4 exists to make that impossible, and the repair line exists so the author knows whether to install the tool or drop the check.

The scenario also pins the boundary between the two failure kinds. A missing tool is not a blocker, so `p0_blocking` stays 0 even though the check is P0 and required. It is an evidence gap, and the unverified list is the only field that names it.

---

## 2. SCENARIO CONTRACT

Operators confirm that the absent-tool change returns `UNVERIFIED` with exit 4, that the check row reads `SKIPPED_ABSENT` with its repair text, and that the run makes no clean or blocked claim.

- Objective: confirm the gate value, the exit code, the check row, the repair text, the unverified list and the envelope fields for fixture F06.
- Real user request: `Our repository requires a lint tool that is not installed on this machine. Run the quality gate before I claim done.`
- Prompt: `Run the quality gate with our required lint check missing and tell me what it means.`

**Exact prompt**:

```text
Run the quality gate with our required lint check missing and tell me what it means.
```

- Fixture: F06, built in a temporary git repository outside the working tree, from the fixture builder the runner suite uses. The base commit holds a clean `app.go` and the committed config. The change adds one function to `app.go`, so one line counts as changed. The configured check is required because it is P0 and states no `required: false`.

| Fixture part | Content | What the run must say |
| --- | --- | --- |
| `.sk-code/quality.json` | one check, `id` `absent-tool`, `argv` of the absent tool and `{files}`, severity `P0` | the row is `SKIPPED_ABSENT`, required, and names the tool in `requires` |
| the tool | absent from `PATH` | the check never starts, and the run is unverified rather than clean |
| `app.go` | one added function on a new line | the changed file appears in `scope.files` and in the envelope's `modified_files` |

- Expected execution process: the operator replays the F06 case, reads the fixture block that case builds, then builds the same fixture by hand, renders the envelope and the JSON verdict, and reads the fields the table names. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate` is `UNVERIFIED`, `exit_code` is `4`, the check row reads `SKIPPED_ABSENT` with `required` true and the tool in `requires`, `summary.unverified` holds `absent-tool`, `summary.p0_blocking` is `0`, and the envelope reads `status: advisory`.
- Desired user-visible outcome: the author installs the tool or removes the check, and never records the run as a pass while the evidence gap stands.
- Pass/fail: PASS if every value in the expected-result table below holds, the command exits 0 and both snapshot checks pass, and no transcript line claims a pass. FAIL if the gate is `NO_BLOCKER_FOUND`, the row reads another state, the unverified list is empty, the repair text is missing, or a snapshot check throws.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate with our required lint check missing and tell me what it means.`

### Commands

Run the commands from the repository root in one shell session, so the variables set in step 3 stay defined.

1. `node --test --test-reporter=tap --test-name-pattern='^F06' .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs`
2. `sed -n "/^test('F06/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/configured-checks.test.cjs`
3. Confirm the tool is absent, then build fixture F06 by hand, render both forms and assert the fields.

```bash
TMP="$(mktemp -d)"
command -v sk-code-absent-tool || echo absent
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const repo = buildRepo({
  base: {
    "app.go": "package a\n\nfunc A() {}\n",
    ".sk-code/quality.json": JSON.stringify({ schemaVersion: 1, checks: [{ id: "absent-tool", argv: ["sk-code-absent-tool", "{files}"], severity: "P0" }] }, null, 2) + "\n",
  },
  change: { "app.go": "package a\n\nfunc A() {}\nfunc B() {}\n" },
});
try {
  const envelopeRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "envelope"]));
  const jsonRun = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = jsonRun.verdict;
  const row = verdict.checks.find((entry) => entry.id === "absent-tool");
  assert.equal(envelopeRun.status, 4);
  assert.equal(verdict.gate, "UNVERIFIED");
  assert.deepEqual([row.state, row.required, row.requires], ["SKIPPED_ABSENT", true, "sk-code-absent-tool"]);
  assert.match(row.repair, /^install .+ or remove the check from \.sk-code\/quality\.json$/);
  assert.deepEqual(verdict.summary.unverified, ["absent-tool"]);
  assert.equal(verdict.summary.p0_blocking, 0);
  fs.writeFileSync(process.argv[1] + "/envelope.txt", envelopeRun.stdout);
  fs.writeFileSync(process.argv[1] + "/verdict.json", jsonRun.stdout);
  process.stdout.write(envelopeRun.stdout);
  console.log("gate " + verdict.gate + " exit " + envelopeRun.status);
  console.log("row " + row.state + " required " + row.required + " requires " + row.requires);
  console.log("repair " + row.repair);
  console.log("unverified " + verdict.summary.unverified.join(","));
  console.log("p0_blocking " + verdict.summary.p0_blocking);
} finally {
  repo.cleanup();
}
' "$TMP"
echo "exit $?"
```

4. `for p in references/runner-contract.md references/quality-config.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F06 and prints `# pass 1` then `# fail 0`. Step 2 shows the config row, the absent tool name and the four assertions: the exit code, the gate, the row and the unverified list. Step 3 prints `absent`, then the envelope, then `gate UNVERIFIED exit 4`, `row SKIPPED_ABSENT required true requires sk-code-absent-tool`, the repair line, `unverified absent-tool` and `p0_blocking 0`, and the command exits 0. Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | `UNVERIFIED` |
| `exit_code` | `4` |
| check `state` | `SKIPPED_ABSENT` |
| check `required` | `true` |
| check `requires` | `sk-code-absent-tool` |
| check `repair` | `install 'sk-code-absent-tool' or remove the check from .sk-code/quality.json` |
| `summary.unverified` | `["absent-tool"]` |
| `summary.p0_blocking` | `0` |
| envelope `modified_files` | `app.go` |
| envelope `checker_outputs` | `gate=UNVERIFIED exit=4 p0_blocking=0 unverified=absent-tool`, then `unchecked=` and the three layer states |
| envelope `status` | `advisory` |
| envelope `verification_handoff` | `workflow-verify.md` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the check row quoted with `state`, `required`, `requires` and `repair`, the envelope with its `checker_outputs` and `modified_files` lines, both `exit 4` lines, the unverified list, and the command's exit 0, which is the result of both snapshot checks. Read every transcript line for a passing claim before the verdict is recorded, because this is the scenario where a pass claim would be most tempting. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the gate is `UNVERIFIED`, exit is `4`, the check row reads `SKIPPED_ABSENT` with its tool and repair text, the unverified list names `absent-tool`, `p0_blocking` is `0`, the envelope keeps `app.go` and reads `advisory`, and the command exits 0 with both snapshot checks passed.
- **Fail**: the gate is `NO_BLOCKER_FOUND`, the row reads `RAN_CLEAN` or `RAN_FAIL`, the unverified list is empty, the repair text is missing, a snapshot check throws, or any transcript line claims a pass.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which of the four F06 assertions failed.
2. If the row reads `RAN_CLEAN`, the tool was found on `PATH`. Run step 3's `command -v` line again and check the shell and the hook that started the session, because a tool installed after the session began is still invisible to a cached `PATH`.
3. If the run is `ERROR` with `GUARD_UNAVAILABLE`, the fixture is not a git repository. A configured check outside git never starts, so the fixture must be built with `git: true`, which is the builder default.
4. If the row reads `SKIPPED_BY_FLAG`, a switch turned the check off. `--only`, `--skip` and the hook flags are the three causes the runner contract names, and each one also reads unverified, so confirm which one before recording the row.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §3 | The gate workflow line that reads `UNVERIFIED` as an open claim rather than a pass |
| [configured-checks.test.cjs](../../scripts/tests/configured-checks.test.cjs) | The F06 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §2 and §3 | The exit codes, the check states, the repair field and the unverified list |
| [quality-config.md](../../references/quality-config.md) §3 | The `checks` schema the fixture config uses |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/absent-required-tool.md`
