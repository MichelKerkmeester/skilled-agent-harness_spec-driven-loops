---
title: "Plan: cli-opencode Leg Integration, Evidence & Regression"
description: "Implementation plan for the end-to-end cli-opencode leg run, evidence capture, integration tests, and byte-stability regression proof of the frozen legs — executed on an isolated worktree after children 001 and 002 land."
trigger_phrases:
  - "plan cli-opencode leg integration"
  - "benchmark regression proof plan"
  - "end-to-end opencode leg plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/003-integration-evidence-and-tests"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 plan"
    next_safe_action: "Capture live run on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-003-integration-evidence-and-tests-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: cli-opencode Leg Integration, Evidence & Regression

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS); `opencode` CLI binary for the live leg |
| **Entry point** | `run-command-behavior-matrix.cjs --matrix <manifest> --out-dir <dir>` |
| **Evidence** | `<scenarioId>-cli-opencode.result.json`, `.transcript.jsonl`, `command-behavior-matrix.reconciliation.json` |
| **Testing** | Integration tests (stubbed via `BEHAVIOR_BENCH_SPAWN_JSON`) + byte-diff regression |

### Overview
Sequenced after 001 and 002: flip the minimum set of new cli-opencode cells from `skip` to live,
run the scheduler end-to-end, capture the emitted evidence, add integration tests (deterministic via
the spawn-stub env seam), and prove the frozen legs and fixtures are byte-stable. Live model dispatch
is nondeterministic, so tests assert evidence *shape* and reconciliation *accounting*, not a fixed
verdict.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Children 001 + 002 landed and verified
- [ ] `opencode --version` checked against the v1.3.17 baseline
- [ ] Provider auth pre-flight run (`opencode providers`); default `deepseek` present or operator asked
- [ ] Isolated worktree; main clean/committed; baseline of frozen legs captured

### Definition of Done
- [ ] Live cli-opencode result JSON + reconciliation captured for ≥1 scenario
- [ ] Frozen legs + fixtures byte-stable (diff clean)
- [ ] Integration tests green
- [ ] `validateManifest()` still passes


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scheduler-driven end-to-end run with an offline stub for CI determinism.

### Key Components
- **Scheduler** (`run-command-behavior-matrix.cjs`): `verifyFixture` → `restoreFixture` →
  `invokeRunner` → read `.result.json` → identity check → `writeReconciliation`.
- **Runner** (`behavior-bench-run.cjs`): spawns the leg, observes the stream, writes `.result.json`
  + `.transcript.jsonl`, returns `EXIT_OK`/`EXIT_ENV`.
- **Spawn stub**: `BEHAVIOR_BENCH_SPAWN_JSON` overrides the leg table (prompt appended last) so an
  integration test can drive a deterministic fake `opencode` for CI without the real binary.

### Data Flow
1. Flip the target cell to a `resultPointer` (`<scenarioId>-cli-opencode.result.json`).
2. Run the scheduler; it dispatches the runner with `--leg cli-opencode`.
3. Runner emits result + transcript; scheduler validates identity (`result.leg === "cli-opencode"`).
4. Reconciliation record aggregates `resultCount`/`skipCount`/`status`.
5. Tests + byte-diff confirm evidence shape and frozen-leg stability.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm 001 + 002 landed; capture a baseline of frozen-leg `buildSpawnArgs` output + the 52 cells
- [ ] `opencode --version` + provider auth pre-flight; ASK if default provider missing
- [ ] Locate the existing benchmark test tree (do not fabricate a path)
- [ ] Isolated worktree; recovery-baseline commit recorded

### Phase 2: Core Implementation
- [ ] Flip the chosen cli-opencode cell(s) from `skip` to a live `resultPointer`
- [ ] Add an integration test driving a stubbed run via `BEHAVIOR_BENCH_SPAWN_JSON`
- [ ] Add a scheduler test asserting reconciliation accounts for the live cell
- [ ] Run one bounded live capture (real `opencode`) for the first scenario; save evidence

### Phase 3: Verification
- [ ] Assert the result JSON identity + shape (`leg`, `scenarioId`, `classification`, `dimensions`)
- [ ] Assert reconciliation `status`/`resultCount`/`skipCount` coherent
- [ ] Byte-diff frozen legs + skip records + fixture hashes against baseline
- [ ] Run the benchmark test suite; confirm green + `validateManifest()` passes


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration (stubbed) | Runner emits a well-formed `cli-opencode` result | `BEHAVIOR_BENCH_SPAWN_JSON` fake spawn |
| Integration (scheduler) | Reconciliation accounts for the live cell | Invoke `runMatrix` on a temp out-dir |
| Live (bounded) | One real `opencode run` capture for ≥1 scenario | Real binary on an isolated worktree |
| Regression (byte-diff) | Frozen legs + fixtures unchanged | Golden baseline compare |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 (schema) | Internal | Planned | Cell cannot be flipped live |
| Child 002 (dispatch) | Internal | Planned | Leg cannot dispatch |
| `opencode` binary + provider auth | External | UNKNOWN | Live capture blocked; stub tests still run |
| Existing benchmark test tree | Internal | UNKNOWN | Test placement; must be located, not invented |
| Scheduler/runner module exports | Internal | Green | Tests bind to `runMatrix`/`buildSpawnArgs` |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: frozen-leg drift, fixture hash change, or the live cell corrupts reconciliation.
- **Procedure**: revert the cell flip (`git checkout -- command-benchmark-matrix.json`), delete the
  captured out-dir evidence, and restore fixtures via the scheduler's `restoreFixture` (git) path.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
[001 schema] ──> [002 dispatch] ──> Phase 1 (Setup + auth pre-flight)
                                          └──> Phase 2 (flip cell + tests + live capture)
                                                   └──> Phase 3 (evidence + regression verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001, 002, opencode auth | Core |
| Core | Setup | Verify |
| Verify | Core | Packet close-out |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + auth pre-flight | Low-Medium | 1-2 hours |
| Cell flip + tests + live capture | Medium-High | 4-6 hours |
| Evidence + regression verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Isolated worktree; recovery-baseline commit recorded
- [ ] Baseline of frozen legs + 52 cells + fixture hashes captured
- [ ] Auth pre-flight done; default provider confirmed or operator asked

### Rollback Procedure
1. **Immediate**: `git checkout -- command-benchmark-matrix.json` to un-flip the live cell.
2. **Fixtures**: run the scheduler's git `restoreFixture` path (or `git checkout`/`git clean` the fixture dir) to a clean state.
3. **Evidence**: remove the captured out-dir artifacts (they are not committed).
4. **Verify**: re-run `validateManifest()` + the frozen-leg baseline compare — both must pass.

### Data Reversal
- **Has data migrations?** No — a cell flip plus ephemeral out-dir evidence; fully reversible.

<!-- /ANCHOR:l2-rollback -->
