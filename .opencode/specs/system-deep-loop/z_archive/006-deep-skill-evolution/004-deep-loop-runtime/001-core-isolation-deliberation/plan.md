---
title: "Implementation Plan: AI Council Deliberation on Deep-Loop Core Isolation"
description: "4-seat sk-ai-council deliberation via cli-codex gpt-5.5 xhigh. Planning-only; file moves deferred to follow-on packet."
trigger_phrases:
  - "deep-loop isolation plan"
  - "ai council deliberation plan"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/001-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan: 4-seat council dispatch via cli-codex"
    next_safe_action: "Dispatch seats A/B/C sequentially, then D"
    blockers: []
    key_files:
      - "ai-council/ai-council-strategy.md"
    session_dedup:
      fingerprint: "sha256:2272272272272272272272272272272272272272272272272272272272270000"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: AI Council Deliberation on Deep-Loop Core Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JSONL |
| **Framework** | sk-ai-council multi-seat pattern + cli-codex external dispatch |
| **Storage** | Packet-local `ai-council/**` artifacts per canonical layout |
| **Testing** | strict validate.sh + manual sanity check on council artifacts |

### Overview

Run a 4-seat AI Council round via cli-codex gpt-5.5. Three advocate seats (Isolation Architect, Status-Quo Defender, Pragmatist) argue distinct positions from the same dependency map. A fourth adjudicator seat synthesizes them and applies the 2-of-3 convergence rule. The ADR captures the ruling + optional migration outline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Dependency map captured (spec.md §EXECUTIVE SUMMARY + ai-council-strategy.md)
- [x] sk-ai-council folder layout understood
- [x] cli-codex SKILL.md dispatch shape confirmed (this session)
- [x] No conflicting Gate 3 — user-approved plan

### Definition of Done
- [ ] 4 seat outputs in `ai-council/seats/round-001/`
- [ ] `ai-council/deliberations/round-001.md` synthesizes the round
- [ ] `ai-council/council-report.md` with required sections per output_schema.md
- [ ] `decision-record.md` ADR-001 captures ruling
- [ ] `validate.sh --strict` PASS
- [ ] Single commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Multi-seat AI Council with packet-local artifact persistence; planning-only output; file relocation deferred.

### Key Components
- **4 seat dispatches** (cli-codex gpt-5.5; A/B/D xhigh, C high)
- **Sequential ordering**: A → B → C → D (D needs A/B/C as input)
- **Convergence rule**: 2-of-3 across A/B/C; D adjudicates + overrides if warranted
- **Artifacts**: per sk-ai-council canonical folder layout

### Data Flow
Spec scope + dependency map → strategy.md → seat prompts → seat outputs → deliberation synthesis → council-report.md → ADR.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `117-…/spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Packet docs | Create | strict validate |
| `117-…/ai-council/ai-council-config.json` | Council config | Create | sk-ai-council layout compliance |
| `117-…/ai-council/ai-council-strategy.md` | Round charter | Create | references dependency map |
| `117-…/ai-council/ai-council-state.jsonl` | Append-only state | Create with init event | parsed at end |
| `117-…/ai-council/seats/round-001/seat-*.md` | Seat outputs | Create (4 files) | each has verdict line |
| `117-…/ai-council/deliberations/round-001.md` | Round synthesis | Create | comparison table + agreements/disagreements |
| `117-…/ai-council/council-report.md` | Final synthesized plan | Create | output_schema.md compliance |
| `117-…/decision-record.md` | ADR-001 | Create | 5-checks PASS |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold packet docs Level 3
- [x] Create `ai-council/` folder structure
- [x] Write strategy.md with dependency map + seat plan
- [x] Write config.json with packet metadata + convergence rule
- [x] Init state.jsonl with `round_start` event

### Phase 2: Council Round
- [ ] Dispatch Seat A (Isolation Architect, xhigh)
- [ ] Dispatch Seat B (Status-Quo Defender, xhigh)
- [ ] Dispatch Seat C (Pragmatist, high)
- [ ] Dispatch Seat D (Adjudicator, xhigh, with A/B/C as input)

### Phase 3: Synthesis + ADR
- [ ] Author `deliberations/round-001.md`
- [ ] Author `council-report.md`
- [ ] Author `decision-record.md` ADR-001
- [ ] Author `implementation-summary.md` with commit handoff
- [ ] Refresh metadata via generate-context.js

### Phase 4: Validate + Commit
- [ ] `validate.sh --strict` PASS
- [ ] Single commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Packet docs | `validate.sh --strict` |
| Council artifact validation | `ai-council/**` shape | manual inspection vs folder_layout.md |
| Seat output validation | Each seat has frontmatter + verdict | grep + final-line check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` + OpenAI auth | External | Verified | Cannot dispatch seats |
| sk-ai-council skill | Internal | v1.0.0 shipped | Cannot persist canonical artifacts |
| Level 3 spec templates | Internal | Available | Cannot scaffold |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Seat dispatch produces unusable output (all parrot, no diversity)
- **Procedure**: Mark failed round as `ai-council/failed/round-001-<timestamp>/`; do NOT commit half-baked ADR; ask user for re-dispatch direction
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) → Phase 2 (Round) → Phase 3 (Synthesis + ADR) → Phase 4 (Validate + Commit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | spec scope | Round |
| Round | strategy + config | Synthesis |
| Synthesis | all 4 seats complete | Validate |
| Validate | ADR + impl-summary | Commit |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 min |
| Round | High (4 sequential cli-codex xhigh) | 50-60 min wall-clock |
| Synthesis + ADR | Medium | 20 min |
| Validate + Commit | Low | 5 min |
| **Total** | | **~90 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production deployment involved (planning-only packet)
- [x] No file moves in this packet

### Rollback Procedure
1. If a seat dispatch fails or produces garbage: preserve output under `ai-council/failed/round-001-<ts>/`, mark `superseded` event in state.jsonl, re-dispatch with corrected prompt
2. If ADR ruling is wrong post-hoc: a new packet supersedes this one (this packet stays as historical record)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Spec docs + dependency map
  → strategy.md
  → 4 seat dispatches (sequential)
  → seat outputs
  → deliberation synthesis
  → council-report.md
  → ADR-001
  → impl-summary.md
  → validate + commit
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** — required before Round
2. **Round Seats A/B/C** — must all complete before D
3. **Seat D** — synthesizes A/B/C; cannot start before they complete
4. **ADR** — requires Seat D's adjudication

**Total Critical Path**: Setup + 4 sequential cli-codex xhigh dispatches + ADR write + validate + commit.

**Parallel Opportunities**: Seats A/B/C are theoretically parallel but kept sequential per memory rule on cli-codex parallel dispatch unreliability.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | All packet docs + ai-council scaffold present | T+15 min |
| M2 | Round complete | 4 seat outputs in `ai-council/seats/round-001/` | T+75 min |
| M3 | ADR ready | `decision-record.md` ADR-001 with 5-checks PASS | T+90 min |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-000: Use AI Council Deliberation Before Architectural Move

**Status**: Accepted

**Context**: User flagged that deep-* skills depend on 18 production files inside another skill (system-spec-kit). No ADR justifies the placement. The decision to move (or not) needs documented reasoning, not ambient preference.

**Decision**: Run a 4-seat sk-ai-council deliberation via cli-codex gpt-5.5 (mostly xhigh) before any file relocation.

**Consequences**:
- Adds ~90 minutes before any move
- Produces a citable ADR that downstream consumers can reference
- Prevents speculative moves that break MCP tool ID stability

**Alternatives Rejected**:
- Immediate move without deliberation: rejected because the architectural drift wasn't documented anywhere; moving without evidence repeats the same unjustified pattern in the other direction
- Skip the deliberation, ask user to decide directly: rejected because user explicitly requested AI Council deliberation
