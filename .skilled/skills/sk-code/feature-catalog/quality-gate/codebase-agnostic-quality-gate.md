---
title: "Codebase-Agnostic Quality Gate"
description: "One runner prints one machine verdict for a change in any repository, from built-in sensors, a comment-hygiene call, a parse floor and the checks the repository names."
trigger_phrases:
  - "codebase-agnostic quality gate"
  - "quality gate runner"
  - "quality-gate.cjs"
  - "run the quality gate"
version: 1.0.0.0
---

# Codebase-Agnostic Quality Gate (quality-gate.cjs)

## 1. OVERVIEW

One runner prints one machine verdict for a change in any repository, from built-in sensors, a comment-hygiene call, a parse floor and the checks the repository names.

`node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` reads a change, runs what it can prove and reports what it could not check. It writes no file. No verdict ever reads pass: exit 0 says only that no blocker was found and every required check produced evidence, and the acting agent still owns every judgment item.

---

## 2. HOW IT WORKS

### Scope

The runner checks one scope per run. `--worktree`, the default, reads the uncommitted change against `HEAD`. `--base REF` reads everything since the merge base of `REF` and `HEAD`. `--files PATH...` reads exactly the named files and is the only scope that works outside git. `--explain PATH` says why each checklist and check applies to one file and runs nothing. `--lines changed|file` reports findings on changed lines only or on the whole file.

### What Runs

Built-in sensors, one comment-hygiene call and a parse floor run on every scope. The runner probes which hooks and workflows enforce hygiene and resolves the checklists that the hub and the repository declare. The only commands a repository can make it start are the ones its committed config names, each run as an argv array under a deadline and inside the workspace guard. A command a manifest only implies is reported under `suggested_checks` and never started. `--no-run` lists the spawned and configured checks as `LISTED` and starts none, and `--only` and `--skip` narrow the check ids.

### Verdict And Exit Codes

`--format json|text|envelope` picks the output form, and JSON is the default. The exit code carries the verdict: 0 `NO_BLOCKER_FOUND`, 1 `BLOCKED` for a blocking P0 finding or a failed required P0 configured check, 2 `NOTHING_CHECKED` when no check applied to any file, 3 `ERROR` for a usage or config error or a check that changed the workspace, and 4 `UNVERIFIED` when nothing blocks but a required check produced no evidence. The run verdict has three readers: the verify workflow, the `Quality Gate` field of the @code return and `sk-code-review`, which reads it as input evidence only.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Script | The runner: scope resolution, sensors, checks and the verdict |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs` | Shared | Argv spawns, process-group kills and the workspace guard |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs` | Shared | The bounded `node --check` pool behind the parse floor |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Script | The comment-hygiene checker the runner calls once |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Shared | The CLI, exit codes, states, verdict schema and envelope grammar |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Node test | Flags, scopes, verdicts and exit codes |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` | Node test | The parse-floor pool |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/check-comment-hygiene.test.sh` | Automated test | The comment-hygiene checker |

---

## 4. SOURCE METADATA

- Group: Quality Gate
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `quality-gate/codebase-agnostic-quality-gate.md`

Related references:
- [repository-quality-config.md](repository-quality-config.md) for the commands a repository can name.
- [sk-code-setup-and-quality-doctor.md](../doctor-commands/sk-code-setup-and-quality-doctor.md) for the doctor that probes the gate.
