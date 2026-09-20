---
title: "Plan: Scheduler/Runner cli-opencode Dispatch Wiring"
description: "Implementation plan to wire behavior-bench-run.cjs (and, if the seam requires, the scheduler) to dispatch the cli-opencode leg through the canonical invocation with child spec-gate env, no --agent, and byte-stable existing legs."
trigger_phrases:
  - "plan scheduler opencode dispatch"
  - "runner LEG_TABLE opencode plan"
  - "cli-opencode dispatch wiring plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/015-command-benchmark-cli-opencode-driver/002-scheduler-opencode-dispatch"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored L2 plan"
    next_safe_action: "Wire runner dispatch on isolated worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-035-015-002-scheduler-opencode-dispatch-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Scheduler/Runner cli-opencode Dispatch Wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS) |
| **Primary file** | `behavior-bench-run.cjs` (`LEG_TABLE`, `buildSpawnArgs`, child `spawn`) |
| **Secondary file** | `run-command-behavior-matrix.cjs` (`invokeRunner`) — only if seam (b) |
| **Testing** | Node unit tests against exported `buildSpawnArgs` / `LEG_TABLE`; snapshot of frozen legs |

### Overview
Add a `cli-opencode` leg to the runner that renders the canonical cli-opencode invocation, plumb
model/variant from the matrix cell's `executor` block, append `--dir <repo-root>`, and inject the
child spec-gate env on the opencode child spawn — all without changing the three frozen legs'
`buildSpawnArgs` output. The SKILL.md read is a prerequisite: the dispatch shape is copied from its
Default Invocation and ALWAYS rules, not invented.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child 001 `executor` block shape known (or defaulted in the runner)
- [ ] cli-opencode SKILL.md re-read (Default Invocation §3; ALWAYS 3/5/6/11/17)
- [ ] Plumbing seam chosen and recorded
- [ ] Isolated worktree; main clean/committed

### Definition of Done
- [ ] Canonical argv renders for the `cli-opencode` leg (unit test)
- [ ] Frozen legs' `buildSpawnArgs` byte-identical (snapshot test)
- [ ] Child spec-gate env present on the opencode spawn
- [ ] Runner exit-code contract unchanged


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend the existing leg-table + spawn-builder seam; keep the change leg-scoped.

### Key Components
- **`LEG_TABLE`**: add `'cli-opencode': ['opencode','run','--model','<m>','--variant','<v>','--dangerously-skip-permissions']`. Note the existing `deepseek` entry omits `--variant`/`--dir`; do not reuse it — add a distinct key so the frozen legs stay byte-stable.
- **`buildSpawnArgs`**: opencode branch already appends `--command` (command-kind) then `--format json` then the prompt. Add `--dir <repo-root>` for the new leg, and interpolate model/variant from the resolved `executor`.
- **Child `spawn` options**: inject `env: { ...process.env, MK_SPEC_GATE_ENFORCE:'0', AI_SESSION_CHILD:'1' }` for the opencode dispatch; keep `stdio: ['ignore','pipe','pipe']` (closed stdin) unchanged.

### Model/Variant Plumbing — seam options
1. **Per-model `LEG_TABLE` keys** (e.g. `cli-opencode-deepseek-high`): zero scheduler change, but keys multiply per model/variant combo.
2. **New runner flags** `--model`/`--variant`: scheduler `invokeRunner` reads the cell `executor` and passes them; single generic leg key. Lowest coupling for selectability.
3. **`BEHAVIOR_BENCH_SPAWN_JSON` env seam**: the runner already lets this env override the leg table entirely (prompt appended last) — usable for tests, awkward as the production path.

### Data Flow (seam 2, recommended)
1. Scheduler `invokeRunner` builds `[runner, '--scenario', …, '--leg', 'cli-opencode', '--out-dir', …]` plus, when the cell has an `executor`, `--model <m> --variant <v>`.
2. Runner `parseArgs` accepts the new optional flags; `buildSpawnArgs` interpolates them.
3. Runner spawns opencode with the injected env; result JSON's `leg` is `cli-opencode` (matches the cell for the scheduler identity check).


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read cli-opencode SKILL.md Default Invocation + ALWAYS rules 3/5/6/11/17
- [ ] Snapshot current `buildSpawnArgs` output for the three frozen legs (golden fixture)
- [ ] Create isolated worktree; record recovery-baseline commit

### Phase 2: Core Implementation
- [ ] Add the `cli-opencode` `LEG_TABLE` entry
- [ ] Extend `buildSpawnArgs` to interpolate model/variant and append `--dir <repo-root>` for the new leg
- [ ] Inject the child spec-gate env on the opencode child spawn (leg-scoped)
- [ ] (Seam 2) add `--model/--variant` to runner `parseArgs` and scheduler `invokeRunner`

### Phase 3: Verification
- [ ] Unit test: canonical argv, no `--agent`, correct `--command`/`--format json`/`--dir` ordering
- [ ] Snapshot test: frozen legs byte-identical
- [ ] Inspect/assert env injection on the spawn options
- [ ] Confirm exit-code contract and closed-stdin unchanged


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `buildSpawnArgs("cli-opencode", contract)` renders canonical argv, no `--agent` | Node test harness against the module export |
| Snapshot | Frozen legs' `buildSpawnArgs` byte-identical | Golden fixture compare |
| Unit | Command-kind vs prompt-kind scenario shapes | Node test with both contract shapes |
| Inspection | Env injection + `stdio: ['ignore', …]` | Assert spawn options / dependency-inject a spawn stub |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 `executor` block | Internal | Planned | Model/variant source; runner can default until it lands |
| cli-opencode SKILL.md | Internal | Green | Canonical dispatch contract |
| `behavior-bench-run.cjs` module exports | Internal | Green | Unit tests bind to `buildSpawnArgs`/`LEG_TABLE` |
| opencode binary (runtime) | External | UNKNOWN | Needed only for a live dispatch (child 003), not for argv unit tests |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: frozen-leg snapshot drifts, exit-code contract changes, or the canonical argv is wrong.
- **Procedure**: `git checkout -- behavior-bench-run.cjs run-command-behavior-matrix.cjs` on the worktree.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + SKILL.md read + golden snapshot)
        └──> Phase 2 (leg + buildSpawnArgs + env + seam)
                 └──> Phase 3 (unit/snapshot verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 001 shape, SKILL.md | Core |
| Core | Setup | Verify |
| Verify | Core | Child 003 handoff |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + golden snapshot | Low | 1 hour |
| Leg + buildSpawnArgs + env + seam | Medium | 3-4 hours |
| Unit/snapshot verification | Medium | 2 hours |
| **Total** | | **6-7 hours** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Isolated worktree; recovery-baseline commit recorded
- [ ] Golden snapshot of frozen legs captured before edit
- [ ] cli-opencode SKILL.md contract cited in the change description

### Rollback Procedure
1. **Immediate**: `git checkout -- behavior-bench-run.cjs run-command-behavior-matrix.cjs`.
2. **Verify**: re-run the frozen-leg snapshot test — must match the pre-change golden.
3. **Confirm**: runner `--help`/exit-code contract unchanged.

### Data Reversal
- **Has data migrations?** No — pure code change, reversible by `git checkout`.

<!-- /ANCHOR:l2-rollback -->
