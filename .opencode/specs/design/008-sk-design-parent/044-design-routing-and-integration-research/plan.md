---
title: "Implementation Plan: sk-design routing/integration research"
description: "Deep-research execution plan: charter six dimensions, run a non-converging GPT-5.5-xhigh loop driven by a 57-angle bank plus a parallel monitor, switch the corpus to designer-skills-main for the back third, and consolidate 50 iteration files into research.md via six parallel per-dimension synthesis agents."
trigger_phrases:
  - "sk-design routing research plan"
  - "non-converging deep research execution"
  - "design integration study plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/044-design-routing-and-integration-research"
    last_updated_at: "2026-06-28T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the non-converging deep-research execution plan"
    next_safe_action: "Scope a build phase for the D3/D4 enforcement spine"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-044-design-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-design routing/integration research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research state machine + markdown research artifacts |
| **Framework** | deep-loop-runtime no-converge driver + reduce-state.cjs; cli-codex gpt-5.5 xhigh fast |
| **Storage** | externalized state.jsonl + deltas + iterations + angle-bank.json |
| **Testing** | reduce-state (corruption 0); executed skill-benchmark scripts (router-replay, d5-connectivity, advisor-probe); validate.sh --strict |

### Overview
Charter six dimensions, run a non-converging loop that advances a 57-angle bank one fresh angle per iteration while a parallel monitor injects deeper/cross-cutting angles and switches the corpus to `designer-skills-main` for the back third, then consolidate the 50 iteration files into research.md with six parallel per-dimension synthesis agents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Six dimensions chartered (D1-D6)
- [x] Executor confirmed (cli-codex gpt-5.5 xhigh fast)
- [x] 57-angle bank + monitor + corpus-expansion plan defined

### Definition of Done
- [x] 50 iterations completed without converging
- [x] Every load-bearing claim verified against the real on-disk file
- [x] Six-dimension backlog + spine + ledger synthesized into research.md
- [x] validate.sh --strict clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized no-converge deep-research state machine: per-iteration prompt-pack render -> cli-codex dispatch -> reduce-state -> convergence logged as signal only (the sole stop is iteration 50); a parallel monitor watches the JSONL and injects angles; then six parallel synthesis agents consolidate.

### Key Components
- **No-converge driver**: renders prompt-packs, advances the 57-angle bank one fresh angle per iteration, dispatches, reduces.
- **Parallel monitor**: injects deeper/cross-cutting angles when info flow dips and switches the corpus to designer-skills-main for the back third.
- **Six synthesis agents** (fresh Opus, one per dimension): each reads only its dimension's iteration files and dedupes into research.md.

### Data Flow
live family + corpora -> per-iteration crosswalk + verify-against-real -> state.jsonl/deltas -> reduce -> 6 parallel syntheses -> research.md (backlog + spine + ledger + verification plan).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research packet; the only writes are research artifacts under the packet. No live sk-design / commands / mcp-open-design / cli-* file was edited.

| Surface | Role | Action | Verification |
|---------|------|--------|--------------|
| research/research.md | the synthesis | create | validate + per-dimension dedupe |
| research/iterations/, deltas/ | evidence | create | reducer corruption 0 |
| research/deep-research-state.jsonl | state machine | append-only | reduce-state |

Required inventories:
- Same-class producers: research artifacts only; no live edits.
- Consumers of changed symbols: a future build packet consumes the backlog.
- Matrix axes: six dimensions x sk-design surfaces; verify-against-real per claim.
- Algorithm invariant: a finding is a hypothesis until the cited file:line is opened.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Charter six dimensions; scaffold packet; init state machine + 57-angle bank; acquire lock

### Phase 2: Research Loop
- [x] Run the 50-iteration non-converging GPT-5.5-xhigh loop (one fresh angle per iteration)
- [x] Parallel monitor injects angles + switches corpus to designer-skills-main for the back third
- [x] Verify each load-bearing claim against the real on-disk file

### Phase 3: Synthesis + Verification
- [x] Six parallel per-dimension synthesis agents consolidate 50 iteration files into research.md
- [x] Record the enforceable-vs-advisory ledger + verification plan; validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (research) | n/a |
| Integration | state-machine integrity | reduce-state.cjs |
| Manual | verify-against-real + executed benchmark scripts | Read, router-replay.cjs, d5-connectivity.cjs, advisor-probe.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| live sk-design family + corpora | Internal (read-only) | Green | No input |
| cli-codex gpt-5.5 xhigh fast | External | Green | No executor |
| deep-loop-runtime driver + reduce-state.cjs | Internal | Green | No externalized state |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: malformed artifact or unverified citation found at validation.
- **Procedure**: re-run the specific iteration or re-synthesize research.md; the state machine is append-only and resumable from externalized state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup --> Research loop --> Synthesis --> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Loop |
| Loop | Setup | Synthesis |
| Synthesis + verification | Loop | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | scaffolded |
| Loop | High | 50 non-converging iterations |
| Synthesis + verification | Med | 6 parallel agents + research.md |
| **Total** | | **50 iters + 6-agent synthesis** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] State machine append-only + resumable
- [x] No live sk-design / commands / mcp-open-design / cli-* edits (research only)
- [x] Verify-against-real before any backlog item is recorded

### Rollback Procedure
1. Identify the malformed artifact or unverified citation at validation
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
live family + corpora --> non-converging loop --> 6 parallel syntheses --> research.md
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| research loop | live family + corpora | iteration files | synthesis |
| synthesis | iteration files | backlog + spine + ledger | future build |
| verification | research.md | validation pass | none |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Non-converging research loop** - the six-dimension coverage + backlog - CRITICAL
2. **Verify-against-real** - no asserted-not-verified findings - CRITICAL
3. **Per-dimension synthesis** - dedupe 50 files into one deliverable - CRITICAL

**Total Critical Path**: Setup -> loop -> synthesis -> verification.

**Parallel Opportunities**:
- The six per-dimension synthesis agents ran concurrently; the monitor ran parallel to the driver.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Six dimensions chartered | 57-angle bank covers D1-D6 | Phase 1 |
| M2 | Non-convergence held | newInfoRatio never near the 0.05 floor | Phase 2 |
| M3 | Synthesized + verified | backlog + spine + ledger; validate clean | Phase 3 |
<!-- /ANCHOR:milestones -->

---
