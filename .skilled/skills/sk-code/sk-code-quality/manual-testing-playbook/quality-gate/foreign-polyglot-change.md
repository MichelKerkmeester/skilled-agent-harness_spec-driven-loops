---
id: CQ-002
category: quality_gate
title: 'Foreign polyglot change blocks on all seven seeded labels'
description: "This scenario validates the gate run for `CQ-002`. It replays fixture F01, a change across six language families in a repository with no sk-code surface packet, and confirms the gate blocks on the seven seeded comment labels while the surface stays unknown."
expected_intent: QUALITY
expected_resources:
  - references/runner-contract.md
  - scripts/quality-gate.cjs
  - assets/quality-defaults.json
version: 1.1.3.0
---

# CQ-002: Foreign Polyglot Change Blocks On All Seven Seeded Labels

This document captures the run contract, execution process, source anchors and metadata for `CQ-002`.

---

## 1. OVERVIEW

This scenario validates the gate run for `CQ-002`. Fixture F01 seeds one change across six language families in a repository that carries no sk-code surface packet, no pre-commit hook, no CI workflow and no post-edit hook. The runner therefore resolves the surface to `unknown`, and the run is judged by the universal floor plus the runner's own checks alone. Seven files carry one comment label each, and the URL beside the spec path in the TypeScript file is the control case that must stay silent.

### Why This Matters

A repository with no surface packet is the case the program goal names, and Iron Law 3 forbids any standard on an `unknown` surface. If the gate neither blocks nor reports why, an author working in such a repository can neither satisfy the gate nor learn what to fix. A miss here also undercuts the catch-rate target, because F01 is the corpus that target is measured on.

---

## 2. SCENARIO CONTRACT

Operators confirm that the seeded change returns the blocking gate value (the exit `1` row of the gate table in the runner contract), that every one of the seven labels is reported as an exact blocking finding on its changed line, and that the surface stays `unknown`.

- Objective: confirm the gate value, the exit code, the resolved surface and the seven findings for fixture F01.
- Real user request: `I edited files in a polyglot checkout that has no surface packet. Run the quality gate before I claim done.`
- Prompt: `Run the quality gate on this foreign polyglot change before I claim done.`

**Exact prompt**:

```text
Run the quality gate on this foreign polyglot change before I claim done.
```

- Fixture: F01, built in a temporary git repository outside the working tree. The builder commits a README as the base, then writes the seven changed files. Each seeded label is joined from fragments at run time, exactly as the fixture does, so no label is written literally here.

| File | Seeded content | What the gate must say |
| --- | --- | --- |
| `a.go` | a Go line comment naming an architecture decision number | blocking, exact |
| `b.rs` | a Rust line comment naming a fixed issue by number | blocking, exact |
| `c.yaml` | a YAML comment naming a packet number | blocking, exact |
| `d.css` | a CSS block comment naming a requirement number | blocking, exact |
| `e.py` | a Python docstring naming a requirement number in its long form | blocking, exact |
| `f.ts` | a TypeScript comment holding a repository spec path and a documentation URL | blocking on the spec path only, exact, and nothing for the URL |
| `g.mts` | a TypeScript module comment naming a task id | blocking, exact |

- Expected execution process: the operator builds F01 in a temporary repository, runs `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --worktree --format json` inside that repository, reads the gate and the finding rows, then loads the universal floor the verdict lists before any completion claim. The snapshot of the fixture folder is compared before and after the run, and the run must leave it unchanged.
- Expected signals: `gate` is the exit `1` blocking value from the runner contract gate table, `exit_code` is `1`, `resolved_surface` is `["unknown"]`, and the seven blocking findings are `exact`, `P0` and `changed-line`, one per seeded file.
- Desired user-visible outcome: the gate refuses the completion claim and names one file and line per label, so the author removes the labels rather than guessing what failed.
- Pass/fail: PASS if every value in the expected-result table below holds and the fixture snapshot is unchanged. FAIL if any value differs, if a seeded label is not reported, or if the URL raises a finding.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the quality gate on this foreign polyglot change before I claim done.`

### Commands

1. `node --test --test-reporter=tap --test-name-pattern='^F01' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
2. `sed -n "/^test('F01/,/^}));/p" .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`
3. `for p in references/runner-contract.md scripts/quality-gate.cjs assets/quality-defaults.json; do test -e ".skilled/skills/sk-code/sk-code-quality/$p" && echo "OK $p" || echo "MISS $p"; done`

### Expected

Step 1 replays F01 and prints `# pass 1` then `# fail 0`. Step 2 shows the seven seeded files, the base README and the `withRepo` call that keeps the fixture in a temporary repository. Step 3 prints `OK` for all three paths.

| Signal | Expected value |
| --- | --- |
| `gate` | the exit `1` blocking value in the runner contract gate table |
| `exit_code` | `1` |
| `resolved_surface` | `["unknown"]` |
| blocking findings with `confidence` `exact` | `7` |
| finding files | `a.go`, `b.rs`, `c.yaml`, `d.css`, `e.py`, `f.ts`, `g.mts` |
| finding `severity` and `origin` | `P0` and `changed-line` on every one |
| URL beside the spec path in `f.ts` | no finding |
| fixture snapshot after the run | unchanged |

### Evidence

Command transcript from steps 1 to 3, the frontmatter block with `expected_intent: QUALITY`, the finding rows quoted for each of the seven files, and the snapshot result. Save the transcript and the verdict excerpt under the dated run label the playbook names. Never paste the seeded labels into a tracked document.

### Pass / Fail

- **Pass**: the gate is the exit `1` blocking value, exit is `1`, the surface is `unknown`, seven exact blocking findings name the seven seeded files, the URL raises nothing, and the fixture snapshot is unchanged.
- **Fail**: any other gate or exit, a missing finding, a finding on the URL, a surface other than `unknown`, or a changed fixture snapshot.

### Failure Triage

1. Rerun step 1 alone with `--test-reporter=spec` to see the assertion that failed, which names the field the verdict disagreed on.
2. If the count differs, rerun step 2 and compare the seeded file list against the finding files. A file with no comment family in `assets/comment-syntax.json` is listed as unchecked rather than judged, so read `coverage.unchecked` before treating it as a miss.
3. If a label reads `heuristic` rather than `exact`, or a URL raises a finding, the label pattern or the URL span rule drifted. Record the row as found and route the defect to the phase that owns the checker surface.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) §2 | Target-path and surface routing the runner consumes, including the `UNKNOWN` row |
| [quality-gate.test.cjs](../../scripts/tests/quality-gate.test.cjs) | The F01 case this scenario replays |
| [runner-contract.md](../../references/runner-contract.md) §2 and §3 | Gate values, exit codes and the verdict fields this scenario reads |

---

## 5. SOURCE METADATA

- Group: sk-code-quality quality gate
- Playbook ID: CQ-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `quality-gate/foreign-polyglot-change.md`
