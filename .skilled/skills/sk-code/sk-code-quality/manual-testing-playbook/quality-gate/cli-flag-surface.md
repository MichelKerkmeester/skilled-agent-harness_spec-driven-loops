---
id: CQ-018
category: quality_gate
title: 'Every runner flag changes the run the way the CLI table says'
description: "This scenario validates the quality-gate CLI surface for `CQ-018`. It runs the runner through each documented flag group and reads the field each one owns: the `--base` scope, `--lines file`, `--only` and `--skip` rows, the `--no-run` listing, a `--config` source, `--help` and a two-path `--explain`."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - scripts/tests/fixtures.cjs
catalog_applicable: true
version: 1.0.0.0
---

# CQ-018: Every Runner Flag Changes The Run The Way The CLI Table Says

This document captures the flag contract, execution process, source anchors and metadata for `CQ-018`.

---

## 1. OVERVIEW

This scenario validates the CLI surface for `CQ-018`. The runner's contract names four scope flags and eight options, and each one owns a field of the verdict. A scope flag decides which files the run reads. `--lines file` decides which lines count as changed, which is what turns an untouched label from debt into a blocking finding. `--only` and `--skip` turn every other check `SKIPPED_BY_FLAG`, and a required check in that state leaves the run unverified rather than clean. `--no-run` lists every spawning check without starting it. `--config` records the choice as `config.source` `cli`. `--help` prints the usage table and exits 0. `--explain` takes several paths and runs nothing.

The scenario walks those groups in one script, one fixture per group, and reads the field each flag owns. The prompts and the fixtures stay small because the flag is the subject, not the change under test.

### Why This Matters

A flag that silently did nothing would still exit 0, and every scenario that only read the gate value would pass. The failure modes are specific and quiet: a `--base` run that read the worktree anyway would report a smaller change than the one asked about; a `--lines file` run that kept the changed-line rule would leave a whole class of findings non-blocking; a `--skip` that dropped a required check without marking the run unverified would let an author skip the gate and call the result clean. `--no-run` and `--help` are the two flags an operator reaches for before trusting a config or a CLI they have not read, so their output is part of the safety story rather than a convenience.

---

## 2. SCENARIO CONTRACT

Operators confirm that each flag group changes the field it owns, that the two safe-listing flags start nothing, and that an `--explain` run resolves several paths in one call.

- Objective: confirm the scope mode and file list, the origin and severity of a label under both `--lines` values, the `SKIPPED_BY_FLAG` set, the `LISTED` set, the `config.source`, the `--help` exit and the `--explain` file count.
- Real user request: `I want to gate a branch against its base, count a whole file's lines, run one check, list the checks without running them and see which config the runner would read. Walk the flags with me.`
- Prompt: `Run the quality gate through each flag it documents and show me the field each one changes.`

**Exact prompt**:

```text
Run the quality gate through each flag it documents and show me the field each one changes.
```

- Fixture: four temporary git repositories outside the working tree, built from the fixture builder the runner suite uses. One commits a change and then edits another file, so a merge base exists. One commits a labelled comment and appends a line, so the label sits on an unchanged line. One carries a repository config with one configured check. One holds a config file the run can be pointed at.

| Group | Flags | What the run must say |
| --- | --- | --- |
| base scope | `--base HEAD~1` | `scope.mode` reads `base`, `scope.files` holds both changed files, and `scope.merge_base` is a commit id |
| line scope | `--lines changed`, then `--lines file` | the label reads P1 with origin `touched-file`, then P0 with origin `changed-line` and blocks |
| check selection | `--skip comment-hygiene,syntax-node`, then `--only secrets` | the named rows read `SKIPPED_BY_FLAG`, the run reads `UNVERIFIED` with exit `4`, and `summary.unverified` names the required ones |
| listing | `--no-run` | every spawning check reads `LISTED`, and the configured check also carries one planned run over its three files |
| named config | `--config <fixture>/fixtures/quality.json` | `config.source` reads `cli`, the path is recorded, and `config.hygiene.disabled` names the switched-off rule |
| usage | `--help` | exit `0` and a first line reading `Usage: quality-gate.cjs [scope] [options]` |
| explanation | `--explain a.js b.py` | exit `2`, schema `code-quality-explain/v1`, two file entries and `note` `nothing was run` |

- Expected execution process: the operator reads the CLI table and the exit-code table, then runs the flag groups in one script, one fixture per group, and reads the field each one owns. Every run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: the base run reads `mode=base`; the two line-scope runs differ only in the finding's origin, severity and blocking flag; the selection runs read `UNVERIFIED` with the skipped ids in `summary.unverified`; the listing run carries five `LISTED` rows and one planned configured run; the named-config run reads `source=cli`; `--help` exits `0`; the explanation exits `2` with both files.
- Desired user-visible outcome: the operator can gate a branch, widen the line rule, isolate one check, inspect a config or a CLI, and read several files' resolution without guessing what any flag does.
- Pass/fail: PASS if every value in the expected-result table below holds and every snapshot check passes. FAIL if a flag leaves its field unchanged, a skipped or listed row reads another state, `--help` starts a check or exits non-zero, or a snapshot check throws.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate through each flag it documents and show me the field each one changes.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 1\. OVERVIEW AND CLI/,/^## 2\. EXIT CODES AND STATES/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. Run every flag group and read the field each one owns.

```bash
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const LABEL = ["ADR", "12"].join("-");
const CONFIG = ".skilled/skills/sk-code/sk-code-quality/repository/quality.json";
const out = (line) => console.log(line);

// --base reads from the merge base to the working tree, so the fixture commits one change
// and then edits another file.
const history = buildRepo({ base: { "a.js": "export const a = 1;\n", "README.txt": "fixture\n" } });
try {
  history.write({ "a.js": "export const a = 1;\nexport const b = 2;\n" });
  history.git(["add", "-A"]);
  history.git(["commit", "-q", "-m", "second"]);
  history.write({ "c.js": "export const c = 3;\n" });
  const run = assertSnapshotUnchanged(history, () => history.run(["--base", "HEAD~1", "--format", "json"]));
  const verdict = run.verdict;
  assert.match(verdict.scope.merge_base, /^[0-9a-f]{40}$/);
  out("base mode=" + verdict.scope.mode + " base=" + verdict.scope.base + " files=" + verdict.scope.files.join(",") + " gate=" + verdict.gate + " merge_base=40-hex");
} finally { history.cleanup(); }

// --lines file counts every line of a scoped file as changed, so a label the change did not
// write takes the blocking severity its origin would otherwise hold back.
const labelled = {};
for (const lines of ["changed", "file"]) {
  const repo = buildRepo({ base: { "app.js": "// see " + LABEL + "\nexport const a = 1;\n" },
    change: { "app.js": "// see " + LABEL + "\nexport const a = 1;\nexport const b = 2;\n" } });
  labelled[lines] = repo;
}
try {
  for (const lines of ["changed", "file"]) {
    const run = assertSnapshotUnchanged(labelled[lines], () => labelled[lines].run(["--lines", lines, "--format", "json"]));
    const verdict = run.verdict;
    const finding = verdict.findings.find((entry) => entry.rule === "hygiene.adr");
    out("lines=" + lines + " exit=" + run.status + " severity=" + finding.severity + " origin=" + finding.origin + " blocking=" + finding.blocking);
  }
} finally { for (const lines of ["changed", "file"]) labelled[lines].cleanup(); }

// --skip and --only turn every other check off, and a required one that never ran leaves the
// run unverified rather than clean.
const plain = buildRepo({ change: { "a.js": "export const a = 1;\n" } });
try {
  for (const args of [["--skip", "comment-hygiene,syntax-node"], ["--only", "secrets"]]) {
    const run = assertSnapshotUnchanged(plain, () => plain.run([...args, "--format", "json"]));
    const verdict = run.verdict;
    out(args.join(" ") + " gate=" + verdict.gate + " exit=" + run.status + " unverified=" + verdict.summary.unverified.join(",")
      + " skipped=" + verdict.checks.filter((entry) => entry.state === "SKIPPED_BY_FLAG").map((entry) => entry.id).join(","));
  }

  // --no-run lists every spawning check, built-in and configured, and starts none of them.
  const listed = buildRepo({
    base: { [CONFIG]: JSON.stringify({ schemaVersion: 1, checks: [{ id: "echo-lint", argv: ["echo", "{files}"], severity: "P1" }] }, null, 2) + "\n" },
    change: { "a.js": "export const a = 1;\n", "b.py": "x = 1\n", "c.sh": "#!/bin/sh\ntrue\n" },
  });
  try {
    const run = assertSnapshotUnchanged(listed, () => listed.run(["--no-run", "--format", "json"]));
    const verdict = run.verdict;
    const row = verdict.checks.find((entry) => entry.id === "echo-lint");
    assert.equal(row.runs.length, 1);
    out("no-run listed=" + verdict.checks.filter((entry) => entry.state === "LISTED").map((entry) => entry.id).join(",")
      + " configured-runs=" + row.runs.length + " configured-files=" + row.runs[0].files);
  } finally { listed.cleanup(); }
} finally { plain.cleanup(); }

// --config names the file, so the run records the choice rather than discovering one.
const named = buildRepo({ base: { "fixtures/quality.json": JSON.stringify({ schemaVersion: 1, commentHygiene: { disableRules: ["issue"] } }, null, 2) + "\n" },
  change: { "a.js": "export const a = 1;\n" } });
const folder = buildRepo({ change: { "a.js": "export const a = 1;\n", "b.py": "x = 1\n" } });
try {
  const run = assertSnapshotUnchanged(named, () => named.run(["--config", "fixtures/quality.json", "--format", "json"]));
  out("config source=" + run.verdict.config.source + " path=" + run.verdict.config.path + " disabled=" + run.verdict.config.hygiene.disabled.join(","));
  const help = assertSnapshotUnchanged(folder, () => folder.run(["--help"]));
  out("help exit=" + help.status + " first=" + JSON.stringify(help.stdout.split("\n")[0]));
  const explain = assertSnapshotUnchanged(folder, () => folder.run(["--explain", "a.js", "b.py"]));
  out("explain exit=" + explain.status + " schema=" + explain.verdict.schema + " files=" + explain.verdict.files.length + " note=" + explain.verdict.note);
} finally { named.cleanup(); folder.cleanup(); }
'
```

3. `for p in references/runner-contract.md scripts/quality-gate.cjs scripts/tests/fixtures.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the four scope flags, the eight options and the usage-error rule. Step 2 prints one line per flag group:

```text
base mode=base base=HEAD~1 files=a.js,c.js gate=NO_BLOCKER_FOUND merge_base=40-hex
lines=changed exit=0 severity=P1 origin=touched-file blocking=false
lines=file exit=1 severity=P0 origin=changed-line blocking=true
--skip comment-hygiene,syntax-node gate=UNVERIFIED exit=4 unverified=comment-hygiene,syntax-node skipped=comment-hygiene,syntax-node
--only secrets gate=UNVERIFIED exit=4 unverified=comment-hygiene,conflict-markers,syntax-node skipped=comment-hygiene,conflict-markers,debug-leftovers,syntax-node
no-run listed=comment-hygiene,syntax-node,syntax-python,syntax-shell,echo-lint configured-runs=1 configured-files=3
config source=cli path=fixtures/quality.json disabled=hygiene.issue
help exit=0 first="Usage: quality-gate.cjs [scope] [options]"
explain exit=2 schema=code-quality-explain/v1 files=2 note=nothing was run
```

Step 3 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `--base` scope | `mode=base`, `base=HEAD~1`, both changed files in `scope.files` |
| `--base` merge base | a 40-character commit id |
| `--lines changed` | one P1 finding, origin `touched-file`, not blocking, exit `0` |
| `--lines file` | one P0 finding, origin `changed-line`, blocking, exit `1` |
| `--skip` | `UNVERIFIED` with exit `4`, both named ids in `summary.unverified`, both rows `SKIPPED_BY_FLAG` |
| `--only secrets` | `UNVERIFIED` with exit `4`, the required skipped ids in `summary.unverified` |
| `--no-run` | five `LISTED` rows, one planned configured run over three files |
| `--config` | `config.source` `cli`, the named path recorded, `hygiene.disabled` naming the rule |
| `--help` | exit `0`, first line `Usage: quality-gate.cjs [scope] [options]` |
| `--explain` over two paths | exit `2`, `code-quality-explain/v1`, two file entries, `note` `nothing was run` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the nine flag-group lines and the three `OK` lines. Save the transcript under the dated run label the playbook names. The merge base is a commit id, so record it as the run printed it rather than comparing it across runs.

### Pass / Fail

- **Pass**: every flag group reads the field the table names, the two selection runs read `UNVERIFIED`, the listing run starts nothing, `--help` exits `0`, the explanation resolves both paths, and every snapshot check passes.
- **Fail**: a scope, severity, state or source disagrees with the table, `--help` or `--explain` starts a check, or a snapshot check throws.

### Failure Triage

1. If `--base` reads `mode=worktree`, the flag was passed after a scope flag or the merge base could not be resolved. Two scope flags in one call are a usage error, and a ref with no merge base exits `3` with `BASE_NOT_FOUND`.
2. If `--lines file` leaves the finding P1, the file was out of scope rather than the flag being ignored. Check `scope.files` first.
3. If a skipped row reads `NOT_APPLICABLE`, no file of that check's kind was in scope, and the state table puts the match before the flag.
4. If `--no-run` starts a check, read the row's `runs[]`: a spawning check in that mode carries its planned `argv` and no exit status. An in-process check still runs, so `conflict-markers`, `secrets` and the parse checks may report findings.
5. If `--explain` exits `3`, a named path is missing or outside the root. The call stops whole, as a single path does.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog entry for the runner, its scopes and its exit codes |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §1 | The scope and option tables this scenario walks |
| [runner-contract.md](../../references/runner-contract.md) §2 | The state each flag produces and the exit code that follows |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The flag parser, the check selector and the explain renderer |
| [fixtures.cjs](../../scripts/tests/fixtures.cjs) | The builder and the snapshot check this scenario uses |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-018
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/cli-flag-surface.md`
