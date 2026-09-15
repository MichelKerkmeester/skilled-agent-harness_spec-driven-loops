---
title: "Feature Specification: Phase 1: command-yaml-alignment"
description: "All four deep-loop command YAMLs pass the convergence threshold, stop policy and convergence mode to the fan-out runner, no YAML dispatches the leaf agent as a full-loop executor, and the prompt packs describe the state-log gateway the runtime implements."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: command-yaml-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 19 |
| **Predecessor** | 015-symlink-contained-paths |
| **Successor** | 017-protocol-and-catalog-alignment |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Remediate the alignment review findings specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The four command YAMLs drove the fan-out runner with different loop flags: none passed the convergence mode the runner reads, and the confirm review YAML passed neither threshold nor stop policy. The same YAML's native fan-out branch dispatched the leaf review agent as a full-loop sub-agent, the opposite of the model the auto YAML documents. The prompt packs called the state log a read-only projection in wording that hid the gateway as its single writer.

### Purpose
One runner contract across the four commands, one native model, and prompt packs that say what the gateway does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The three loop flags on every fan-out call site, bound from the config placeholders
- Removing the confirm review YAML's native leaf-as-loop branch in favour of the runner
- Prompt-pack wording naming the gateway as the state log's only writer
- Regenerated compiled contracts and a contract test that renders each call site

### Out of Scope
- The confirm YAML's interactive stop logic - the flag governs the fan-out lineages, which run the auto surface
- The direct append sites the review YAML still uses for error and adjudication records - observed, bound separately

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep-review-auto.yaml, deep-review-confirm.yaml, deep-research-auto.yaml, deep-research-confirm.yaml` | Modify | Three loop flags on every fan-out call; the confirm review native branch replaced by the runner path; a stop-policy input bound in the confirm review YAML |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md, deep-research.contract.md` | Regenerate | Digest the edited YAMLs and prompt packs |
| `.opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl and the deep-research twin` | Modify | Gateway named as the state log's only writer; projection phrasing removed |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts` | Modify | Fan-out call-site contract tests, eight cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every fan-out call site in the four YAMLs passes the convergence threshold, the stop policy and the convergence mode, bound from config placeholders |
| REQ-002 | No command YAML dispatches the leaf review or research agent as a full-loop sub-agent; native lineages run through the runner |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The prompt packs name the append gateway as the state log's only writer and the compiled contracts are regenerated |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The call-site contract test fails against the unmodified YAMLs on the missing mode flag and the confirm native branch, and passes after
- **SC-002**: Contract drift and render tests, and the deep-loop suite, exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A confirm run's interactive loop ignores the new stop-policy input | Low | The input binds the fan-out lineages; the single-executor confirm loop is unchanged and documented as such |
| Risk | Compiled contracts drift again on the next doc edit | Low | The drift test catches it, as it did twice in this packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable

### Security
- **NFR-S01**: Not applicable

### Reliability
- **NFR-R01**: All four YAMLs parse and their contracts recompile
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Mode flag absent from config: the placeholder binds the documented default
- Confirm run with fan-out: lineages run through the runner with all three flags

### Error Scenarios
- Contract stale after edit: the drift test fails until recompiled

### State Transitions
- Not applicable
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four YAMLs, two templates, two contracts, one test file |
| Risk | 8/25 | Command contracts every deep loop runs through |
| Research | 4/20 | Findings from the alignment review, one premise corrected by the delegate |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

---


