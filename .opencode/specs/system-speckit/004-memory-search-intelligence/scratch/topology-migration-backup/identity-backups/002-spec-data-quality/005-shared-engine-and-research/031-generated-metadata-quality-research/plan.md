---
title: "Implementation Plan: 031 Generated JSON Quality and Safety Research [template:level_2/plan.md]"
description: "The approach for a 10-angle read-only study of the generated-JSON quality and safety surface, with orchestrator-written state and a skeptical cross-model verification pass. Research-only, no generator or parser or schema or validator code modified. Status complete."
trigger_phrases:
  - "generated json quality research plan"
  - "safe regeneration research approach"
  - "10-angle read-only research plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/031-generated-metadata-quality-research"
    last_updated_at: "2026-07-04T17:12:06.026Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the 10-angle read-only research approach"
    next_safe_action: "Operator decides which verified proposals warrant a build phase"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-22-plan-031-generated-metadata-quality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 031 Generated JSON Quality and Safety Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only research, no production code touched |
| **Framework** | Ten gpt-5.5-fast xhigh angle seats via a dispatch driver, then a claude skeptical synthesis |
| **Storage** | research/research.md plus research/deltas/ (orchestrator-written) |
| **Testing** | Skeptical cross-model verification of every load-bearing claim against live code |

### Overview
The study answers one question: how should the spec-kit generated JSON, description.json and graph-metadata.json, and the generators that produce them be made safer and higher quality? It runs ten angle-diverse read-only seats, each scoped to its slice of the live generator, parser, schema, discovery, and validator code, dispatched as gpt-5.5-fast xhigh seats through a driver, then verifies the load-bearing proposals with a claude skeptical pass before ranking. This plan is complete and produced research/research.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research question stated and scope frozen to read-only proposals across the two generators, the parser, the schemas, and the validator registry
- [x] Success criteria measurable (ranked proposal set across four safety classes, verified load-bearing claims)
- [x] The live generator, parser, schema, and validator trees confirmed as the research substrate

### Definition of Done
- [x] Ranked proposal set written to research/research.md across the four safety classes
- [x] Skeptical cross-model verification confirmed the convergent identity resolver and validator fixes and the merge-path lineage guard
- [x] No generator, parser, schema, or validator code modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only seat fan-out with an orchestrator that owns all state writes. An opencode-dispatched edit cannot pass Gate 3, so seats were read-only by design and the orchestrator wrote every delta.

### Key Components
- **Orchestrator**: dispatches the ten gpt-5.5-fast xhigh angle seats, writes deltas, runs the skeptical pass, synthesizes research.md
- **Per-angle seat**: reads the live source for one angle, grounds each proposal in a file it read, returns a finding set
- **Skeptical pass**: a claude synthesis model re-checks every load-bearing proposal against the live code, a different model than the gpt-5.5 seats
- **Synthesis**: dedupes the 40 raw proposals into the 14 ranked entries across four safety classes
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a research packet, not a fix. No producer, consumer or policy surface changes here. The candidate verdicts name the surfaces a later build packet would touch.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| backfill-graph-metadata.ts | walks and refreshes graph metadata | not a consumer in this packet | deferred to build packet |
| graph-metadata-parser.ts | normalizes status and merges metadata | not a consumer in this packet | deferred to build packet |
| folder-discovery.ts | generates description and the global cache | not a consumer in this packet | deferred to build packet |
| validate.sh registry | gates generated JSON in strict mode | not a consumer in this packet | deferred to build packet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Research question and read-only scope frozen
- [x] The two generators, the parser, the schemas, and the validator registry confirmed as the research substrate
- [x] The ten angles scoped across over-reach, exclusion residual, determinism, the status enum, summary drift, parent integrity, path canonicalization, the global regen, the JSON validator, and the safe-regeneration contract

### Phase 2: Core Implementation
- [x] Ten gpt-5.5-fast xhigh angle seats dispatched and recorded through the driver
- [x] Each proposal grounded in a file the seat read
- [x] 40 raw proposals captured across the ten per-angle finding sets

### Phase 3: Verification
- [x] Every load-bearing proposal re-checked by a claude skeptical pass reading the live code
- [x] Four over-claims downgraded and the z_future fix marked already-done
- [x] Proposals deduped and synthesized into the 14 ranked entries in research/research.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source read | Each angle reads the live generator, parser, schema, discovery, or validator code | Read |
| Grounding check | Open the cited file to confirm each proposal rests on real code, not a recollection | Read |
| Cross-model verify | A claude skeptical pass re-checks every load-bearing proposal against the live code | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The live generator, parser, schema, and validator trees | Internal | Green | Nothing to ground the proposals against |
| The gpt-5.5-fast xhigh dispatch driver for the ten angle seats | External | Green | Cannot run the angle-diverse research |
| A different synthesis model for the skeptical pass | External | Green | Cannot independently verify the proposals |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable. This is a read-only research deliverable that mutated no generator, parser, schema, or validator code.
- **Procedure**: Delete research/research.md and research/deltas/ to discard the study. No production surface to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Angle seats) ──► Phase 3 (Verify + Synthesize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Angle seats |
| Angle seats | Setup | Verify |
| Verify | Angle seats | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Scope freeze and angle selection |
| Angle seats | Medium | 10 read-only gpt-5.5-fast xhigh angle seats |
| Verify and Synthesize | Medium | Skeptical cross-model verification plus dedup and write |
| **Total** | | **10 angle seats plus a skeptical cross-model verification pass** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (read-only research)
- [x] No feature flag involved
- [x] No monitoring impact

### Rollback Procedure
1. Delete research/research.md
2. Delete research/deltas/
3. Confirm git status shows no generator, parser, schema, or validator changes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
