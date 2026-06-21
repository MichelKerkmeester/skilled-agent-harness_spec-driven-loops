---
title: "Implementation Plan: Per-Doc Quality SLAs [template:level_2/plan.md]"
description: "Adds a per-doc quality SLA over the already-computed quality score that files a report-only ticket into an existing maintenance queue. PLANNED scaffold, not yet built."
trigger_phrases:
  - "per doc quality sla plan"
  - "quality threshold plan"
  - "report only ticket"
  - "sla evaluator"
  - "host queue dependency"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "028-memory-search-intelligence/005-spec-data-quality/025-novel-per-doc-quality-slas"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 plan for per-doc quality SLA scaffold"
    next_safe_action: "Build SLA evaluator once a host queue ships"
    blockers:
      - "Host queue (freshness decay queue or B3 refinement_queue) must exist before build"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/quality/quality-loop.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/pe-gating.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Per-Doc Quality SLAs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node MCP server) |
| **Framework** | Spec Kit Memory MCP, no UI framework |
| **Storage** | Existing memory DB plus the existing host maintenance queue |
| **Testing** | Vitest |

### Overview
This phase adds a named per-doc quality SLA, a threshold over the already-computed quality score declared on the description.json governance block. A thin evaluator reads the score that `computeMemoryQualityScore` already produces on the save path (`quality-loop.ts:392`), compares it against the declared threshold and, when the doc is below its bar, files exactly one report-only ticket into an existing maintenance queue. The whole path sits behind a default-off flag and never mutates the doc.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented in `spec.md`
- [ ] Success criteria measurable (SC-001 flag-off dormancy and SC-002 one report-only ticket)
- [ ] Host queue dependency identified and confirmed present before build

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001 through REQ-004)
- [ ] Vitest suite passing for threshold, report-only and default-off behavior
- [ ] Docs updated (spec, plan, tasks and checklist synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin evaluator plus report-only emitter, gated by a default-off flag. No new scorer and no new store.

### Key Components
- **`quality-sla.ts`**: reads the already-computed quality score for a doc, reads the declared SLA threshold from the governance block and returns an at-risk verdict. It computes no new score.
- **`sla-ticket.ts`**: writes one report-only ticket row into the existing host queue when a doc is below its SLA. It dedups on doc identity and never auto-actions the ticket.
- **`description-schema.ts`**: documents the additive SLA governance field (threshold value plus target surface) through the existing passthrough description schema.
- **`quality-sla.vitest.ts`**: pins threshold comparison, report-only output, default-off dormancy and the no-host-queue no-op.

### Data Flow
The save path computes the quality score through `computeMemoryQualityScore` (`quality-loop.ts:392`). When the flag is on, the evaluator reads that score and the SLA threshold from the description.json governance block. A score at or above the threshold passes. A score strictly below files one report-only ticket through the emitter into the existing host queue. No doc body or metadata field changes at any point.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches a schema boundary (`description-schema.ts`) and a persistence surface (the ticket row), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `computeMemoryQualityScore` (`quality-loop.ts`) | Produces the per-doc quality score on the save path | Unchanged. The SLA reads its output and derives no score of its own | `rg -n "computeMemoryQualityScore" .opencode/skills/system-spec-kit/mcp_server/lib/quality/` |
| `description-schema.ts` governance block | Validates the description.json governance fields | Modify. Add the additive SLA threshold field through the existing passthrough schema | `rg -n "passthrough" .opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts` |
| Host maintenance queue (freshness decay queue or B3 `refinement_queue`) | Holds maintenance tickets for later triage | Not a consumer until it exists. The emitter degrades to a no-op when no host queue is present | Build-time presence check for the host queue module |

Required inventory before build:
- Same-class score readers: `rg -n "computeMemoryQualityScore|qualityScore" .opencode/skills/system-spec-kit/mcp_server/lib/quality/`.
- Consumers of the governance block: `rg -n "governance|source_kind|document_weight" .opencode/skills/system-spec-kit/mcp_server/lib/description/`.
- Boundary invariant: a doc with no declared SLA and a doc with no computed score both skip, neither is treated as a failure.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm a host queue (freshness decay queue or B3 `refinement_queue`) exists at build time
- [ ] Add the default-off flag that gates the whole evaluator
- [ ] Declare the additive SLA threshold field on the description governance block

### Phase 2: Core Implementation
- [ ] Build `quality-sla.ts` that reads the computed score and compares it to the declared threshold
- [ ] Build `sla-ticket.ts` that files one report-only ticket and dedups on doc identity
- [ ] Wire both behind the flag and degrade to a no-op when no host queue is present

### Phase 3: Verification
- [ ] Run the Vitest suite for threshold, report-only, default-off and no-queue cases
- [ ] Confirm the flag-off path leaves the save and search responses byte-for-byte unchanged
- [ ] Update spec, plan, tasks and checklist to the shipped state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Threshold comparison, boundary at-or-above versus strictly-below, missing-score skip | Vitest |
| Integration | Save path with the flag on and a host queue present files exactly one ticket | Vitest |
| Manual | Flag-off byte-for-byte check that no save or search response changes | Local run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Host queue (freshness decay queue or B3 `refinement_queue`) | Internal | Red | Hard blocker. The SLA has nowhere to file. The evaluator degrades to a no-op until one ships |
| A8 governance fields and the shipped pure scorer | Internal | Green | The SLA reuses the computed score and the governance block. Both already exist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The SLA path emits noisy tickets or any doc mutation is observed.
- **Procedure**: Unset the default-off flag. The evaluator and emitter return to fully dormant and add no cost.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Host queue exists | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Low | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | Low | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Flag confirmed default-off so the path is dormant on ship
- [ ] No data migration required (the SLA adds no store)
- [ ] Host queue presence verified before enabling the flag

### Rollback Procedure
1. Unset the default-off flag to disable the evaluator and emitter.
2. Confirm no new tickets are filed and the save and search paths are unchanged.
3. Leave any already-filed report-only tickets to the host queue's own TTL.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The SLA writes only report-only ticket rows into an existing queue and mutates no doc.
<!-- /ANCHOR:enhanced-rollback -->
