---
id: CQ-023
category: quality_gate
title: 'The quality doctor shows the seats, the override rows and the disabled rules'
description: "This scenario validates the quality target of `/doctor:sk-code` for `CQ-023`. It runs `status` over a repository config that names one checklist and switches one hygiene rule off, and reads the seat list, both override rows, the disabled-rule list and the refusal `init` gives an existing config."
expected_intent: QUALITY
expected_resources:
  - references/quality-config.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.0.0.0
---

# CQ-023: The Quality Doctor Shows The Seats, The Override Rows And The Disabled Rules

This document captures the doctor contract, execution process, source anchors and metadata for `CQ-023`.

---

## 1. OVERVIEW

This scenario validates the quality target of `/doctor:sk-code` for `CQ-023`. The doctor is the surface that shows a whole repository what the gate would apply: every checklist with the seat that declared it, each `## Rule overrides` row or the reason a section was refused, the same-level conflicts, and the hygiene rules in force. It reads the config through the same module the runner uses and asks the runner for the checklist view through `--explain` over a sample of the tree, so it never keeps a second copy of discovery.

Its three modes each end with a `STATUS=` line. `status` reports the source, the trust state, a `PASS` or `DEGRADED` line per tool a check names, the layers, the disabled rules and the `applies` block. `check` validates the discovered config with no tool probe. `init` prints the template filled with the suggestions and writes nothing unless `--apply` is passed, and `--apply` refuses with `CONFIG_EXISTS` rather than overwrite a file that exists.

The scenario runs `status` over a config that names one checklist with two override rows and switches one hygiene rule off, then runs `init --apply` over the same repository.

### Why This Matters

The doctor is where an operator reads the whole repository's quality state before trusting it, and it is the only place a repository's own checklist seats, refused sections and disabled rules appear together. Its two failure directions are both quiet. A status that omitted a refused section would show a repository whose rules do not apply as one whose rules apply. An `init --apply` that overwrote an existing file would destroy the review of a committed config, which is why the refusal is a documented exit code rather than a prompt.

---

## 2. SCENARIO CONTRACT

Operators confirm that `status` names both seats, both override rows and the disabled rule, and that `init --apply` refuses to touch an existing config.

- Objective: confirm the `STATUS=` lines, the seat of each checklist, the override rows, the disabled and active hygiene rules, and the refusal code.
- Real user request: `Show me what the quality gate would apply in this repository before I trust it, then tell me whether the doctor would write a config over the one we have.`
- Prompt: `Show me the quality gate config the doctor reads for this repository and tell me whether init would overwrite it.`

**Exact prompt**:

```text
Show me the quality gate config the doctor reads for this repository and tell me whether init would overwrite it.
```

- Fixture: one temporary git repository outside the working tree whose committed config names one checklist by `.js` extension and switches the issue rule off. The checklist carries two `none` rows, one for the documentation rule and one for the issue rule.

| Fixture part | Content | What the doctor must say |
| --- | --- | --- |
| the config | `<fixture>/.skilled/skills/sk-code/sk-code-quality/repository/quality.json` | source `repo`, one checklist under the `repo-config` seat |
| the checklist | two `none` rows | both rows listed under the checklist |
| the hygiene key | `commentHygiene.disableRules` set to the issue rule | the rule in `hygiene.disabled`, and absent from the active list |
| `init --apply` | the same repository, which already holds a config | exit `1` with `CONFIG_EXISTS` |

- Expected execution process: the operator reads the doctor's three modes and its `STATUS=` contract, builds the repository, runs `status --json` and reads the seats, the rows and the two hygiene lists, then runs `init --apply --json` and reads the refusal.
- Expected signals: `status` exits `0` with `STATUS=OK SOURCE="repo" TRUST=none`, two checklists, the `repo-config` seat carrying both rows, the disabled list holding one rule and the active list holding the rest; `init --apply` exits `1` with `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS`.
- Desired user-visible outcome: the operator sees exactly what the gate would apply and knows the doctor will not write over a reviewed config.
- Pass/fail: PASS if every value in the expected-result table below holds. FAIL if a seat, a row or a disabled rule is missing, `status` reports no sample, or `init --apply` writes or exits `0`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me the quality gate config the doctor reads for this repository and tell me whether init would overwrite it.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 9\. THE DOCTOR/,$p' .skilled/skills/sk-code/sk-code-quality/references/quality-config.md`
2. Run `status` and `init --apply` over the same fixture and read both `STATUS=` lines.

```bash
node -e '
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const DOCTOR = path.resolve(".skilled/commands/doctor/scripts/sk-code-quality-config.cjs");
const CONFIG = ".skilled/skills/sk-code/sk-code-quality/repository/quality.json";
const STYLE = "# Code style\n\n## Rule overrides\n\n| Rule | Action | Reason |\n| --- | --- | --- |\n"
  + "| `floor.documentation` | none | Functions carry no doc comments here |\n"
  + "| `hygiene.issue` | none | The team writes tracker references in comments |\n";

// The doctor reads the same config module the runner does and asks the runner for the checklist
// view, so the seat, the override rows and the disabled rules come from one resolution.
const repo = buildRepo({
  base: {
    [CONFIG]: JSON.stringify({ schemaVersion: 1, checklists: [{ file: "docs/code-style.md", extensions: [".js"] }],
      commentHygiene: { disableRules: ["issue"] } }, null, 2) + "\n",
    "docs/code-style.md": STYLE,
  },
  change: { "src/total.js": "module.exports = 1;\n" },
});
const doctor = (args) => spawnSync(process.execPath, [DOCTOR, ...args, "--repo", repo.root], { encoding: "utf8", env: repo.env });
function parse(run) {
  const lines = run.stdout.trim().split("\n");
  return { status: lines.pop(), body: JSON.parse(lines.join("\n")) };
}
try {
  const status = doctor(["status", "--json"]);
  assert.equal(status.status, 0);
  const { status: line, body } = parse(status);
  console.log("status exit=" + status.status + " " + line);
  for (const entry of body.applies.checklists) {
    console.log("checklist=" + entry.file + " seats=" + entry.seats.join(",") + " rows=" + entry.overrides.rows.map((row) => row.id + ":" + row.action).join(","));
  }
  console.log("hygiene.disabled=" + body.hygiene.disabled.join(","));
  console.log("hygiene.active=" + body.applies.hygiene.active.length);
  const init = doctor(["init", "--apply", "--json"]);
  console.log("init exit=" + init.status + " " + init.stdout.trim().split("\n").pop());
} finally { repo.cleanup(); }
'
```

3. `for p in references/quality-config.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the three modes and their `STATUS=` contract. Step 2 prints:

```text
status exit=0 STATUS=OK SOURCE="repo" TRUST=none
checklist=hub:sk-code/shared/references/universal/code-quality-standards.md seats=default rows=
checklist=docs/code-style.md seats=repo-config rows=floor.documentation:none,hygiene.issue:none
hygiene.disabled=hygiene.issue
hygiene.active=20
init exit=1 STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS
```

Step 3 prints `OK` for both paths.

| Signal | Expected value |
| --- | --- |
| `status` exit and line | `0` and `STATUS=OK SOURCE="repo" TRUST=none` |
| universal floor row | seat `default`, no override rows |
| repository checklist row | seat `repo-config`, rows `floor.documentation:none` and `hygiene.issue:none` |
| `hygiene.disabled` | the issue rule |
| `applies.hygiene.active` | a non-empty list that does not hold the disabled rule |
| `init --apply` exit and line | `1` and `STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS` |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, both `STATUS=` lines, the two checklist lines with their seats and rows, the two hygiene lines and the two `OK` lines. Save the transcript under the dated run label the playbook names. The active count is read from the checker's own table, so record the number the run printed rather than a number this document carries.

### Pass / Fail

- **Pass**: `status` reports both checklists with their seats and rows, names the disabled rule and a non-empty active list, and `init --apply` refuses with `CONFIG_EXISTS` and exit `1`.
- **Fail**: a seat, a row or a disabled rule is missing, `status` reports no resolution, or `init --apply` writes or exits `0`.

### Failure Triage

1. If `status` exits `1` with `CONFIG_INVALID`, a checklist the config names is refused or missing. The doctor fails the status with the code a gate run would print, so read the message before reading the seats.
2. If the `applies` block reads `DEGRADED`, the runner it called could not resolve the sample. Run `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --explain <path>` over one sampled file to see the same resolution directly.
3. If the repository checklist is missing from the list, the sample never reached a file its selector matches. The doctor lists and checks every row the config declares, so compare the row's selector with the sampled folders.
4. If `init --apply` exits `0`, the target config was absent. The refusal is the proof that an existing file is never replaced, so the fixture must commit the config before the run.
5. If the active list holds the disabled rule, the checker's flag list and the doctor's report disagree. Read the `disableRules` value the config holds and the flags the runner passes.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`sk-code-setup-and-quality-doctor.md`](../../../feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md) | The feature catalog entry for the quality target, its seats and the `init` write |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [quality-config.md](../../references/quality-config.md) §9 | The three modes and the `STATUS=` contract |
| [quality-config.md](../../references/quality-config.md) §7 | The `CONFIG_EXISTS` refusal |
| [sk-code-quality-config.cjs](../../../../../commands/doctor/scripts/sk-code-quality-config.cjs) | The doctor that reads the config and asks the runner |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The `--explain` resolution the `applies` block is built from |
| [SKILL.md](../../SKILL.md) §3 | The pointer that names the doctor for a whole repository |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-023
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/quality-doctor.md`
