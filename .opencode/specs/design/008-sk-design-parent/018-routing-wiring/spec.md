---
title: "Feature Specification: sk-design routing and resource-loading wiring"
description: "Planned Level-2 implementation phase: tighten router precision and resource loading across interface, foundations, and md-generator. Split the overloaded interface grounding loader, add the dial-calibration input to the preflight branch, add the foundations registry aliases the child owns but the parent does not expose, make the foundations TOKENS branch load its cross-axis references, and add precise md-generator aliases for its validate, report, preview, and study intents. Not started."
trigger_phrases:
  - "sk-design routing wiring phase"
  - "foundations registry aliases"
  - "interface grounding loader split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the routing-wiring phase from the interface, foundations, and md-generator lineages"
    next_safe_action: "Split the interface grounding loader, then add the foundations aliases"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design routing and resource-loading wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (not started) |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../017-real-bugs/spec.md |
| **Successor** | ../019-handoff-card/spec.md |
| **Handoff Criteria** | The interface grounding loader is split into own-system grounding and one surface-chosen real-world reference catalog, the interface preflight branch loads the dial-calibration file, the parent registry exposes the foundations aliases the child owns, the foundations TOKENS branch loads its cross-axis color, type, and layout references, the md-generator registry exposes precise aliases for its validate, report, preview, and study intents without colliding with foundations or interface, the routing benchmark rerun confirms resource recall holds and wasted loads drop for audit and md-generator, and `validate.sh --strict` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Router and registry wiring lags the landed design content in three modes. The interface `GROUNDING` resource map loads design-system grounding, the Mobbin and Refero reference discipline, and both tool catalogs together, so grounding-heavy scenarios carry high routed and wasted counts, and the `MECHANICAL_PREFLIGHT` branch omits `brief_to_dials.md` even though the preflight card depends on dial calibration (`../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md`, sections 5 P1). Foundations owns more static-system vocabulary than the parent registry exposes (grid, container queries, adaptation, data visualization, chart type, data tables, token starter), and its `TOKENS` branch loads only the token scaffold instead of the cross-axis color, type, and layout context that token work needs (`../015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/research.md`, P1-1 and P1-2). The md-generator aliases are extraction-heavy and under-cover the validate, report, preview, and study intents the skill explicitly owns, which depresses its routing score (`../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md`, P1 routing). The sibling 014 benchmark measured the cost directly: audit and md-generator carry the heaviest RESOURCE_MAP fan-out (`../014-routing-benchmark/implementation-summary.md`).

### Purpose
Tighten router precision and resource loading so each mode loads what its prose owns and no more. Split the overloaded interface grounding loader into own-system grounding versus one real-world reference catalog chosen by surface, add the dial-calibration file to the interface preflight branch, add the foundations parent registry aliases the child owns, make the foundations TOKENS branch load its cross-axis references, and add precise md-generator aliases for the validate, report, preview, and study intents while avoiding broad aliases that collide with foundations or interface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split the interface `GROUNDING` loader into own-system grounding (`REAL_SYSTEM_GROUNDING`) and a single surface-chosen real-world reference catalog (`REAL_WORLD_REFERENCE`), keeping paid lookup optional and non-blocking.
- Add the dial-calibration file `brief_to_dials.md` to the interface `MECHANICAL_PREFLIGHT` branch so the preflight card has its inputs.
- Add the foundations parent registry aliases the child owns but the parent does not expose: grid, container queries, adaptation, data visualization, chart type, data tables, token starter, and the related terms.
- Make the foundations `TOKENS` branch load its cross-axis color, type, and layout references plus the parent token vocabulary, not just the token scaffold.
- Add precise md-generator registry aliases for the validate, report, preview, and study intents it owns, avoiding broad aliases that collide with foundations or interface.

### Out of Scope
- The shared-register loader mechanism (`../016-register-loader-contract`) and the audit router loop bug (`../017-real-bugs`).
- The sk-code handoff card schema (`../019-handoff-card`) and the benchmark fixtures (`../020-benchmark-fixtures`).
- Any new design reference content. This phase wires routing and loading to content that already exists.

### Inputs (read-only)
- The per-mode wiring findings: `../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md` (grounding split, preflight dial calibration), `../015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/research.md` (P1-1 aliases, P1-2 TOKENS cross-axis), `../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md` (precise aliases).
- The routing economy evidence: `../014-routing-benchmark/implementation-summary.md` (audit and md-generator heavy fan-out).
- The live `mode-registry.json` and the interface, foundations, and md-generator SKILL.md routers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/mode-registry.json` | Updated | Add the foundations aliases the child owns and the precise md-generator validate/report/preview/study aliases, avoiding collisions |
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Updated | Split `GROUNDING` into own-system grounding and a surface-chosen real-world reference catalog, and add `brief_to_dials.md` to the preflight branch |
| `.opencode/skills/sk-design/design-foundations/SKILL.md` | Updated | Make the `TOKENS` branch load cross-axis color, type, and layout references plus the parent token vocabulary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The interface grounding loader is split | `GROUNDING` no longer loads both tool catalogs at once; own-system grounding and a single surface-chosen real-world reference catalog load separately, and grounding-heavy scenarios show lower wasted counts on the benchmark |
| REQ-002 | Foundations and md-generator aliases match owned intents | The parent registry exposes the foundations aliases the child owns and precise md-generator aliases for validate, report, preview, and study, with no broad alias that collides with foundations or interface |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The interface preflight branch has its dial input | `MECHANICAL_PREFLIGHT` loads `brief_to_dials.md` so the preflight card has the dial-calibration input it depends on |
| REQ-004 | The foundations TOKENS branch loads cross-axis context | The `TOKENS` branch loads the color, type, and layout references plus the parent token vocabulary, not just the token scaffold, and the routing benchmark rerun confirms resource recall holds while wasted loads drop for audit and md-generator |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Interface grounding loads as two precise branches (own-system grounding and one surface-chosen reference catalog), the preflight branch loads the dial-calibration file, and grounding-heavy scenarios route leaner on the benchmark.
- **SC-002**: The parent registry exposes the foundations and md-generator aliases their children own, the foundations TOKENS branch loads cross-axis context, the benchmark rerun confirms resource recall holds and routing economy improves for audit and md-generator, and `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New md-generator aliases collide with foundations or interface | Misrouting between modes | Keep aliases precise (validate DESIGN.md, check tokens.json fidelity, DESIGN.md preview, study style reference examples), avoid broad terms like design system |
| Risk | The TOKENS cross-axis load raises the routed count too far | Routing economy regresses | Load only the axis references the token work needs and confirm recall holds without a wasteful fan-out on the benchmark |
| Risk | The grounding split drops a resource a scenario needs | Resource recall falls | Rerun the benchmark and confirm recall holds before claiming the split is correct |
| Dependency | The interface, foundations, and md-generator lineage research | The wiring gaps cannot be grounded | Read each lineage's routing findings for the exact branches and aliases |
| Dependency | `../014-routing-benchmark` and its rerun | The economy improvement cannot be measured | Rerun the benchmark for the affected modes after the wiring change |
| Dependency | The live `mode-registry.json` and the three routers | The aliases and branches cannot be wired correctly | Read the registry and the routers before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Performance | Routing economy improves: wasted-load counts drop for audit and md-generator while resource recall holds |
| Precision | New aliases route only to the owning mode and do not collide across foundations, interface, and md-generator |
| Maintainability | The registry stays the single source of truth for aliases, so routing changes live in one place |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A grounding prompt for an app surface must load Mobbin, while a web or style-direction prompt loads Refero, not both at once.
- A generic design-token request must still route to foundations, not md-generator, after the md-generator aliases are added.
- A token prompt that touches only one axis must not be forced to load all three axis references if the work is genuinely single-axis.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Moderate. Five distinct wiring changes across three modes and the shared registry, each small on its own but collectively needing a benchmark rerun to confirm recall holds and economy improves. The main care point is alias precision so the new md-generator and foundations aliases do not collide.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the interface real-world reference catalog should choose Mobbin versus Refero by an explicit surface keyword or by a broader heuristic: the interface lineage recommends app/iOS/screens/flows to Mobbin and web/style direction to Refero, and the implementing subagent confirms the split against the benchmark.
- Whether the foundations TOKENS cross-axis load should be unconditional or gated to genuinely cross-axis prompts: the implementing subagent tunes this against the benchmark so recall holds without a wasteful fan-out.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
