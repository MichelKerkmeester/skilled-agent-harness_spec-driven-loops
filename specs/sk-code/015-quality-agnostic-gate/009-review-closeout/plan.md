---
title: "Implementation Plan: Phase 9: review-closeout"
description: "Implements the operator-accepted review items in lanes: three runner changes in sequence on quality-gate.cjs, then a parity test, the @code step, the record fixes and the release work in parallel, each lane ending with the command that decides it."
trigger_phrases:
  - "review closeout plan"
  - "quality gate trust plan"
  - "syntax node pool plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 9: review-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node 22 CommonJS (`.cjs`) for the runner, the doctor script and the tests, Markdown and TOML for the agent copies and the records |
| **Framework** | None. Node built-in modules only: `node:test`, `node:child_process`, `node:fs`, `node:path` and `node:os` |
| **Storage** | None. A run still writes nothing. The one new file is `evidence/timing.json`, written by the lane that measures |
| **Testing** | `node --test` over the quality suite, the doctor suite and the sk-code-skilled suite, the mirror check, five timed runs and the strict validator |

### Overview
Ten requirements in seven lanes. Lane A scopes the outside-skill faults (REQ-001), lane B adds the trust grant for configured checks (REQ-002) and lane C pools the node syntax check and records the timing (REQ-003). All three edit `quality-gate.cjs`, so they run A, then B, then C. Lanes D to G run beside them: the parity test (REQ-004), the @code step (REQ-005), the record fixes (REQ-006 to REQ-009) and the release work (REQ-010), which lands last. Every task in `tasks.md` names the command whose output decides it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator acceptance of 2026-10-26 is recorded in `decision-record.md` and the parent goal's deviation log.
- [ ] The suite baseline is recorded before the first source edit: `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs 2>&1 | rg '^# (tests|fail)'`.
- [ ] Scope is frozen in `spec.md` section 3, and no file outside it changes.

### Definition of Done
- [x] Every row of `acceptance-criteria.md` is `Met`, with the command and its output in the cell.
- [x] The quality, doctor and sk-code-skilled suites print `# fail 0`.
- [x] `evidence/timing.json` holds five full runs under 2000 ms on the reference machine.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: narrow changes inside the existing runner pipeline, plus record edits. The verdict schema name, the exit codes and the gate precedence keep their shape.

### Key Components
- **Checklist row resolution in `quality-gate.cjs`**: today pushes `CHECKLIST_OUTSIDE_SKILL` and `CHECKLIST_ROW_INVALID` into `errors[]` for every installed skill. After lane A it pushes into `errors[]` only for a skill whose surface applies to a file in scope, and into `config.warnings` for the rest.
- **Configured check planning in `quality-gate.cjs`**: after lane B it reads the trust grant once per run, before any configured spawn, and marks each configured check `SKIPPED_UNTRUSTED` when no grant holds.
- **`runNodeCheck` in `quality-gate.cjs`**: after lane C it runs `node --check` through a pool bounded by `os.availableParallelism()` and gathers results by input index.
- **`sk-code-quality-config.cjs status`**: after lane B it prints the trust state and which grant holds, and writes nothing.
- **`declared-surfaces-parity.test.cjs`**: lane D loads both readers and compares their labels over the hub's surface packets.

### Data Flow
1. Scope resolves the files in scope.
2. Surfaces resolve per file. Lane A uses this set to decide whether an outside skill's fault applies.
3. The config layer loads. Lane B reads the grant here and passes it to check planning.
4. Built-in checks run. Lane C's pool runs the node syntax calls.
5. Configured checks run only under a grant. The rest render as `SKIPPED_UNTRUSTED`.
6. The verdict renders with `config.warnings` beside `config.errors`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase implements review findings, and it touches a trust boundary and a shared reader, so the inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Checklist row validation in `quality-gate.cjs` | Raises the two outside-skill codes into `errors[]` for any installed skill | update: scoped to applying surfaces, the rest into `config.warnings` | The two lane A cases in `quality-gate.test.cjs` |
| Configured check planning in `quality-gate.cjs` | Runs every configured check the repository config names | update: runs only under a grant | The four grant cases and the no-grant case in `configured-checks.test.cjs` |
| `runNodeCheck` in `quality-gate.cjs` | Spawns `node --check` once per file in sequence | update: bounded pool, same findings | The pool parity case and `evidence/timing.json` |
| `sk-code-quality-config.cjs` | Reports the config and its tools | update: reports the trust state | The doctor suite |
| `.skilled/scripts/git-hooks/*` and `skilled.trustRepoHooks` | The hook trust grant | unchanged, and not a consumer of the new key | `rg -c 'trustRepoChecks' .skilled/scripts/git-hooks` prints nothing |
| `.skilled/plugins/system-skill-advisor.js` `declaredSurfaces` | The plugin copy | update: `surfaceEntry` drops a block with no marker of any kind, as the hub reader does, so both list the same surfaces; read by the parity test | `declared-surfaces-parity.test.cjs` |
| `.skilled/agents/code.md` and its mirrors | Names the runner by a repository-root path | update: names it by the loaded skill's location | `node .skilled/bin/check-agent-mirror-sync.cjs --all` |
| `workflow-verify.md` and the review mode | Read the envelope | consumers of `config.warnings`, which they may ignore | `rg -n 'config.errors' .skilled/skills/sk-code` lists every reader, and none fails on an added field |

Required inventories:
- Same-class producers: `rg -n 'CHECKLIST_OUTSIDE_SKILL|CHECKLIST_ROW_INVALID' .skilled/skills/sk-code/sk-code-quality/scripts` lists every place the two codes are raised.
- Consumers of the trust key: `rg -n 'trustRepoChecks' .skilled` lists the runner, the doctor, the two references and the tests, and nothing under the git hooks.
- Matrix axes: fault surface (applies, does not apply), trust grant (hub repository, git config true, git config false or absent, `--config`, `skcode.qualityConfig` in the repository's own `.git/config`), check requirement (required, optional), file kind for the pool (`.js`, `.mjs`, none). Row count, 2026-10-26: 12 rows, each axis tested on its own rather than crossed. Fault surface: `quality-gate.test.cjs` lines 744 and 728. Trust grant: `configured-checks.test.cjs` lines 312 (hub, case 12), 189 (git config true, case 6), 167 (absent, case 5), 219 (`--config`, case 8) and 250 (`skcode.qualityConfig`, case 9); a false value rests on the `--bool` read compared with `true`, and line 205 (case 7) proves a value that is not a git boolean grants nothing. Requirement: lines 167 (required) and 345 (optional). File kind: `.js` at `quality-gate.test.cjs` line 1909, `.mjs` at line 1848; none rests on the empty-list return in `runNodeCheck`, with no case of its own.
- Algorithm invariant: the pool's output equals the sequential output for the same file list. Adversarial cases: a file with a syntax error in the middle of the list, a file that does not exist, and a list longer than the pool bound.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the task rows and their checkboxes. The lanes run in this order.

| Lane | Requirements | Files | Runs |
|------|--------------|-------|------|
| A | REQ-001 | `quality-gate.cjs`, `quality-gate.test.cjs`, `runner-contract.md` | First on `quality-gate.cjs` |
| B | REQ-002 | `quality-gate.cjs`, `configured-checks.test.cjs`, `quality-config.md`, `runner-contract.md`, the doctor script and its tests | After A |
| C | REQ-003 | `quality-gate.cjs`, `quality-gate.test.cjs`, `evidence/timing.json` | After B |
| D | REQ-004 | `declared-surfaces-parity.test.cjs` | In parallel with A to C |
| E | REQ-005 | `.skilled/agents/code.md` and its mirrors | In parallel with A to C |
| F | REQ-006 to REQ-009 | The phase 001 to 008 records, the 006 records, the benchmark README, the 053 goal and the parent spec | In parallel with A to C |
| G | REQ-010 | Versions, changelogs and the packet changelog | Last, after A to F land |

### Verification commands
1. `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs 2>&1 | rg '^# (tests|fail)'` prints `# fail 0`.
2. `node --test --test-reporter=tap .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs 2>&1 | rg '^# fail'` prints `# fail 0`.
3. `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` exits 0.
4. Timing: `for run in 1 2 3 4 5; do /usr/bin/time -p node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null; done 2>&1 | rg '^real'` prints five `real` lines, and the per-check `duration_ms` of each run goes into `evidence/timing.json`.
5. `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0.
6. `rg -n 'pending operator confirmation' specs/sk-code/015-quality-agnostic-gate` prints no line.
7. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate --recursive --strict | tail -1` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The scoped fault rule, the four trust grants, the pool parity, the doctor trust report and the reader parity | `node:test` in the three suites |
| Integration | A full run over 50 files of this repository, five times | `/usr/bin/time -p` and the verdict's `duration_ms` |
| Manual | The @code step read in a fixture repository with no `.skilled/` tree, and the record edits read against the review list | `rg` and the strict validator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 008 landed | Internal | Green | The files this phase edits would not exist |
| `git` on PATH | External | Green | Neither git config grant can be read and no git common dir can be compared, so only `--config` applies |
| The agent mirror tooling | Internal | Green | Lane E cannot prove the mirrors match |
| Packet 053 owner | Internal | Green | REQ-008 edits one criterion of another packet, within the operator's acceptance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the quality suite fails after a lane lands, a run on this repository reads `SKIPPED_UNTRUSTED` for its own config, or the pool changes a finding.
- **Procedure**: revert the lane's commit with `git revert <sha>`, rerun the verification commands in section 4, and record the cause in `goal.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Lane A (REQ-001) ──► Lane B (REQ-002) ──► Lane C (REQ-003) ──┐
Lane D (REQ-004) ────────────────────────────────────────────┤
Lane E (REQ-005) ────────────────────────────────────────────├──► Lane G (REQ-010) ──► Verify
Lane F (REQ-006 to REQ-009) ─────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lane A | None | Lane B |
| Lane B | Lane A | Lane C |
| Lane C | Lane B | Lane G |
| Lanes D, E, F | None | Lane G |
| Lane G | Lanes A to F | Verify |
| Verify | Lane G | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes for the baselines |
| Core Implementation | Med | Lanes A to C about 2 hours in sequence, lanes D to F about 2 hours in parallel |
| Verification | Med | 45 minutes for the timing runs, the suites and recursive validation |
| **Total** | | **About 4 hours, an assumption** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): N/A, no data changes
- [ ] Feature flag configured: N/A, the trust grant is the switch
- [ ] Monitoring alerts set: N/A, the gate runs locally

### Rollback Procedure
1. Revert the failing lane's commit with `git revert <sha>`.
2. Rerun the section 4 verification commands.
3. Record the revert and its cause in `goal.md` section 4.
4. Tell the operator which accepted item is back open.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. An operator who set `skilled.trustRepoChecks` can remove it with `git config --local --unset skilled.trustRepoChecks`.
<!-- /ANCHOR:enhanced-rollback -->

---
