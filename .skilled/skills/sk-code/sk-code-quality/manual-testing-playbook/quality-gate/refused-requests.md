---
id: CQ-019
category: quality_gate
title: 'A request the runner cannot honour exits 3 and names the reason'
description: "This scenario validates the runner's refusal codes for `CQ-019`. It sends the runner eight requests it cannot honour and reads the gate, the exit code and the `errors[]` row each one produces: an unknown flag, a named config that is absent, a named file that is missing and one outside the root, a ref with no merge base, a config left at the old root path, a folder that is not a repository and a hub folder that carries no registry."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - references/quality-config.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.0.0.0
---

# CQ-019: A Request The Runner Cannot Honour Exits 3 And Names The Reason

This document captures the refusal contract, execution process, source anchors and metadata for `CQ-019`.

---

## 1. OVERVIEW

This scenario validates the refusal codes for `CQ-019`. The runner's contract names one code per way a request can be unanswerable, and every one of them is a run that must not report a verdict about the change at all. A usage fault, a named config that does not exist, a named file that is missing or lies outside the root, a ref with no merge base, a config still at the old root path, a folder with no repository and a hub folder without its registry each stop the run before any check starts.

Each code exists for a different operator mistake, and each one is silent in the same way if the runner fell back instead. A named config that pointed nowhere would otherwise fall through to discovery and run the wrong checks. A legacy config would otherwise be read as if it were current. A folder outside git with no named files has no change to read, and a hub folder without a registry has no declarations, so both would otherwise report a clean run over nothing.

The scenario sends all eight in one script, one fixture per case, and reads the gate, the exit code and the code row. Nothing here is destructive: every fixture is a temporary repository that the builder removes.

### Why This Matters

The five gate values are only trustworthy because `ERROR` outranks the rest. A run that fell back after a refusal would print `NO_BLOCKER_FOUND` for a request it never answered, and the author would record a gate that never ran over the change they were worried about. The refusal also names the repair, and the codes are what a caller branches on: the doctor maps them to a failed status, and an operator reading a transcript needs `CONFIG_PATH_MISSING` and `BASE_NOT_FOUND` to point at different fixes.

---

## 2. SCENARIO CONTRACT

Operators confirm that each of the eight unanswerable requests reads `ERROR` with exit `3` and the documented code, and that no run reports a gate value about a change it did not read.

- Objective: confirm the gate, the exit code and the `errors[]` code for each of the eight refusal cases.
- Real user request: `My gate run keeps failing before it checks anything. Tell me which requests the runner refuses and what each refusal means.`
- Prompt: `Run the quality gate once for each request it should refuse and tell me the code it reports.`

**Exact prompt**:

```text
Run the quality gate once for each request it should refuse and tell me the code it reports.
```

- Fixture: six temporary repositories outside the working tree, built from the fixture builder the runner suite uses, plus one file written beside them so a named path exists outside the root.

| Case | Request | What the run must say |
| --- | --- | --- |
| unknown flag | `--nope` | `USAGE` |
| absent named config | `--config` naming a file the fixture does not hold | `CONFIG_PATH_MISSING` |
| missing named file | `--files` naming a file the fixture does not hold | `FILE_NOT_FOUND` |
| named file outside the root | `--files` naming a real file beside the fixture | `FILE_OUTSIDE_ROOT` |
| ref with no merge base | `--base` naming a ref that does not exist | `BASE_NOT_FOUND` |
| config at the old root path | `<fixture>/.sk-code/quality.json` committed | `CONFIG_LEGACY_LOCATION` |
| folder with no repository | no `.git` and no named files | `NO_GIT_REPOSITORY` |
| hub folder with no registry | the hub override pointing at an empty folder | `HUB_ROOT_INVALID` |

- Expected execution process: the operator reads the exit-code table, sends the eight requests in one script and reads the gate, the exit code and the code row for each. Every run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: every case reads `gate=ERROR`, `exit=3` and its own code, and no case prints a gate value other than `ERROR`.
- Desired user-visible outcome: the operator can tell a broken install from a moved file, an old config location, a bad ref and a missing registry, and knows the run made no claim about the change.
- Pass/fail: PASS if every case in the expected-result table below holds and every snapshot check passes. FAIL if any case reports another gate or exit, names another code, or the run reaches a check before refusing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate once for each request it should refuse and tell me the code it reports.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 2\. EXIT CODES AND STATES/,/^## 3\. VERDICT SCHEMA/p' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
2. `sed -n '/^## 7\. ERROR CODES/,/^## 8\. TRUST BOUNDARY/p' .skilled/skills/sk-code/sk-code-quality/references/quality-config.md`
3. Send the eight requests and read the gate, the exit code and the code row.

```bash
node -e '
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const CODE = ".sk-code/quality.json";
const out = (name, run) => {
  const verdict = run.verdict;
  assert.equal(verdict.gate, "ERROR");
  console.log(name + " exit=" + run.status + " gate=" + verdict.gate + " code=" + verdict.errors.map((entry) => entry.code).join(","));
};

const repo = buildRepo({ change: { "a.js": "export const a = 1;\n" } });
try {
  fs.writeFileSync(path.join(repo.parent, "outside.js"), "export const z = 1;\n");
  const cases = [
    ["USAGE", ["--nope"]],
    ["CONFIG_PATH_MISSING", ["--config", "nowhere.json"]],
    ["FILE_NOT_FOUND", ["--files", "gone.js"]],
    ["FILE_OUTSIDE_ROOT", ["--files", path.join(repo.parent, "outside.js")]],
    ["BASE_NOT_FOUND", ["--base", "nosuchref"]],
  ];
  for (const [name, args] of cases) {
    out(name, assertSnapshotUnchanged(repo, () => repo.run([...args, "--format", "json"])));
  }
} finally { repo.cleanup(); }

const legacy = buildRepo({ base: { [CODE]: JSON.stringify({ schemaVersion: 1 }) + "\n" }, change: { "a.js": "export const a = 1;\n" } });
try {
  out("CONFIG_LEGACY_LOCATION", assertSnapshotUnchanged(legacy, () => legacy.run(["--format", "json"])));
} finally { legacy.cleanup(); }

const nogit = buildRepo({ git: false, change: { "a.js": "export const a = 1;\n" } });
try {
  out("NO_GIT_REPOSITORY", assertSnapshotUnchanged(nogit, () => nogit.run(["--format", "json"])));
} finally { nogit.cleanup(); }

const hubless = buildRepo({ change: { "a.js": "export const a = 1;\n" } });
try {
  out("HUB_ROOT_INVALID", assertSnapshotUnchanged(hubless, () => hubless.run(["--format", "json"], { env: { SK_CODE_QUALITY_HUB_ROOT: path.join(hubless.parent, "nothing") } })));
} finally { hubless.cleanup(); }
'
```

4. `for p in references/runner-contract.md references/quality-config.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the five gate rows and the ten check states. Step 2 prints the error-code table with the cause of each. Step 3 prints one line per case:

```text
USAGE exit=3 gate=ERROR code=USAGE
CONFIG_PATH_MISSING exit=3 gate=ERROR code=CONFIG_PATH_MISSING
FILE_NOT_FOUND exit=3 gate=ERROR code=FILE_NOT_FOUND
FILE_OUTSIDE_ROOT exit=3 gate=ERROR code=FILE_OUTSIDE_ROOT
BASE_NOT_FOUND exit=3 gate=ERROR code=BASE_NOT_FOUND
CONFIG_LEGACY_LOCATION exit=3 gate=ERROR code=CONFIG_LEGACY_LOCATION
NO_GIT_REPOSITORY exit=3 gate=ERROR code=NO_GIT_REPOSITORY
HUB_ROOT_INVALID exit=3 gate=ERROR code=HUB_ROOT_INVALID
```

Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| every case `gate` | `ERROR` |
| every case exit | `3` |
| every case code | the code the table names for that request |
| legacy case message | names the move to `<fixture>/.skilled/skills/sk-code/sk-code-quality/repository/quality.json` |
| fixture snapshot after each run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the eight case lines and the three `OK` lines. Save the transcript under the dated run label the playbook names. Record the message of the legacy case as printed, because that message is the repair the operator needs.

### Pass / Fail

- **Pass**: all eight cases read `ERROR` with exit `3` and their documented code, and every snapshot check passes.
- **Fail**: a case reports another gate or exit, a code differs, a run reaches a check before refusing, or a snapshot check throws.

### Failure Triage

1. If a case reads `NO_BLOCKER_FOUND`, the request was answerable: the file existed, the ref resolved or the config was discovered elsewhere. Confirm the fixture holds what the case expects before reading the code.
2. If `FILE_OUTSIDE_ROOT` reads `FILE_NOT_FOUND`, the file beside the fixture was never written. The two codes are decided in that order: a path that does not exist cannot be outside.
3. If `CONFIG_LEGACY_LOCATION` reads `CONFIG_INVALID`, the runner read the file from another source. The refusal applies to any path inside the old root folder that `--config` or `skcode.qualityConfig` names, and to the committed file at that path.
4. If `HUB_ROOT_INVALID` reads something else, the override pointed at a folder that held a readable registry. The override only redirects the declarations, and the checkers still come from the hub that holds the runner.
5. If `NO_GIT_REPOSITORY` does not appear, the fixture was built with git and the run read an empty worktree change instead. The code needs both conditions: no repository and no `--files` flag.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`codebase-agnostic-quality-gate.md`](../../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md) | The feature catalog entry for the runner and its exit codes |
| Catalog: [`repository-quality-config.md`](../../../feature-catalog/quality-gate/repository-quality-config.md) | The feature catalog entry for config discovery and the legacy location refusal |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [runner-contract.md](../../references/runner-contract.md) §2 | The gate table and the error-code table |
| [quality-config.md](../../references/quality-config.md) §2 and §7 | Discovery, the legacy location and the config error codes |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The parser, the scope resolver and the refusal paths |
| [fixtures.cjs](../../scripts/tests/fixtures.cjs) | The builder and the snapshot check this scenario uses |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-019
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/refused-requests.md`
