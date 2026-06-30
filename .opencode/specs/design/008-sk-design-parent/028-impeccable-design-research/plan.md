---
title: "Implementation Plan: impeccable research for sk-design"
description: "Deep-research execution plan: scope the impeccable corpus, run a convergent GPT-5.5-xhigh loop with verify-against-real discipline, run a cross-model completeness sweep, and synthesize a frozen adoption backlog into existing sk-design homes."
trigger_phrases:
  - "impeccable research plan"
  - "impeccable deep research execution"
  - "sk-design impeccable study plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/028-impeccable-design-research"
    last_updated_at: "2026-06-27T14:44:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the research execution plan"
    next_safe_action: "Run the cross-model sweep, then validate"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-028-impeccable-design-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: impeccable research for sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research state machine + markdown research artifacts |
| **Framework** | deep-loop-runtime driver; cli-codex gpt-5.5 xhigh fast |
| **Storage** | externalized state.jsonl + deltas + iterations |
| **Testing** | reduce-state (corruption 0); cross-model adversarial sweep; validate.sh --strict |

### Overview
Run a scoped, convergent deep-research loop over the impeccable corpus, crosswalk onto sk-design's five modes with verify-against-real discipline, then a cross-model completeness sweep, and synthesize research.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Corpus scoped (skill/ + detector semantics + STYLE)
- [x] Executor confirmed (cli-codex gpt-5.5 xhigh fast)
- [x] sk-design target map defined

### Definition of Done
- [x] Corpus covered, loop converged (12 iters)
- [x] Every candidate verified against the real sk-design file
- [x] Cross-model sweep folded into research.md
- [x] validate.sh --strict clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized deep-research state machine: per-iteration prompt-pack render → cli-codex dispatch → reduce-state → inline convergence; then a parallel cross-model verification sweep; then synthesis.

### Key Components
- **deep-loop-runtime driver** (run-loop-028.mjs): renders prompt-packs, dispatches, reduces, evaluates convergence.
- **Cross-model critics** (Kimi-k2.7 + DeepSeek-v4-pro): read-only completeness + adversarial verification.

### Data Flow
corpus + sk-design → per-iteration crosswalk → state.jsonl/deltas → reduce → research.md backlog → cross-model sweep → research.md §11b.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research packet; the only writes are research artifacts under the packet.

| Surface | Role | Action | Verification |
|---------|------|--------|--------------|
| research/research.md | the synthesis | create | validate + sweep fold-in |
| research/iterations/, deltas/ | evidence | create | reducer corruption 0 |
| research/deep-research-state.jsonl | state machine | append-only | reduce-state |

Required inventories:
- Same-class producers: research artifacts only; no live sk-design edits.
- Consumers of changed symbols: a future build packet consumes the backlog.
- Matrix axes: impeccable slices x sk-design modes; verify-against-real per candidate.
- Algorithm invariant: a finding is a hypothesis until the cited sk-design file is opened.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scope corpus; scaffold packet; init state machine; acquire lock

### Phase 2: Research Loop
- [x] Run the convergent GPT-5.5-xhigh loop (12 iters, converged)
- [x] Verify each candidate against the real sk-design file

### Phase 3: Verification + Synthesis
- [x] Cross-model completeness sweep (Kimi + DeepSeek)
- [x] Synthesize research.md; validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (research) | n/a |
| Integration | state-machine integrity | reduce-state.cjs |
| Manual | verify-against-real + adversarial sweep | Read, cli-opencode critics |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| impeccable corpus | Internal (read-only) | Green | No input |
| cli-codex gpt-5.5 xhigh fast | External | Green | No executor |
| cli-opencode (Kimi/DeepSeek) | External | Green | No cross-model sweep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: malformed artifact or bad citation found at validation.
- **Procedure**: re-run the specific iteration or re-synthesize research.md; the state machine is append-only and resumable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup --> Research loop --> Sweep --> Synthesis
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Loop |
| Loop | Setup | Sweep |
| Sweep + synthesis | Loop | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Loop | High | 12 converged iterations |
| Sweep + synthesis | Med | 4 critics + research.md |
| **Total** | | **12 iters + sweep** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] State machine append-only + resumable
- [x] No live sk-design edits (research only)
- [x] Cross-model sweep verifies before synthesis freeze

### Rollback Procedure
1. Identify the malformed artifact at validation
2. Re-run the iteration or re-synthesize research.md
3. Re-validate

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
corpus + sk-design --> research loop --> cross-model sweep --> research.md
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| research loop | corpus | backlog | sweep |
| sweep | backlog | verification | synthesis |
| synthesis | sweep | research.md | future build |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Convergent research loop** - the coverage + backlog - CRITICAL
2. **Verify-against-real** - no false positives - CRITICAL
3. **Cross-model sweep** - independent verification - CRITICAL

**Total Critical Path**: Setup -> loop -> sweep -> synthesis.

**Parallel Opportunities**:
- The 4 cross-model critics ran concurrently.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Corpus covered | shared laws + 23 flows + detector + STYLE read | Phase 2 |
| M2 | Converged | newInfoRatio < 0.05 rolling avg | Phase 2 |
| M3 | Verified + synthesized | sweep folded; validate clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---
