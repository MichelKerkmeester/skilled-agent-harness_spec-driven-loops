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
version: 1.1.3.0
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

- Expected execution process: the operator builds F14 in a temporary repository, runs `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --worktree --format json` inside that repository, reads `gate`, `checklists` and the `syntax-yaml` row, then loads each listed checklist in the order given. The snapshot of the fixture folder is compared before and after the run, and the run must leave it unchanged.
- Expected signals: `gate` is `NO_BLOCKER_FOUND`, `exit_code` is `0`, `checklists` holds the universal floor first and `hub:sk-code/sk-code-ci/references/ci-workflow-standards.md` second, and the `syntax-yaml` row reads `RAN_CLEAN` over 1 file.
- Desired user-visible outcome: the author loads the CI checklist beside the floor and edits the workflow against both, rather than against the YAML alone.
- Pass/fail: PASS if every value in the expected-result table below holds and the fixture snapshot is unchanged. FAIL if the CI checklist is missing, if the floor is not first, if the YAML check covers no file, or if the gate is not `NO_BLOCKER_FOUND`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on my edited .github/workflows/ci.yml.`

### Commands

1. `node --test --test-reporter=tap --test-name-pattern='^F14' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('F14/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F14 and prints `# pass 1` then `# fail 0`. Step 2 shows the seeded workflow, the `hub: 'real'` call and the two checklist assertions. Step 3 prints `OK` for all three paths.

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

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the two `checklists` rows in order, and the `syntax-yaml` row. Save the transcript under the dated run label the playbook names.

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
| [SKILL.md](../../SKILL.md) §2 | The target-path checklist map and the two declaration sources it renders |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F14 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §3 | The `checklists` and `checks` fields this scenario reads, and the YAML check row |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-004
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/ci-target-change.md`
