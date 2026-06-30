---
title: "Implementation Plan: Eval Loop"
description: "Run iterations, score variants, converge or exit cleanly with best-known. State-machine plan with crash-recovery."
trigger_phrases:
  - "113/003 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/003-eval-loop"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Verify 002 dry-run green; init state.jsonl"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114031"
      session_id: "114-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Eval Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js .cjs orchestrator scripts |
| **Framework** | None — direct CLI dispatch + 002 rig calls |
| **Storage** | `003-eval-loop/state/` (append-only JSONL + in-flight markers) |
| **Testing** | Pause-resume integration test; force-kill recovery test; final-state verification |

### Overview
Loop dispatches cli-devin per fixture, scores via 002 rig, evaluates 3-signal convergence, mutates winning variants. State externalized to JSONL. Crash-recovery via per-fixture in-flight markers. Synthesizes `synthesis.md` on convergence or budget exhaustion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 001-council-design `council-report.md` ratified
- [ ] 002-eval-rig dry-run gate green
- [ ] cli-devin authenticated with SWE 1.6 model preset
- [ ] Grader CLI authenticated
- [ ] Operator confirms ready to spend free-tier credits

### Definition of Done
- [ ] All P0 requirements (REQ-001..009) satisfied
- [ ] `synthesis.md` exists with ≥ 3 ranked variants + insights
- [ ] strict-validate exit 0 on this packet
- [ ] Operator sign-off on synthesis.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state loop with deterministic recovery. Borrows iteration discipline from deep-research SKILL.md and signature-dedup from deep-agent-improvement.

### Key Components
- **Loop runner** (`scripts/loop.cjs`): main orchestrator, 10-step iteration cycle
- **Convergence evaluator** (`scripts/converge.cjs`): 3-signal weighted vote + legal-stop bundle
- **Mutation generator** (`scripts/mutate.cjs`): council-seeded + hill-climbing along 1 axis
- **Synthesizer** (`scripts/synthesize.cjs`): writes `synthesis.md` from final state
- **002 rig caller**: imports from `../002-eval-rig/` (cache, grader, deterministic checks)

### Data Flow
state.jsonl tail → variant queue → cli-devin dispatch (parallel-3 wave) → 002 rig score → state row append → convergence check → continue OR pause OR exit-with-synthesis
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — greenfield packet. No existing surfaces.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `003-eval-loop/` | New (does not exist) | Create | `ls 003-eval-loop/scripts/` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify 001 council-report.md ratified; verify 002 dry-run green
- [ ] Create directory tree: `state/`, `state/in-flight/`, `iterations/`, `variants/`, `scripts/`
- [ ] Initialize `state/eval-loop-state.jsonl` with `{type:"loop_start", ts, council_report_hash, rig_version}`
- [ ] Pre-flight `devin auth status` + grader CLI auth

### Phase 2: Implementation
- [ ] Author `scripts/loop.cjs` — 10-step iteration pseudocode (read state → legal-stop pre → pop variant → dispatch parallel wave → score serial → aggregate → append row → check convergence → enqueue children OR stop)
- [ ] Author `scripts/converge.cjs` — 3-signal weighted vote (plateau 0.40 + mutation-exhaustion 0.35 + MAD 0.25) + legal-stop bundle (coverage + quality + budget)
- [ ] Author `scripts/mutate.cjs` — pop_or_propose(queue, bestVariant, exhaustedSignatures) with signature dedup
- [ ] Author `scripts/synthesize.cjs` — final synthesis.md writer
- [ ] Implement 7-mode failure-recovery: 429 backoff, grader dispute, parse error, cache race, fixture missing, grader cache poisoning, auth expiration
- [ ] Pause/resume support: `state/.eval-loop-pause` sentinel; resume reads sentinel + last in-flight markers
- [ ] Run loop: dispatch iterations until convergence OR budget exhaustion

### Phase 3: Verification
- [ ] Verify REQ-001..009 (all P0)
- [ ] Pause-resume integration test: kill mid-iteration; restart; verify resumption
- [ ] Force-kill recovery test: kill during cache write; restart; verify no torn rows
- [ ] strict-validate
- [ ] Operator review of synthesis.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Convergence evaluator + mutation generator | Node.js test scripts |
| Integration | Full iteration cycle on canned outputs (mock cli-devin dispatch) | scripts/loop.cjs --mock |
| End-to-end | Real iterations against SWE 1.6 | scripts/loop.cjs |
| Resilience | Pause-resume + force-kill recovery | Kill -9 mid-run; restart |
| Validate | strict-validate | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 council-report.md | Internal | Pending | Hard blocker |
| 002 dry-run gate green | Internal | Pending | Hard blocker |
| cli-devin + Devin CLI + SWE 1.6 access | External | Green | Hard blocker |
| Grader CLI (cli-claude-code OR cli-codex) | External | Green | Hard blocker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop produces noisy/inconsistent scores; rubric needs revision; rig flaw discovered mid-run
- **Procedure**: Stop loop (Ctrl+C or sentinel); `rm -rf state/ iterations/ variants/`; revise 001 or 002 first; restart Phase 1
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + Auth) ──► Phase 2 (Build scripts + Run loop) ──► Phase 3 (Verify + Synthesis)
                                       │
                                       └─► Pause/Resume cycles (transparent in Phase 2)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 001 + 002 green | Implementation |
| Implementation | Setup | Verification |
| Verification | Iterations complete | 004 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Scripts authoring (loop + converge + mutate + synthesize + 7-mode recovery) | High | 8-12 hr |
| Actual iteration run (12 iters × 10 fixtures × 60s + grader + bookkeeping) | High | 3-6 hr wall-clock (could stretch with 429 pauses) |
| Verification + synthesis | Med | 2 hr |
| **Total** | | **~14-20 hr build + run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] 001 ratified, 002 dry-run green
- [ ] Operator confirms ready for free-tier credit burn
- [ ] State directory clean (no prior iteration files)

### Rollback Procedure
1. Signal loop to pause (`touch state/.eval-loop-pause`)
2. `rm -rf state/ iterations/ variants/ synthesis.md`
3. Investigate root cause (rubric? rig? variant generation?)
4. Revise upstream (001 or 002) if needed
5. Restart Phase 1

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — packet-local artifacts
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   Phase 1   │────►│   Phase 2        │────►│   Phase 3          │
│   Setup     │     │   Build scripts  │     │   Verify           │
└─────────────┘     │   ↓              │     │   Synthesis        │
                    │   Run loop       │     └────────────────────┘
                    │  (iterates N×)   │
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | 001 + 002 | state init | Build scripts |
| Build scripts | Setup | loop.cjs + converge.cjs + mutate.cjs + synthesize.cjs | Run loop |
| Run loop | Scripts + 002 rig | state.jsonl rows + iteration files + variants/ | Synthesis |
| Synthesis | Final loop state | synthesis.md | 004 start |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **001 + 002 upstream** - Upstream blockers - CRITICAL
2. **Scripts authoring** - 8-12 hr - CRITICAL (single-threaded)
3. **Iteration run** - 3-6 hr wall - CRITICAL (sequential iterations)
4. **Synthesis** - 1 hr - CRITICAL

**Total Critical Path**: ~14-20 hr

**Parallel Opportunities**:
- Within Phase 2 Build: loop + converge + mutate + synthesize can be partial-parallel by component
- Per-iteration fixture dispatch: parallel wave of 3
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | state.jsonl init row | Phase 1 end |
| M2 | Scripts authored | All 4 scripts pass node --check | Phase 2 mid |
| M3 | Loop converges or exits | synthesis.md exists | Phase 2 end |
| M4 | Verification complete | All REQ-001..009 pass | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: 3-signal weighted-vote convergence (vs single-signal)

**Status**: Proposed

**Context**: Single-signal convergence (e.g., only score plateau) misses cases where mutation space exhausts before plateau forms. Combined with MAD (noise floor) and mutation-exhaustion, the weighted vote catches different failure modes.

**Decision**: Weighted 3-signal vote: plateau (0.40) + mutation-exhaustion (0.35) + MAD (0.25). Composite stopScore > 0.60 + legal-stop bundle pass triggers convergence.

**Consequences**:
- Improves: robust to noisy scores (MAD), exhaustive variant exploration (mutation-exhaustion), and stable winners (plateau)
- Costs: weight tuning per future packet; council can rebalance

**Alternatives Rejected**:
- Single-signal (plateau only): misses exhaustion case
- Bayesian convergence: too much state for a packet-local loop
- No convergence (run to budget exhaustion always): wastes credits

---
