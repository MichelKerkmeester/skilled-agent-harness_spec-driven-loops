---
id: CQ-004
category: quality_gate
title: 'A CI workflow change lists the CI checklist'
description: "This scenario validates the gate run for `CQ-004`. It replays fixture F14, a changed GitHub Actions workflow, and confirms the verdict lists the CI checklist the real hub declares beside the universal floor and that the YAML check reads the changed file."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
version: 1.1.5.1
---

# CQ-004: A CI Workflow Change Lists The CI Checklist

This document captures the run contract, execution process, source anchors and metadata for `CQ-004`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-004`. Fixture F14 changes one file, `.github/workflows/x.yml`, in a repository whose hub is the real `sk-code` registry. The change holds a tidy workflow with a name, a trigger and one job that runs a command. No label, conflict marker, secret or debugger line appears in it. The run must list the CI checklist that the `sk-code-ci` surface declares, keep the universal floor ahead of it, and report the YAML check as clean over the one changed file.

### Why This Matters

A CI workflow is the one target that a surface claims by path alone, with no detection block, so nothing in the file's vocabulary announces which checklist applies. If the verdict omitted that checklist, an author would edit a workflow without ever loading the CI standards it is held to. The floor-first order also matters, because a reader who loads one checklist and stops would skip the baseline severity rules.

---

## 2. SCENARIO CONTRACT

Operators confirm that the changed workflow returns `NO_BLOCKER_FOUND`, that the verdict lists the universal floor and then the CI checklist, and that the YAML check reads exactly one file and reports no finding.

- Objective: confirm the gate value, the exit code, the checklist rows and the YAML check coverage for fixture F14.
- Real user request: `I updated our CI workflow. Run the quality gate and tell me what applies before I claim done.`
- Prompt: `Run the quality gate on my edited .github/workflows/ci.yml.`

**Exact prompt**:

```text
Run the quality gate on my edited .github/workflows/ci.yml.
```

- Fixture: F14, built in a temporary git repository outside the working tree, with the real `sk-code` registry as the hub. The seed keeps the CI checklist path in one document, so a rename in the registry and a stale scenario show up as one failed row.

| File | Seeded content | What the gate must say |
| --- | --- | --- |
| `.github/workflows/x.yml` | a workflow with a name, an `on` trigger and one job that runs a command | `syntax-yaml` reads 1 file and reports nothing |

- Expected execution process: the operator replays the F14 case, reads the case that builds the fixture, then builds the same fixture by hand from the suite's `buildRepo` with the real `sk-code` hub, runs `quality-gate.cjs --format json` on it and reads the fields the table names before loading each listed checklist in the order given. Each run is wrapped in the fixture builder's snapshot check, so a run that writes any file fails the command rather than the reading.
- Expected signals: `gate` is `NO_BLOCKER_FOUND`, `exit_code` is `0`, `checklists` holds the universal floor first and `hub:sk-code/sk-code-ci/references/ci-workflow-standards.md` second, and the `syntax-yaml` row reads `RAN_CLEAN` over 1 file.
- Desired user-visible outcome: the author loads the CI checklist beside the floor and edits the workflow against both, rather than against the YAML alone.
- Pass/fail: PASS if every value in the expected-result table below holds and the fixture snapshot is unchanged. FAIL if the CI checklist is missing, if the floor is not first, if the YAML check covers no file, or if the gate is not `NO_BLOCKER_FOUND`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my edited .github/workflows/ci.yml.`

### Commands

Run the commands from the repository root.

1. `node --test --test-reporter=tap --test-name-pattern='^F14' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('F14/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. Build fixture F14 by hand in a temporary repository against the real hub, run the gate on it and assert every field the table names.

```bash
node -e '
const assert = require("node:assert/strict");
const path = require("node:path");
const Q = path.resolve(".skilled/skills/sk-code/sk-code-quality/scripts");
const { assertSnapshotUnchanged, buildRepo } = require(path.join(Q, "tests/fixtures.cjs"));
const repo = buildRepo({
  hub: "real",
  change: { ".github/workflows/x.yml": "name: x\non: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n" },
});
try {
  const run = assertSnapshotUnchanged(repo, () => repo.run(["--format", "json"]));
  const verdict = run.verdict;
  const yaml = verdict.checks.find((entry) => entry.id === "syntax-yaml");
  assert.equal(run.status, 0);
  assert.equal(verdict.gate, "NO_BLOCKER_FOUND");
  console.log("gate " + verdict.gate);
  assert.equal(verdict.exit_code, 0);
  console.log("exit_code " + verdict.exit_code);
  assert.ok(verdict.checklists.length >= 2, "fewer than two checklist rows");
  assert.equal(verdict.checklists[0].file, "hub:sk-code/shared/references/universal/code-quality-standards.md");
  console.log("checklists[0].file " + verdict.checklists[0].file);
  assert.equal(verdict.checklists[1].file, "hub:sk-code/sk-code-ci/references/ci-workflow-standards.md");
  console.log("checklists[1].file " + verdict.checklists[1].file);
  assert.ok(yaml, "the syntax-yaml row is missing");
  assert.equal(yaml.state, "RAN_CLEAN");
  console.log("syntax-yaml state " + yaml.state);
  assert.equal(yaml.files, 1);
  console.log("syntax-yaml files " + yaml.files);
  assert.equal(verdict.coverage.files_checked, 1);
  console.log("coverage.files_checked " + verdict.coverage.files_checked);
  console.log("fixture snapshot after the run unchanged");
} finally {
  repo.cleanup();
}
'
status=$?
echo "exit $status"
(exit $status)
```

4. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F14 and prints `# pass 1` then `# fail 0`. Step 2 shows the seeded workflow, the `hub: 'real'` call and the two checklist assertions. Step 3 builds the same fixture by hand against the real hub and prints one line per field, one for `gate`, `exit_code`, `checklists[0].file`, `checklists[1].file`, the `syntax-yaml` `state`, the `syntax-yaml` `files` count and `coverage.files_checked`, plus a closing line for the snapshot check, and a closing `exit` line that prints `exit 0` and is also the status the step exits with. Step 4 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | `NO_BLOCKER_FOUND` |
| `exit_code` | `0` |
| `checklists[0].file` | `hub:sk-code/shared/references/universal/code-quality-standards.md` |
| `checklists[1].file` | `hub:sk-code/sk-code-ci/references/ci-workflow-standards.md` |
| `syntax-yaml` `state` | `RAN_CLEAN` |
| `syntax-yaml` `files` | `1` |
| `coverage.files_checked` | `1` |
| fixture snapshot after the run | unchanged |

### Evidence

Command transcript from steps 1 to 4, the frontmatter block with `expected_intent: QUALITY`, the field lines step 3 prints, the two `checklists` rows in order, and the `syntax-yaml` row. Save the transcript under the dated run label the playbook names.

### Pass / Fail

- **Pass**: the gate is `NO_BLOCKER_FOUND`, exit is `0`, the floor row comes before the CI checklist row, the YAML check reads 1 file as clean, and the fixture snapshot is unchanged.
- **Fail**: any other gate or exit, a missing CI checklist row, the floor not first, a YAML check that reads no file, or a changed fixture snapshot.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see which of the checklist or coverage assertions failed.
2. If the CI checklist row is missing, read the `sk-code-ci` entry in the hub `mode-registry.json` and confirm its `quality.checklists` entry still names `sk-code-ci/references/ci-workflow-standards.md` and still selects `.github/workflows/**`.
3. If `syntax-yaml` reads `NOT_APPLICABLE`, the file is out of scope rather than clean. Confirm the changed path against the scope rules in the runner contract before recording a result. Record the row as found and route the defect to the phase that owns the declaration.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §3 | The checklist sources and the --explain pointer |
| [SKILL.md](../../../sk-code-skilled/SKILL.md) §5 | This repository's quality checklist map |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F14 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §3 | The `checklists` and `checks` fields this scenario reads, and the YAML check row |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/ci-target-change.md`
