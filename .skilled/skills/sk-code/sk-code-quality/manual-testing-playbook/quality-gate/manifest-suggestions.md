---
id: CQ-022
category: quality_gate
title: 'A manifest implies a check the runner suggests and never runs'
description: "This scenario validates the suggestion lane for `CQ-022`. It commits a `package.json` with three scripts and a workflow file, runs the gate over a change, and reads the `suggested_checks` rows, the entry each one would need and the proof that nothing started."
expected_intent: QUALITY
expected_resources:
  - references/quality-config.md
  - references/runner-contract.md
  - scripts/quality-gate.cjs
catalog_applicable: true
version: 1.0.0.0
---

# CQ-022: A Manifest Implies A Check The Runner Suggests And Never Runs

This document captures the suggestion lane, execution process, source anchors and metadata for `CQ-022`.

---

## 1. OVERVIEW

This scenario validates the suggestion lane for `CQ-022`. With or without a repository config, the runner reads the manifests at the repository root and reports what they imply under `suggested_checks`. Each row carries an `id`, a `source`, a `reason` and the exact `checks` entry that would enable it. Six manifest shapes are read: a `package.json` script named `typecheck`, `lint` or `format:check`, a `pyproject.toml` with a ruff or mypy table, a `Cargo.toml`, a `go.mod`, a workflow file in the workflows folder and a `Makefile` with a `lint:` target.

The lane is a suggestion and nothing more. No suggestion ever runs, a script named `test`, `fix` or `format` is never suggested, a script whose text holds `--write` or `--fix` is never suggested, and a suggestion whose id or argv a configured check already holds is left out. The scenario commits a `package.json` with three such scripts and one workflow file, and reads what the run suggests and what it starts.

### Why This Matters

A manifest is evidence that a repository already knows how to check itself, and a runner that ignored it would leave the cheapest available check unused. A runner that ran it would be worse: it would start a command nobody named in the quality config, which breaks the trust boundary that says commands come only from the repository layer. The two exclusions carry the same weight. A `test` script belongs to the verification phase, where a failing test is a different claim from a failing gate, and a script that writes files would change the workspace under the run that is supposed to observe it.

---

## 2. SCENARIO CONTRACT

Operators confirm that a `typecheck` script and a workflow file each produce one suggestion with the entry that would enable it, that the `test` script and the fixer script produce none, and that nothing the run suggests was started.

- Objective: confirm the two suggestion rows, their entries, the absence of the excluded scripts and the check rows the run actually produced.
- Real user request: `Our repository already has a typecheck script and a workflow. Why does the quality gate not use them, and what would it take?`
- Prompt: `Tell me which checks the quality gate would suggest for this repository and whether it ran any of them.`

**Exact prompt**:

```text
Tell me which checks the quality gate would suggest for this repository and whether it ran any of them.
```

- Fixture: one temporary git repository outside the working tree whose base commit holds a `package.json` with three scripts and one workflow file, and whose change adds one `.js` file.

| Manifest part | Content | What the run must say |
| --- | --- | --- |
| `package.json` scripts | `typecheck`, `test` and `lint` | one suggestion for `npm run typecheck`, with its `checks` entry; none for `test`; none for `lint`, whose text holds `--fix` |
| `<fixture>/.github/workflows/x.yml` | a workflow with a name, a trigger and one job | one suggestion for `actionlint`, with its `checks` entry |
| the check rows | one per built-in check | no configured row and no row for a suggested id |

- Expected execution process: the operator reads the manifest table and the never-run promise, builds the fixture, runs the gate in JSON and reads `suggested_checks` against the check rows. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate=NO_BLOCKER_FOUND` with exit `0`; two suggestion rows, `typecheck` and `actionlint`; the `test` script absent; no check row whose origin is not `builtin`.
- Desired user-visible outcome: the author can paste the suggested entry into the repository config if they want that check, and knows the gate made no claim about a command it did not run.
- Pass/fail: PASS if every value in the expected-result table below holds and the snapshot check passes. FAIL if a suggestion is missing, an excluded script is suggested, a suggestion starts a command, or a snapshot check throws.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Tell me which checks the quality gate would suggest for this repository and whether it ran any of them.`

### Commands

Run the commands from the repository root.

1. `sed -n '/^## 6\. SUGGESTIONS, NEVER RUN/,/^## 7\. ERROR CODES/p' .skilled/skills/sk-code/sk-code-quality/references/quality-config.md`
2. `rg -n 'suggested_checks' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md`
3. Build the fixture, run the gate and read the suggestions against the check rows.

```bash
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const scripts = { typecheck: "tsc --noEmit", test: "node --test", lint: "eslint . --fix" };
const repo = buildRepo({
  base: {
    "package.json": JSON.stringify({ name: "fixture", private: true, scripts }, null, 2) + "\n",
    ".github/workflows/x.yml": "name: x\non: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n",
  },
  change: { "src/app.js": "export const a = 1;\n" },
});
try {
  const run = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = run.verdict;
  assert.equal(verdict.gate, "NO_BLOCKER_FOUND");
  console.log("gate=" + verdict.gate + " exit=" + run.status);
  for (const entry of verdict.suggested_checks) {
    console.log("suggestion=" + entry.id + " source=" + entry.source + " argv=" + entry.entry.argv.join(" "));
  }
  assert.ok(!verdict.suggested_checks.some((entry) => entry.id === "test"), "the test script was suggested");
  console.log("test script suggested=none");
  assert.ok(!verdict.checks.some((entry) => entry.id === "typecheck"), "a suggestion ran");
  console.log("started=" + verdict.checks.filter((entry) => entry.origin !== "builtin").length);
} finally { repo.cleanup(); }
'
```

4. `for p in references/quality-config.md references/runner-contract.md scripts/quality-gate.cjs; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 prints the six manifest rules, the `test`/`fix`/`format` exclusions and the never-run promise. Step 2 prints the verdict-schema row for `suggested_checks`. Step 3 prints:

```text
gate=NO_BLOCKER_FOUND exit=0
suggestion=typecheck source=package.json argv=npm run typecheck
suggestion=actionlint source=.github/workflows argv=actionlint {files}
test script suggested=none
started=0
```

Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` and exit | `NO_BLOCKER_FOUND` and `0` |
| suggestion rows | exactly two, `typecheck` and `actionlint` |
| `typecheck` row | source `package.json`, entry `npm run typecheck`, severity `P1`, required `false` |
| `actionlint` row | source `.github/workflows`, entry `actionlint {files}` over the workflow paths |
| `test` script | no suggestion |
| `lint` script | no suggestion, because its text holds `--fix` |
| check rows with a non-`builtin` origin | none |
| fixture snapshot after the run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the gate line, both suggestion lines, the two exclusion lines and the three `OK` lines. Save the transcript under the dated run label the playbook names. The entry printed for each suggestion is the artifact to keep: it is what an operator pastes into the repository config.

### Pass / Fail

- **Pass**: the run suggests exactly `typecheck` and `actionlint` with their entries, suggests nothing for the `test` or the fixer script, and starts no configured check.
- **Fail**: a suggestion is missing, an excluded script is suggested, a suggested id appears among the check rows, or the snapshot check throws.

### Failure Triage

1. If no suggestion appears, the manifest is not at the repository root. The lane reads the root manifests only, so a `package.json` in a subfolder is never read.
2. If the `test` script is suggested, the exclusion list changed. A script named `test`, `fix` or `format` is never suggested, and neither is one whose text holds `--write` or `--fix`.
3. If a suggestion duplicates a configured check, the run left it out on purpose. Compare the suggestion's id and argv with the `checks` rows in the repository config.
4. If the suggestion row appears beside a check row of the same id, the lane started it. Record the row as found and route the defect to the phase that owns the suggestion lane.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| Catalog: [`repository-quality-config.md`](../../../feature-catalog/quality-gate/repository-quality-config.md) | The feature catalog entry for the config and the commands a repository names |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [quality-config.md](../../references/quality-config.md) §6 | The six manifest rules, the exclusions and the never-run promise |
| [runner-contract.md](../../references/runner-contract.md) §3 | The `suggested_checks` field and its `entry` |
| [quality-gate.cjs](../../scripts/quality-gate.cjs) | The manifest reader and the suggestion builder |
| [SKILL.md](../../SKILL.md) §3 | The line that a manifest-implied command is a suggestion it never runs |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-022
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/manifest-suggestions.md`
