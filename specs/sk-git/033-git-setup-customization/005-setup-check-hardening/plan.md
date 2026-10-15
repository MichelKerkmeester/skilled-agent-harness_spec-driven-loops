---
title: "Implementation Plan: Phase 5: setup-check-hardening"
description: "Make the read-only /doctor:git setup battery truthful and its repairs safe: a DEGRADED status with exit 3, event-aware AI-tool registration, a suppression row that reads hook-flags.env, proved repairs, trust-boundary hardening and three green CI jobs. Built one change per brief by a cli-pi executor and verified by the orchestrator."
trigger_phrases:
  - "setup check hardening plan"
  - "git-setup-check hardening plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: setup-check-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script (`git-setup-check.cjs`), YAML and Markdown command assets, one GitHub Actions workflow |
| **Framework** | None. The battery uses `node:child_process`, `node:fs` and `node:path` only |
| **Storage** | None. The battery reads git config and files and writes nothing |
| **Testing** | `node:test` suite `tests/git-setup-check.test.cjs`, run by `.skilled/commands/doctor/scripts/tests/run-all.sh` |

### Overview
The battery decides its verdict from FAIL rows alone (`git-setup-check.cjs:681-686`, `:753-759`), so this plan first changes the status model to OK, DEGRADED and FAIL with exits 0, 3 and 1. It then fixes the two review P1 rows, makes the gates, worktrees and AI-tool rows verify what they claim and replaces the repairs that do not fix their rows. After that come the trust-boundary P2s and the weak tests. The CI and doc fixes close the phase. Each change lands as its own brief, test first, and the orchestrator confirms it with a diff and a mutation check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (`spec.md` section 5, `acceptance-criteria.md`)
- [x] Dependencies identified. The hooks-repair question was resolved on 2026-10-15 with option A

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, or Waived or Superseded by an ADR
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` passes, with the before and after counts recorded
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` passes
- [ ] `bash .github/scripts/check-gate-inputs.sh` and its test pass
- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` passes on every touched doc
- [ ] Each code change has a recorded mutation check: its fix reverted, its new test seen failing, the fix restored
- [ ] Docs updated (spec, plan and tasks agree)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single-pass CLI battery. An ordered list of checks (`git-setup-check.cjs:637-649`) each returns one verdict object. `runCheck` (`:653-667`) turns a throw into UNKNOWN, and `main` (`:734-760`) folds the rows into one status, one exit code and one rendering.

### Key Components
- **Status fold (`renderHuman`, `main`)**: the only place a verdict becomes an exit code. It gains DEGRADED with this precedence: any FAIL gives FAIL with exit 1, else any UNKNOWN or DEGRADED gives DEGRADED with exit 3, else OK with exit 0. The `repair:` line prints for FAIL and DEGRADED rows.
- **Verdict constructors (`:197-200`)**: add `degraded(source, details, repair)`. Only the gates row uses it.
- **Process boundary (`safeGitEnv`, `runCommand`)**: resolves `git` and `bash` to absolute paths once, drops the git variables that select a repository and drops `GATE_REGISTRY` for the gate helper.
- **Safe reader**: one helper that reads a repository file only when `fs.statSync` reports a regular file under the size cap and, where asked, refuses a symlink through `fs.lstatSync`. The hook-flags, adapter-config and allowlist reads all go through it.
- **Registration matcher**: a per-runtime table of event name, matcher field and the shell tool names the matcher must match. Claude is `PreToolUse` with `['Bash']` and accepts a missing or empty matcher. Codex is `PreToolUse` with `['exec', 'Bash']`. Devin is `PreToolUse` with `['exec']`. Cursor is `preToolUse` with `['Shell']`. An entry counts when its matcher regex matches every listed name and its command, or a nested `hooks[].command`, contains `git-preflight-advisory`.
- **Hook-flags resolver**: picks the file as `hook-flags.sh:12-22` does, parses it as `hook-flags.cjs:107-133` does, strips a byte order mark as `hook-flags.sh:36-38` does and lets a set environment value win as `hook-flags.cjs:160-163` does.

### Data Flow
The battery resolves the repository root, then each check reads git config through absolute `git` and reads files through the safe reader. Each check returns a verdict with source, details and repair. The fold turns the rows into a STATUS line or a JSON object and an exit code. Nothing flows back into the repository.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet plans from a CONDITIONAL deep-review verdict, so the addendum applies. The review's Planning Packet (`../004-final-deep-review/review/review-report.md:29-55`) was imported as inert data. Its values are: "findingClasses" set to "cross-consumer", "matrix/evidence" and "trust-boundary". "fixCompletenessRequired" is true. "affectedSurfacesSeed" lists "git-setup-check.cjs", "tests/git-setup-check.test.cjs", "hook-flags.cjs", "sk-git/scripts/hooks/README.md" and "002-doctor-git-setup/acceptance-criteria.md". Its "activeFindings" entries carry no "findingClass", "scopeProof" or "affectedSurfaceHints" fields, so those are UNKNOWN in the source and the classes below are the planner's, from re-reading each cited line. No imported value was executed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `git-setup-check.cjs` `checkSuppression` (`:559-567`) | Producer of the suppression verdict, env only | Update (REQ-001, cross-consumer with `hook-flags.cjs`) | Fixture with the flag in `hook-flags.env` and not in env fails the row |
| `hook-flags.cjs` (`:87-173`), `hook-flags.sh` (`:12-38`) | The readers the hooks really use | Unchanged, mirrored | Tests reuse their precedence cases: env empty wins, file truthy fails, BOM, quotes, trailing comment |
| `git-setup-check.cjs` `registersAdvisory` (`:580-584`) | Producer of the registration verdict | Update (REQ-002, cross-consumer with four runtime configs) | Wrong-event negative test per runtime, plus a PASS on each real config shape |
| `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json` | The real wiring the matcher must accept | Unchanged, read as fixtures | A test runs the battery against copies of each real config and expects registered |
| `sk-git/scripts/hooks/README.md` (`:77-78`) | Doc contract for the wiring | Update the Claude and Codex rows | Diff shows the matcher text equal to the config files |
| `renderHuman`, `main` (`:673-760`) | The only status fold | Update (REQ-003, matrix/evidence) | Status matrix tests below |
| `doctor-git-setup.yaml`, `doctor-git-presentation.txt`, DOC-384, `manual-testing-playbook.md:947`, `doctor-git-settings.md:29`, `README.md:1505` | Consumers of the exit codes and the STATUS line | Update | `rg -n 'exits? 0\|STATUS=OK\|STATUS=FAIL' <those files>` shows the new codes everywhere |
| `checkGates` (`:295-310`), `git-hook-gates.cjs:210` | Producer and its env-steered input | Update the producer, leave the helper | Tests for no `gates` key, a saved-off gate and `GATE_REGISTRY` set in the parent env |
| `checkAiToolHooks` (`:586-632`) | Producer of the adapter verdict | Update (REQ-005) | Tool-less run gives UNKNOWN, and OpenCode or Pi files without the anchors fail |
| `checkWorktrees` (`:445-474`), `WORKTREE_REPAIR` (`:74`) | Producer and its repair | Update (REQ-006) | Unwritable existing base fails, a file at the base fails, the env-sourced repair names the variable |
| `INSTALL_REPAIR` (`:72`), `CONTRACT_REPAIR` (`:75`), hooks repair (`:228-230`) | Repair strings | Update (REQ-007 to REQ-009, trust-boundary for the hooks repair) | REQ-010 round-trip tests, with both hooks branches: this checkout and another repository |
| `safeGitEnv`, `runCommand`, `git`, `commonDirFor`, `checkAllowlist`, `checkCommitId`, `main` (`:126-161`, `:260`, `:360`, `:493`, `:744`) | Every child process | Update (REQ-017, REQ-018, trust-boundary) | Tests with `GIT_DIR` exported and with `.` first in `PATH` plus a planted `./git` |
| `allowlistFileFor`, `allowlistPatternsIn` (`:382-398`) | Allowlist display | Update (REQ-019, trust-boundary) | Symlinked allowlist is refused and its lines are absent from the report |
| `tests/git-setup-check.test.cjs` | The suite that pinned the old contract | Update | Run-all count rises, and each new test fails under its mutation |
| `.github/workflows/gate-inputs.yml` | CI job | Update (REQ-011) | Workflow run on the pushed commit, plus `check-gate-inputs.sh` locally |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Frozen manifest | Regenerate (REQ-012) | `test_readme_manifest.py` exits 0, and the diff adds one directory |
| `doctor-git-settings.md:2` | Catalog leaf | Update (REQ-013) | `validate_catalog_package.py` exits 0 |
| 002 `acceptance-criteria.md:55`, `:60`, 002 `tasks.md:35`, 034 `tasks.md:34`, `:50` | Evidence rows | Update (REQ-021, REQ-025, matrix/evidence) | `validate.sh --strict` on both packets |

Required inventories, run at T002 and recorded in the task's evidence:
- Same-class producers: `rg -n "readFileSync|existsSync|spawnSync|runCommand\(" .skilled/commands/doctor/scripts/git-setup-check.cjs`.
- Consumers of changed symbols: `rg -n "STATUS=OK|STATUS=FAIL|exits? 0|git-setup-check|DEGRADED" . --glob '*.md' --glob '*.yaml' --glob '*.txt' --glob '*.cjs' --glob '!specs/**'`.
- Matrix axes for the status fold: rows present (PASS, SKIP, UNKNOWN, DEGRADED, FAIL) by output mode (human, JSON). The required rows are OK from PASS only, OK from PASS plus SKIP, DEGRADED from UNKNOWN, DEGRADED from a DEGRADED row, FAIL from FAIL alone and FAIL from FAIL plus UNKNOWN. Six rows in two modes make twelve assertions.
- Matrix axes for registration: runtime (four) by event (right or wrong) by matcher (matching, non-matching, absent). Each runtime needs at least a real-shape PASS, a wrong-event FAIL and a wrong-matcher FAIL.
- Algorithm invariant for the safe reader: a read happens only on a regular file under the cap. The adversarial cases are a FIFO, a symlink to a file outside the repository, a directory at the file path, an empty file and a file one byte over the cap.
- Algorithm invariant for binaries: no child process starts from a path relative to the inspected repository. The adversarial cases are an empty `PATH` entry, a `.` entry, a trailing `:` and a relative `bin` entry, each with a planted `git` that writes a marker.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is status model first, because every later test asserts a status, then the two P1 fixes, the truthful checks, the repairs and the hardening and tests. The CI and doc fixes come last.

### Execution Model

The implement step runs as one orchestrator and one executor.

1. **Executor.** DeepSeek V4.1 Flash at max effort, dispatched through cli-pi, makes edits one at a time. The orchestrator reads `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` before composing the first brief, because that contract owns the invocation. Its rule 12 at `SKILL.md:218` sets the brief size: one change per brief, naming the file, the edit and the check that proves it.
2. **Brief.** The orchestrator writes each brief from one task row in `tasks.md`. It quotes the current lines the edit replaces and names the test the edit must make pass.
3. **Verify.** After each brief the orchestrator reads the diff, and the diff must touch only the files the brief named. It then runs the task's test and the whole `run-all.sh`.
4. **Mutation check.** For each code fix the orchestrator reverts the fix alone, confirms the new test fails for the reason it was written for, then restores the fix and confirms the test passes. The result goes in the task's evidence.
5. **Gates.** `run-all.sh` for the doctor scripts, `route-validate.sh`, `.github/scripts/check-gate-inputs.sh` and `hvr_scan.py` on every touched doc. They run after each workstream and once more on the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit and fixture | Each check against throwaway repositories with isolated git config, through the battery's JSON and human output and exit code | `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` |
| Repair round trip | Each repair line applied to its failing fixture, then the battery rerun | Same suite, one test per repair (REQ-010) |
| Mutation | Each fix reverted to prove its test catches the defect | Orchestrator, recorded per task |
| Integration | The whole doctor script suite, the route manifest and the gate inputs | `run-all.sh`, `route-validate.sh`, `check-gate-inputs.sh` |
| CI | Gate Inputs, sk-doc Script Tests and the Feature catalog job on the pushed commit | GitHub Actions, read with `gh run view` |
| Manual | DOC-384 through the real runtime on this checkout | The playbook scenario |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator answer on the hooks repair for a foreign repository (`spec.md` section 10) | Internal decision | Green, option A chosen on 2026-10-15 | None remaining |
| `hook-flags.cjs` and `hook-flags.sh` precedence | Internal contract | Green | REQ-001 mirrors it, and a change there would need a matching change here |
| The four runtime configs in this checkout | Internal fixtures | Green | REQ-002's PASS shapes come from them |
| cli-pi with DeepSeek V4.1 Flash | External executor | Yellow, not probed during planning | The orchestrator falls back to editing directly and records the deviation |
| `npm` and `tsc` on the Gate Inputs runner | External CI | Green, the sk-doc workflow already uses both | REQ-011 cannot be confirmed without a pushed run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate fails after a change and the fix is not found within three attempts, or the operator rejects the DEGRADED contract after it lands.
- **Procedure**: every change is one brief with one diff, so `git revert` of that commit, or `git restore` of its files before commit, undoes it alone. The status model is one commit with its doc updates, so reverting it restores the old exit codes everywhere at once.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline, inventories) ──► Status model ──► P1 fixes ──► Truthful checks ──► Repairs ──► Hardening and tests
                                                                                                        │
                                                                     CI fixes (independent) ──► Docs ◄──┘ ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Everything |
| Status model | Setup | Every test that asserts a status |
| P1 fixes | Status model | Repairs (the suppression repair text) |
| Truthful checks | Status model | Repairs |
| Repairs | Truthful checks | Repair round trips |
| Hardening and tests | Status model | Verify |
| CI fixes | Setup | Verify |
| Docs | Status model, Truthful checks | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Medium | 25 to 30 briefs, about one each 15 minutes with verification |
| Verification | Medium | 1 to 2 hours, including the CI runs |
| **Total** | | **8 to 10 hours of orchestrated work** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `run-all.sh` counts recorded at T001
- [ ] No feature flag applies: the battery is a read-only CLI
- [ ] CI runs for Gate Inputs, sk-doc Script Tests and the catalog job read after the push

### Rollback Procedure
1. Stop the next brief.
2. Revert the offending commit with `git revert <sha>`.
3. Rerun `run-all.sh` and the battery on this checkout and confirm the pre-change counts and `STATUS=OK checks=11`.
4. Tell the operator which requirement reopened.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The manifest refresh is reverted with its commit.
<!-- /ANCHOR:enhanced-rollback -->

---
