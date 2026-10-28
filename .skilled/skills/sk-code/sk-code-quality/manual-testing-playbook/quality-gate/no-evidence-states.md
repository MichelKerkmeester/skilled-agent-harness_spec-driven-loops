---
id: CQ-020
category: quality_gate
title: 'A check that produced no evidence never reads as clean'
description: "This scenario validates the runner's no-evidence outcomes for `CQ-020`. It drives the five ways a run can end without answering: a check killed at its deadline, a configured check outside git, a checklist the config names and does not ship, an outside-skill row whose path leaves its folder, and a configured command that writes while it runs."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - references/quality-config.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.0.0.0
---

# CQ-020: A Check That Produced No Evidence Never Reads As Clean

This document captures the no-evidence contract, execution process, source anchors and metadata for `CQ-020`.

---

## 1. OVERVIEW

This scenario validates the five no-evidence outcomes for `CQ-020`. A run that could not answer must say so, and the runner has four ways to say it. A check killed at its deadline reads `TIMEOUT`. A configured check outside git reads `ERROR` with code `GUARD_UNAVAILABLE`, because no snapshot there can show whether the command changed the workspace. A required check in either state leaves the run `UNVERIFIED` with exit `4`, and the id joins `summary.unverified`. A checklist a declaration names but does not ship, or one an outside skill resolves outside its own folder, is a config fault that stops the run `ERROR` with exit `3`. A configured command that writes inside the repository ends the run with `CHECK_MUTATED_WORKSPACE`, names the check and the paths, and reverts nothing.

The scenario drives each one and reads the field that carries the result: the check row, the `config.errors` row or the `errors[]` row. None of the five can produce a clean gate, which is the property under test.

### Why This Matters

Every one of these outcomes is a run that looks successful to a caller reading only the exit status through a pipe, or only the last line of a transcript. That is why the state and the code exist separately from the gate: `TIMEOUT` is not a failure of the code under test, and `CHECK_MUTATED_WORKSPACE` is not a finding either, yet a completion claim built on either one would be false. The mutation case has a second half that only this scenario checks: the run promises to revert nothing, so an operator who expects the runner to undo the write would be surprised at a later diff.

---

## 2. SCENARIO CONTRACT

Operators confirm that each no-evidence case reads the documented state or code, that the cases which leave checks unanswered report `UNVERIFIED`, and that the mutation case leaves the written file behind.

- Objective: confirm the gate, the exit code, the check state or code, and the unverified list for each of the five no-evidence cases.
- Real user request: `My gate run ended without telling me whether the code is fine. Walk each way that happens and tell me what the output means.`
- Prompt: `Run the quality gate once for each way a check can produce no evidence, and tell me what each result means.`

**Exact prompt**:

```text
Run the quality gate once for each way a check can produce no evidence, and tell me what each result means.
```

- Fixture: four temporary repositories outside the working tree, built from the fixture builder the runner suite uses, plus one outside-skill folder written beside the fixture hub.

| Case | Fixture | What the run must say |
| --- | --- | --- |
| deadline | a change with one `.mjs` file and one `.py` file, run with `--timeout` under one millisecond | three spawned checks read `TIMEOUT`, the run reads `UNVERIFIED` with exit `4`, and their ids join `summary.unverified` |
| no snapshot | a plain folder with no repository, a config named with `--config` and one `.js` file named with `--files` | the configured row reads `ERROR` with code `GUARD_UNAVAILABLE`, and the run reads `UNVERIFIED` with exit `4` |
| absent checklist | a repository config naming `<fixture>/docs/missing.md`, which the fixture does not hold | `config.errors` holds `CHECKLIST_MISSING` and the run reads `ERROR` with exit `3` |
| outside-skill row | an outside skill whose checklist row points at a file a link resolves outside its folder | `config.errors` holds `CHECKLIST_OUTSIDE_SKILL` and the run reads `ERROR` with exit `3` |
| mutation | a trusted config naming a command that writes a file inside the repository | `errors[]` holds `CHECK_MUTATED_WORKSPACE`, the row names the check and the path, and the written file is still there afterwards |

- Expected execution process: the operator reads the exit-code table, the check-state table and the config error codes, then runs each case and reads the row, the code and the unverified list. Every run is wrapped in the fixture builder's snapshot check except the mutation case, which is expected to write and is read directly.
- Expected signals: the deadline case reads `gate=UNVERIFIED`, `exit=4` and three timed-out ids; the no-snapshot case reads `gate=UNVERIFIED`, `exit=4`, row `ERROR` and code `GUARD_UNAVAILABLE`; the two config cases read `gate=ERROR`, `exit=3` and their own `config.errors` code; the mutation case reads `gate=ERROR`, `exit=3`, names `writer` and the written path, and confirms the file survives.
- Desired user-visible outcome: the operator installs the missing tool, trusts the repository, fixes the checklist, or reverts the command's write by hand, and never records any of the five as a clean run.
- Pass/fail: PASS if every value in the expected-result table below holds. FAIL if any case reports a clean gate, a skipped state collapses into a clean one, a code is missing, or the mutation case reverts the write.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate once for each way a check can produce no evidence, and tell me what each result means.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 2\. EXIT CODES AND STATES/,/^## 3\. VERDICT SCHEMA/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. `sed -n '/^## 5\. HOW A CONFIGURED CHECK RUNS/,/^## 6\. SUGGESTIONS, NEVER RUN/p' .skilled/skills/sk-code/sk-code-quality/references/quality-config.md`
3. Drive the five cases and read the row, the code and the unverified list.

```bash
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo, trustRepoChecks } = require(path.join(Q, "tests/fixtures.cjs"));
const CONFIG = ".skilled/skills/sk-code/sk-code-quality/repository/quality.json";
const out = (name, run, more) => {
  const verdict = run.verdict;
  console.log(name + " exit=" + run.status + " gate=" + verdict.gate + " unverified=" + (verdict.summary.unverified.join(",") || "none") + (more ? " " + more(verdict) : ""));
};

// A deadline under one millisecond rounds up to one, and every spawned check overruns it.
const slow = buildRepo({ change: { "a.mjs": "export const a = 1;\n", "b.py": "x = 1\n" } });
try {
  out("TIMEOUT", assertSnapshotUnchanged(slow, () => slow.run(["--timeout", "0.001", "--format", "json"])),
    (verdict) => "timed-out=" + verdict.checks.filter((entry) => entry.state === "TIMEOUT").map((entry) => entry.id).join(","));
} finally { slow.cleanup(); }

// Outside git no snapshot can show whether a configured command changed the workspace, so a
// trusted one still refuses to start and says why.
const outside = buildRepo({ git: false,
  base: { "quality.json": JSON.stringify({ schemaVersion: 1, checks: [{ id: "echo-lint", argv: ["echo", "{files}"], severity: "P0" }] }, null, 2) + "\n" },
  change: { "a.js": "export const a = 1;\n" } });
try {
  out("GUARD_UNAVAILABLE", assertSnapshotUnchanged(outside, () => outside.run(["--config", "quality.json", "--files", "a.js", "--format", "json"])),
    (verdict) => { const row = verdict.checks.find((entry) => entry.id === "echo-lint"); return "row=" + row.state + " code=" + row.code; });
} finally { outside.cleanup(); }

// A checklist a repository config names but does not ship stops the run before a check starts.
const missing = buildRepo({ base: { [CONFIG]: JSON.stringify({ schemaVersion: 1, checklists: [{ file: "docs/missing.md", extensions: [".js"] }] }, null, 2) + "\n" },
  change: { "a.js": "export const a = 1;\n" } });
try {
  out("CHECKLIST_MISSING", assertSnapshotUnchanged(missing, () => missing.run(["--format", "json"])),
    (verdict) => "config.errors=" + verdict.config.errors.map((entry) => entry.code).join(","));
} finally { missing.cleanup(); }

// An outside skill row whose real path leaves its own folder is refused, and the path it names
// is never read.
const outer = buildRepo({ change: { "xsrc/run.js": "module.exports = 1;\n" } });
try {
  const folder = ["local", "example"].join("-");
  const skill = path.join(path.dirname(outer.hub), folder);
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(path.dirname(outer.hub), "outside.md"), "# Outside\n");
  fs.symlinkSync(path.join(path.dirname(outer.hub), "outside.md"), path.join(skill, "linked.md"));
  fs.writeFileSync(path.join(skill, "graph-metadata.json"), JSON.stringify({
    schema_version: "1.0", skill_id: folder, family: path.basename(outer.hub),
    surface_detection: { label: "example", role: "specific", pathMarkers: ["xsrc/"] },
    quality: { checklists: [{ extensions: [".js"], file: "linked.md" }] },
  }, null, 2) + "\n");
  out("CHECKLIST_OUTSIDE_SKILL", assertSnapshotUnchanged(outer, () => outer.run(["--format", "json"])),
    (verdict) => "config.errors=" + verdict.config.errors.map((entry) => entry.code).join(","));
} finally { outer.cleanup(); }

// A configured command that writes inside the repository ends the run, and nothing is reverted.
const writer = buildRepo({
  base: { [CONFIG]: JSON.stringify({ schemaVersion: 1, checks: [{ id: "writer", argv: [process.execPath, "-e", "require(\"fs\").writeFileSync(\"written.txt\",\"x\")"], severity: "P1" }] }, null, 2) + "\n" },
  change: { "a.js": "export const a = 1;\n" } });
try {
  trustRepoChecks(writer);
  const run = writer.run(["--format", "json"]);
  out("CHECK_MUTATED_WORKSPACE", run,
    (verdict) => "check=" + verdict.errors.map((entry) => entry.check + ":" + entry.paths.join(",")).join(","));
  assert.ok(fs.existsSync(path.join(writer.root, "written.txt")), "the run reverted the change");
  console.log("written.txt kept after the run");
} finally { writer.cleanup(); }
'
```

4. `for p in references/runner-contract.md references/quality-config.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the gate table, the ten check states and the error codes. Step 2 prints the order of states and the guard rule for a configured check. Step 3 prints one line per case, then the mutation case's closing line:

```text
TIMEOUT exit=4 gate=UNVERIFIED unverified=comment-hygiene,syntax-node,syntax-python timed-out=comment-hygiene,syntax-node,syntax-python
GUARD_UNAVAILABLE exit=4 gate=UNVERIFIED unverified=echo-lint row=ERROR code=GUARD_UNAVAILABLE
CHECKLIST_MISSING exit=3 gate=ERROR unverified=none config.errors=CHECKLIST_MISSING
CHECKLIST_OUTSIDE_SKILL exit=3 gate=ERROR unverified=none config.errors=CHECKLIST_OUTSIDE_SKILL
CHECK_MUTATED_WORKSPACE exit=3 gate=ERROR unverified=none check=writer:written.txt
written.txt kept after the run
```

Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| deadline case | `UNVERIFIED`, exit `4`, `comment-hygiene`, `syntax-node` and `syntax-python` `TIMEOUT` and in `summary.unverified` |
| no-snapshot case | `UNVERIFIED`, exit `4`, row `ERROR` with code `GUARD_UNAVAILABLE` |
| absent-checklist case | `ERROR`, exit `3`, `config.errors` `CHECKLIST_MISSING` |
| outside-skill case | `ERROR`, exit `3`, `config.errors` `CHECKLIST_OUTSIDE_SKILL` |
| mutation case | `ERROR`, exit `3`, `errors[]` `CHECK_MUTATED_WORKSPACE` naming `writer` and `written.txt` |
| the written file after the mutation run | present, because nothing is reverted |
| no case | reports `NO_BLOCKER_FOUND` |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the five case lines, the closing mutation line and the three `OK` lines. Save the transcript under the dated run label the playbook names. Read every line for a clean claim before recording a verdict, because four of the five cases are the ones a reader is most likely to summarise as a pass.

### Pass / Fail

- **Pass**: all five cases read the documented gate, exit and state or code, no case reports a clean gate, and the mutation case leaves its written file behind.
- **Fail**: a case reads `NO_BLOCKER_FOUND`, a timed-out or unavailable check collapses into a clean run, a code is missing, or the mutation case reverts the write.

### Failure Triage

1. If the deadline case does not time out, the machine answered `python3` and `node --check` inside a rounded-up millisecond. Raise the fixture's file count or lower nothing: the flag rounds up, never to no deadline.
2. If the no-snapshot case reads `SKIPPED_UNTRUSTED`, the `--config` flag did not name the file, so the trust rule never applied. Outside git the row can only read `GUARD_UNAVAILABLE` once the config is trusted.
3. If the absent-checklist case reads `NO_BLOCKER_FOUND`, the config named no selector that reached a scoped file, so the row was never read. A missing file is reported only for a declaration that applies.
4. If the outside-skill case reads `CHECKLIST_ROW_INVALID`, the row failed a rule before its path was resolved. A `..` segment, an absolute path or a non-`.md` name is refused as a malformed row.
5. If the mutation case reads `NO_BLOCKER_FOUND`, the config was not trusted or the command wrote outside the folders the guard watches. The guard hashes the folders the scope reaches, so a write at the repository root is visible while one in an ignored folder is not.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog entry for the runner's gate values |
| Catalog: [`repository-quality-config.md`](../../../feature-catalog/quality-gate/repository-quality-config.md) | The feature catalog entry for the configured-check order, the trust boundary and the guard |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §2 | The check states, the error codes and the layer rule |
| [quality-config.md](../../references/quality-config.md) §5 | The order of states a configured check passes through |
| [quality-config.md](../../references/quality-config.md) §7 | The config error codes and the mutation code |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The deadline, the outside-git refusal, the checklist reader and the workspace guard |
| [fixtures.cjs](../../scripts/tests/fixtures.cjs) | The builder, the snapshot check and the trust helper |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-020
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/no-evidence-states.md`
