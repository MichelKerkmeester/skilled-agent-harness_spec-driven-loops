---
title: "Plan: Deep AI Council Research + Architecture Design"
description: "Completed research and ADR plan for deep-ai-council architecture."
trigger_phrases:
  - "deep ai council 001 plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/008-iterative-research-and-architecture"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "codex"
    recent_action: "129/001 architecture research complete, 5 ADRs authored, 002-006 scaffolded"
    next_safe_action: "dispatch F1 -- 129/002 runtime primitive extraction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:1290010000000000000000000000000000000000000000000000000000000003"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Plan: Deep AI Council Research + Architecture Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Spec documentation and architecture research |
| **Target Skill** | `.opencode/skills/deep-ai-council/` |
| **Runtime Sibling** | `.opencode/skills/deep-loop-runtime/` |
| **Verification** | `validate.sh --strict` plus residual-name grep |

### Overview

Phase 001 produces architecture research and ADRs only. It does not modify runtime code. The outcome is a concrete downstream implementation sequence for phases 002-006.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Target spec folder supplied.
- [x] New skill name confirmed by reading `.opencode/skills/deep-ai-council/SKILL.md`.
- [x] Packet 130 read as source-of-truth context for overlap and parity invariants.

### Definition of Done

- [x] Stale pre-rename skill token scrubbed from packet 129.
- [x] `research/iter-001.md` and `research/research.md` authored.
- [x] ADR-001..ADR-005 authored.
- [x] 002-006 phase folders scaffolded.
- [ ] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Hybrid deep-loop architecture: shared infrastructure in `deep-loop-runtime`, domain-specific council semantics in `deep-ai-council`.

### Key Components

- Runtime primitives: atomic state, JSONL repair, loop lock, permissions, prompt-pack, executor audit.
- Council orchestration: session -> topic -> round.
- Convergence: adjudicator-verdict stability deltas.
- Registry: `council-findings-registry.json`.
- Command: `/deep:ask-ai-council :auto|:confirm`.

### Data Flow

1. Session initializes config, state, and registry.
2. Topic initializes topic config and reads prior fingerprints.
3. Round dispatches 2-3 seats within one CLI boundary.
4. Adjudicator emits structured verdict.
5. Reducer computes verdict delta and registry updates.
6. Topic stops on stability or max rounds.
7. Session continues to the next topic until max topics or operator stop.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Evidence Read

- [x] Read packet 129 parent and phase 001 docs.
- [x] Read `deep-ai-council`, `deep-loop-runtime`, `deep-review`, `deep-research`.
- [x] Read packet 130 sections 1, 2, and 6.

### Phase 2: Research and ADRs

- [x] Author iter-001 findings.
- [x] Author synthesis.
- [x] Author ADR-001..ADR-005.

### Phase 3: Downstream Scaffold

- [x] Create 002-006 phase docs and metadata.
- [x] Update parent phase map.
- [ ] Run validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Strict spec validation | 001 and phases 002-006 | `validate.sh --strict` |
| Recursive validation | Parent 129 | `validate.sh --strict --recursive` |
| Rename scrub | Packet 129 | Stale-token scan |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `deep-ai-council` renamed skill | Internal | Green | Architecture references would be stale. |
| `deep-loop-runtime` primitive inventory | Internal | Green | ADR-001 would lack basis. |
| Packet 130 parity invariants | Research | Green | Phase 006 tests would be under-specified. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is documentation-only inside packet 129. Rollback would remove the 001 research outputs and 002-006 scaffolds from packet 129 only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
001 research
  -> 002 runtime primitive extraction
  -> 003 per-topic multi-round orchestration
  -> 004 multi-topic session and registry
  -> 005 command and skill wiring
  -> 006 parity tests and docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001 | None | 002 |
| 002 | ADR-001 | 003 |
| 003 | ADR-002, ADR-003 | 004 |
| 004 | ADR-005 | 005 |
| 005 | ADR-004 | 006 |
| 006 | 002-005 | Final closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 002 | Medium | 1-2 sessions |
| 003 | High | 2-3 sessions |
| 004 | High | 2-3 sessions |
| 005 | Medium | 1-2 sessions |
| 006 | Medium | 1-2 sessions |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Downstream phases should keep council deep mode behind a command/mode boundary until 006 parity tests pass. The existing single-round council behavior remains the fallback.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## DEPENDENCY GRAPH

```text
001 -> 002 -> 003 -> 004 -> 005 -> 006
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## CRITICAL PATH

The critical path is ADR-001 runtime primitive extraction, followed by ADR-003 verdict-delta orchestration, followed by ADR-005 registry parity. Command wiring should wait until those surfaces exist.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 | 002 primitives tested |
| M2 | 003 single-topic deep loop tested |
| M3 | 004 multi-topic registry tested |
| M4 | 005 command and mirrors synced |
| M5 | 006 parity/cost/docs closeout |
<!-- /ANCHOR:milestones -->
