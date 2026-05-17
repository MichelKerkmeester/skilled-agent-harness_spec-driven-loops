---
title: "Implementation Plan: cli-devin extraction rerun"
description: "Build extraction layer, wire into score-variant, re-run loop with live grader, synthesize v2 ranking."
trigger_phrases:
  - "113/005 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/005-extraction-rerun"
    last_updated_at: "2026-05-17T05:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan"
    next_safe_action: "Build extract script"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000116001"
      session_id: "113-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: cli-devin extraction rerun

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js .cjs scripts |
| **Framework** | Reuses 113/002 rig + 113/003 loop |
| **Storage** | `113/005/state/`, `113/005/iterations/`, `113/005/synthesis-v2.md` |
| **Testing** | Canned-output extraction test; full re-run validation |

### Overview
Build markdown-to-disk extraction layer; modify score-variant.cjs to call it behind `EVAL_LOOP_EXTRACT=true`; re-run 5 council-seeded variants × 7 fixtures with extraction + live claude-sonnet grader; compare v2 ranking against 003's v1 ranking.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 113/002 rig present and dry-run green
- [ ] 113/003 loop runs in mock mode
- [ ] claude-sonnet CLI authenticated

### Definition of Done
- [ ] Extraction script + canned-output test passes
- [ ] score-variant.cjs accepts `EVAL_LOOP_EXTRACT` flag
- [ ] Re-run completes (or pauses cleanly at cost ceiling)
- [ ] synthesis-v2.md compares v1 vs v2 rankings
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sidecar augmentation. Extraction script lives in 113/005 packet; score-variant.cjs (in 113/002) gains an env-gated extraction call. The re-run reuses 113/003 loop unchanged.

### Key Components
- `113/005/scripts/extract-files-from-markdown.cjs` — parse + write
- `113/002/scripts/score-variant.cjs` — env-gated extraction call
- `113/005/scripts/loop-v2.cjs` — wrapper that sets env + invokes 113/003 loop with output redirected to 113/005/state

### Data Flow
SWE 1.6 markdown → extract → write to fixture CWD → run det checks (now have files) → live grader call → cache + score → next variant
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 113/002 score-variant.cjs | Scoring orchestrator | Add env-gated extraction call before det checks | Diff review + canned-output test |
| 113/002 fixtures/*/seed/ | Pristine seed scenarios | Read-only (extraction snapshots + restores) | Pre/post seed hash compare |
| 113/005/scripts/ | New | Create extract + loop-v2 | ls + node --check |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify 113/002 rig green
- [ ] Verify claude-sonnet auth
- [ ] Create 113/005 directory tree

### Phase 2: Implementation
- [ ] Build extract-files-from-markdown.cjs with conservative heuristic + skip-on-ambiguity
- [ ] Add canned-output extraction tests
- [ ] Modify 113/002 score-variant.cjs: env-gated extraction call + seed snapshot/restore
- [ ] Build 113/005/scripts/loop-v2.cjs wrapper
- [ ] Smoke-test on 1 variant × 1 fixture (mock dispatch)

### Phase 3: Verification
- [ ] Re-run full 5 variants × 7 fixtures with --real + live grader
- [ ] Synthesize v2 with v1-vs-v2 ranking comparison
- [ ] strict-validate 113/005 packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extraction on canned outputs | Node test scripts |
| Integration | score-variant.cjs with EVAL_LOOP_EXTRACT=true on canned data | scripts/dry-run.cjs --test-extraction |
| End-to-end | Full re-run vs 003's baseline | scripts/loop-v2.cjs --real |
| Validate | strict-validate | validate.sh |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 113/002 rig | Internal | Green | Hard blocker |
| 113/003 loop runner | Internal | Green | Hard blocker |
| claude-sonnet CLI auth | External | Green | Hard blocker for live grader |
| devin CLI auth | External | Green | Hard blocker for SWE 1.6 dispatches |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Extraction corrupts fixture seeds OR re-run produces noisy/inconsistent scores
- **Procedure**: `rm -rf 113/005/state 113/005/iterations 113/005/synthesis-v2.md`; restore fixture seeds via 113/003/scripts/seed-fixtures.cjs --force; revert score-variant.cjs changes via git
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Build + Smoke) ──► Phase 3 (Run + Synthesize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Auth + rig | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min |
| Implementation (extract + wire + smoke) | Med | 2 hr |
| Re-run (5 × 7 dispatches + grader serial) | High | ~2.5 hr wall-clock |
| Synthesis + commit | Low | 30 min |
| **Total** | | **~5 hr total (most wall-clock from re-run)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture seed hashes recorded before run
- [ ] 113/005/state clean (no prior run artifacts)
- [ ] Operator confirms grader cost ceiling (default $10)

### Rollback Procedure
1. Stop running loop (Ctrl+C or pause sentinel)
2. `rm -rf 113/005/state 113/005/iterations 113/005/synthesis-v2.md`
3. Restore seeds: `node 113/003/scripts/seed-fixtures.cjs --force`
4. Revert score-variant.cjs: `git checkout HEAD -- 113/002/scripts/score-variant.cjs`
5. Investigate root cause before retry

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — packet-local artifacts
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────┐    ┌─────────────┐    ┌──────────┐
│  Setup  │───►│  Build      │───►│  Run     │
└─────────┘    │  + Smoke    │    │  + Synth │
               └─────────────┘    └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | 113/002 + 113/003 + auth | 113/005 dir tree | Build |
| extract script | Setup | extract-files-from-markdown.cjs | score-variant integration |
| score-variant modification | extract script | env-gated extraction call | Smoke test |
| Smoke test | Score-variant modification | pass/fail signal | Re-run |
| Re-run | Smoke green | state-v2.jsonl + iteration files | Synthesis |
| Synthesis | Re-run complete | synthesis-v2.md | Commit |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 15 min - CRITICAL
2. **Extract script + smoke test** - 2 hr - CRITICAL
3. **Re-run** - ~2.5 hr wall-clock - CRITICAL
4. **Synthesis** - 30 min - CRITICAL

**Total Critical Path**: ~5 hr
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Extract script + smoke green | Canned-output test PASS | Phase 2 mid |
| M2 | Re-run complete | state-v2.jsonl has 5 iter rows + loop_end | Phase 3 mid |
| M3 | synthesis-v2 ratified | Operator reviews v1-vs-v2 verdict | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Sidecar augmentation (NOT rewrite of 113/002)

**Status**: Proposed

**Context**: The extraction layer needs to run BEFORE deterministic checks in score-variant.cjs. Two options: (a) add the call in 113/002 (modifies that packet's surface), or (b) build a wrapper in 113/005 that reimplements scoring with extraction included.

**Decision**: Option (a) — minimal modification to 113/002 behind env flag. Preserves 113/003's mock-mode behavior (env unset) and enables extraction for the 113/005 re-run (env set).

**Consequences**:
- Improves: single source of truth for scoring; extraction available for future packets opting in
- Costs: 113/002 changes are now shared; tested via env-off path to confirm 003 behavior unchanged

**Alternatives Rejected**:
- Wrapper in 113/005 that reimplements score-variant: duplication; risk of drift from 002 logic
- Fork 002 into 002-v2: heavy; not justified for one-script addition

---
