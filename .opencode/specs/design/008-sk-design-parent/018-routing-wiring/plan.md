---
title: "Plan: sk-design routing and resource-loading wiring"
description: "Execution plan for the routing wiring: split the interface grounding loader, add the preflight dial input, add the foundations registry aliases and cross-axis TOKENS load, and add precise md-generator aliases, then rerun the routing benchmark. Not started."
trigger_phrases:
  - "sk-design routing wiring plan"
  - "foundations aliases plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the routing-wiring approach across three modes"
    next_safe_action: "Split the interface grounding loader, then add the foundations aliases"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design routing and resource-loading wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | sk-design `mode-registry.json` aliases plus the interface, foundations, and md-generator SKILL.md routers |
| **Framework** | sk-design registry-driven hub routing and per-mode resource maps |
| **Storage** | `.opencode/skills/sk-design/mode-registry.json` and the three mode packets |
| **Testing** | Routing benchmark rerun for the affected modes, `validate.sh --strict` |

### Overview
Five precise wiring changes that align routing and resource loading with content that already landed. Split the interface grounding loader so own-system grounding and a single surface-chosen reference catalog load separately, and add the dial-calibration file to the preflight branch. Add the foundations registry aliases the child owns and make the TOKENS branch load cross-axis context. Add precise md-generator aliases for the validate, report, preview, and study intents. Then rerun the routing benchmark to confirm resource recall holds and wasted loads drop for audit and md-generator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The interface, foundations, and md-generator lineage routing findings read
- [ ] The live `mode-registry.json` aliases and the three routers' resource maps confirmed
- [ ] The 014 benchmark baseline read so the economy delta can be measured

### Definition of Done
- [ ] The interface grounding loader is split and the preflight branch loads the dial-calibration file
- [ ] The parent registry exposes the foundations and precise md-generator aliases with no collisions
- [ ] The foundations TOKENS branch loads cross-axis context
- [ ] The routing benchmark rerun confirms recall holds and economy improves for audit and md-generator, and `validate.sh --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Routing-precision pass: align registry aliases and per-mode resource maps with the intents and content each mode owns, then measure the economy improvement on the benchmark.

### Key Components
- **interface GROUNDING split**: `REAL_SYSTEM_GROUNDING` for own-system grounding and `REAL_WORLD_REFERENCE` for one surface-chosen catalog (Mobbin for app, Refero for web).
- **interface MECHANICAL_PREFLIGHT**: adds `brief_to_dials.md` so the preflight card has its dial input.
- **foundations registry aliases**: grid, container queries, adaptation, data visualization, chart type, data tables, token starter, and related terms.
- **foundations TOKENS branch**: loads color, type, and layout references plus the parent token vocabulary.
- **md-generator aliases**: precise validate, report, preview, and study aliases that do not collide with foundations or interface.

### Data Flow
`per-mode lineage routing findings + 014 benchmark baseline` -> split the interface loader and add the preflight input -> add the foundations and md-generator aliases and the TOKENS cross-axis load -> rerun the benchmark for the affected modes -> record the recall-holds and economy-improves evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes registry aliases and per-mode resource maps. It adds no design content.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | hub alias source of truth | edit | foundations and precise md-generator aliases added, no collisions |
| `design-interface/SKILL.md` GROUNDING and preflight | overloaded grounding, preflight missing dial input | edit | grounding split, preflight loads `brief_to_dials.md` |
| `design-foundations/SKILL.md` TOKENS | loads only the token scaffold | edit | TOKENS loads cross-axis color, type, layout plus token vocabulary |
| routing benchmark for affected modes | baseline from 014 | rerun | recall holds, wasted loads drop for audit and md-generator |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the interface, foundations, and md-generator lineage routing findings
- [ ] Confirm the live `mode-registry.json` aliases and the three routers' resource maps
- [ ] Read the 014 benchmark baseline for the affected modes

### Phase 2: Core Implementation
- [ ] Split the interface `GROUNDING` loader into own-system grounding and a surface-chosen real-world reference catalog
- [ ] Add `brief_to_dials.md` to the interface `MECHANICAL_PREFLIGHT` branch
- [ ] Add the foundations parent registry aliases the child owns
- [ ] Make the foundations `TOKENS` branch load cross-axis color, type, and layout references plus the parent token vocabulary
- [ ] Add precise md-generator validate, report, preview, and study aliases without collisions

### Phase 3: Verification
- [ ] Rerun the routing benchmark for the affected modes and confirm resource recall holds
- [ ] Confirm wasted-load counts drop for audit and md-generator versus the 014 baseline
- [ ] Run `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing | Interface, foundations, md-generator routing and recall | Routing benchmark rerun |
| Economy | Audit and md-generator wasted-load delta | Benchmark routed-vs-wasted counts versus the 014 baseline |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The interface, foundations, md-generator lineage research | Internal | Green | The wiring gaps cannot be grounded |
| `../014-routing-benchmark` baseline and rerun | Internal | Green | The economy delta cannot be measured |
| The live `mode-registry.json` and the three routers | Internal | Green | The aliases and branches cannot be wired correctly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research`, `../014-routing-benchmark` | The wiring gaps and the economy baseline come from these |
| Phase 2 Implementation | Phase 1 | The alias and resource-map edits need the confirmed live config |
| Phase 3 Verification | Phase 2 | The benchmark rerun needs the wiring in place |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read three lineages, the registry, the routers, and the 014 baseline |
| Phase 2 Implementation | M | Five wiring changes across three modes and the registry |
| Phase 3 Verification | M | Benchmark rerun plus the economy-delta read and `validate.sh --strict` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: Resource recall falls, new aliases collide, or routing economy regresses on the benchmark.
- **Procedure**: Each change is a registry alias or resource-map edit. To revert, restore the prior alias set and the prior resource-map branches. No design content is mutated, so rollback is a config revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| New md-generator alias collides with foundations | Benchmark routes a foundations prompt to md-generator | Narrow the alias to a precise phrase and rerun | implementing subagent |
| TOKENS cross-axis load regresses economy | Foundations wasted-load count rises | Gate the cross-axis load to genuinely cross-axis prompts and rerun | implementing subagent |
| Grounding split drops a needed resource | Resource recall falls on a grounding scenario | Restore the dropped resource to the correct branch and rerun | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
