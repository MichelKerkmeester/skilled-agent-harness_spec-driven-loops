---
title: "Feature Specification: sk-interface-design variation diversity"
description: "Add a seed-of-thought variation-diversity mechanism to sk-interface-design: when a brief asks for two or more directions, a committed random seed picks a non-median start in a subject-grounded option space and the rest are spread to be distinct, with grounding and the anti-default critique still primary and never a style chooser."
trigger_phrases:
  - "sk-interface-design variation diversity"
  - "seed of thought debias"
  - "give me N design variations"
  - "non-median design directions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/005-sk-interface-design-variation-diversity"
    last_updated_at: "2026-06-14T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 005 shipped: seed-of-thought variation diversity, v1.2.0"
    next_safe_action: "Orchestrator registers 005 in the 150 parent phase map"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-005-sk-interface-design-variation-diversity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-interface-design variation diversity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-interface-design` grounds a single design in the subject and critiques it against AI-default looks, but it has no defense for the moment it is most likely to fall back to a default: when a brief asks for several directions at once. A median-biased model returns N safe versions of the same layout no matter how the prompt is worded, because its training data is densest at the center and a better prompt alone does not move it off that center. The skill needs a debiasing mechanism for multi-direction requests that does not weaken grounding or the anti-default critique, and does not become a pick-a-vibe style chooser.

### Purpose
Adapt the string seed-of-thought technique to the skill's grounded, anti-default philosophy and ship it as a reference plus a lean SKILL.md hook. A committed random seed sets a non-median starting point inside a subject-grounded option space, then the remaining directions are spread to be genuinely distinct. Grounding, the critique against AI-default looks, and the quality floor stay primary. The seed only breaks the tie the median would otherwise win.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new reference `references/variation_diversity.md` documenting the seed-of-thought procedure, how it combines with grounding and critique, and a worked mini-example.
- A lean SKILL.md hook: a SMART ROUTING keyword trigger, a conditional resource-loading row, a router pseudocode branch, one ALWAYS rule, and a Section 5 reference entry.
- Version bump to 1.2.0 and a matching `changelog/v1.2.0.0.md`.
- Routing and discoverability touches inside the skill: register the reference in `graph-metadata.json` and list it in the README.

### Out of Scope
- Any change to the grounded, anti-default process in `design_principles.md`, which stays the authority.
- The single-direction path, where the existing critique already debiases.
- Any other skill, including `sk-prompt` (owned by phase 006).
- Edits to the 150 parent `spec.md` or `graph-metadata.json`, which the orchestrator updates after this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-interface-design/references/variation_diversity.md` | Create | The seed-of-thought debias mechanism |
| `.opencode/skills/sk-interface-design/SKILL.md` | Modify | Version bump plus the routing and ALWAYS hook |
| `.opencode/skills/sk-interface-design/changelog/v1.2.0.0.md` | Create | Release notes for the mechanism |
| `.opencode/skills/sk-interface-design/graph-metadata.json` | Modify | Register the reference and refresh routing |
| `.opencode/skills/sk-interface-design/README.md` | Modify | List the new reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The seed picks a non-median start in a grounded option space | The procedure indexes into the non-median candidate set only, so a produced direction can never be the median at index 0 |
| REQ-002 | Grounding and the anti-default critique stay primary | Each produced direction is grounded in the subject and survives the critique; a seed pick that fails the critique is dropped, not kept |
| REQ-003 | No style chooser | The option set and seed math live in the agent's reasoning and handoff trail, never surfaced as a selectable menu, and the options are not reusable across briefs |
| REQ-004 | The skill stays house-conformant | `package_skill.py --check` prints PASS and the new reference validates as a reference doc |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The mechanism activates only for multiple directions | SKILL.md scopes the hook to two or more directions; single-direction tasks are explicitly out of scope |
| REQ-006 | A worked example carries real numbers | The reference shows seed, ASCII sum, start, stride, and selected indices end to end |
| REQ-007 | The reference is discoverable | It is registered in `graph-metadata.json` key_files and listed in the README |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py .opencode/skills/sk-interface-design --check` prints PASS.
- **SC-002**: `validate.sh <this-folder> --strict` reports 0 errors.
- **SC-003**: The seed-of-thought procedure, its combination with grounding and critique, and a worked mini-example are all documented in `variation_diversity.md`.
- **SC-004**: SKILL.md carries a SMART ROUTING trigger and one ALWAYS line for the mechanism, and the version reads 1.2.0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The seed reads as raw randomness replacing judgment | The skill would lose its grounded point of view | The seed only orders a grounded set; grounding is upstream and the critique holds the veto |
| Risk | The mechanism drifts into a style chooser | It becomes the templated default the skill resists | The guardrail keeps the option set internal and non-reusable, mirroring the parity protocol |
| Risk | SKILL.md bloats | The lean router is diluted | Detail lives in the reference; SKILL.md gets only a short hook |
| Dependency | `design_principles.md` and `claude_design_parity.md` | The mechanism builds on the grounded process and the pre-build direction gate | Both are present and unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The detail stays in the reference so SKILL.md remains a lean router under the word budget.
- **NFR-M02**: The reference matches house voice: no em dashes, no prose semicolons, snake_case file name.

### Routing
- **NFR-R01**: The advisor still surfaces `sk-interface-design` on design intent after the change.
- **NFR-R02**: The new reference is registered so graph traversal and discovery can find it.

### Integrity
- **NFR-I01**: The anti-default mandate is not relaxed; the seed cannot introduce an ungrounded option.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Direction Count
- **Single direction (N = 1)**: the mechanism does not apply; the standard critique against defaults debiases the one direction.
- **Too few grounded candidates (M < N + 1)**: the brief is too thin to exclude the median; escalate rather than padding the set with defaults.

### Seed Behavior
- **Seed pick fails the critique**: advance to the next position in the spread and re-ground there; never keep a direction because the seed selected it.
- **Median reached by the spread**: it cannot be, because the seed indexes the non-median set only and index 0 is held as the critique baseline.

### Guardrail
- **A reusable option set**: if the same options could be dropped onto a different brief, it has become a preset and must not ship.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two new files plus scoped edits in one skill, no code surface |
| Risk | 6/25 | Reversible docs change; the only real risk is drifting into a style chooser, guarded |
| Research | 6/20 | The seed-of-thought tip plus the skill's existing grounded process |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The mechanism is scoped to multiple-direction requests and ships behind the existing grounding and critique guardrails.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **The skill**: `.opencode/skills/sk-interface-design/` (SKILL.md, references/variation_diversity.md, changelog/v1.2.0.0.md)
- **Parent**: `../spec.md` (phase map)
<!-- /ANCHOR:related-docs -->
