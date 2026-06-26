---
title: "Feature Specification: sk-design md-generator authoring boundary and family cleanup"
description: "Executed Level-1 implementation phase: added the md-generator measured-vs-authored authoring boundary reference and its source-of-truth routing card, fixed the stale design-audit changelog pointer, and ran the family-wide packaging and validation closeout. Documentation and cleanup only, no forward-authoring capability. Final phase of the 009 deliverable, the family build is complete pending commit."
trigger_phrases:
  - "sk-design md-generator authoring boundary"
  - "design source of truth router card"
  - "sk-design family validation closeout"
  - "design-audit changelog pointer fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/013-mdgen-boundary-cleanup"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the two md-gen docs, fixed the changelog pointer, family --check passes clean"
    next_safe_action: "Family build complete pending commit, advisor rebuild deferred and run anytime"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-013-mdgen-boundary-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three-dials ownership resolved in earlier phases: VISUAL_DENSITY to foundations, DESIGN_VARIANCE and the dials intake to interface in brief_to_dials.md reading the shared register, MOTION_INTENSITY to motion"
      - "N1/N2 owning home resolved in earlier phases: interface-owned and authored once, audit references the gates by path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design md-generator authoring boundary and family cleanup

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../012-foundations-motion-audit/spec.md (planned) |
| **Successor** | None (final phase) |
| **Handoff Criteria** | `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md` and `assets/source_of_truth_router_card.md` exist and document the source-of-truth distinction without adding a forward-authoring capability, the `design-audit/SKILL.md` changelog pointer resolves to an existing file, all five sk-design mode packets pass `package_skill --check`, and `validate.sh` passes across the family. The advisor rebuild is deferred on purpose because no mode advisor-routable identity changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research deliverable in `../009-reference-asset-expansion/research/research.md` (section 3.6) found `design-md-generator` to be the leanest expansion target: essentially complete, with one genuine in-scope gap. The md-generator's cardinal rule is fidelity. Its output must reflect what was actually extracted from a real source, never invented values. But the family had no explicit reference that draws the line between a value that was MEASURED from a real site, a value that was BRIEF-PROVIDED, a value that was INFERRED, and a value that is ABSENT. Without that boundary documented, the fidelity rule is pulled toward forward-authoring (writing a design from a brief rather than measuring one), which the research routes out of scope to a separate future `design-spec` decision (section 7, question 1). Separately, the research flagged a pre-existing defect (section 7, the defect note): `design-audit/SKILL.md` section 8 cited `changelog/v1.0.0.1.md`, a file the v1.0.0.0 pre-release changelog collapse removed, so the pointer was dangling.

### Purpose
As the final phase of the 009 deliverable, add the two in-scope md-generator artifacts that protect the cardinal fidelity rule, fix the dangling design-audit changelog pointer, and run the family-wide packaging and validation closeout. The first artifact is a reference that clarifies the source-of-truth boundary (measured vs brief-provided vs inferred vs absent) strictly as documentation, NOT a forward-authoring capability. The second is a quick routing card that asks the same four questions at the point of use to prevent fabricated values. This phase is executed: both artifacts are built, the changelog pointer is fixed, and the family closeout passed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A md-generator reference documenting the source-of-truth boundary: values MEASURED from a real site vs BRIEF-PROVIDED vs INFERRED vs ABSENT, protecting the cardinal fidelity rule (documentation only).
- A md-generator quick routing card that asks measured / brief-provided / inferred / missing to prevent fabricated values.
- The cleanup fix: repoint the `design-audit/SKILL.md` section 8 changelog reference from the removed `changelog/v1.0.0.1.md` to the existing `changelog/v1.0.0.0.md`.
- The family closeout: run `package_skill --check` on the hub and all five sk-design mode packets and run `validate.sh` across the family, recorded as the acceptance evidence. The advisor rebuild is deferred on purpose because no advisor-routable identity changed.

### Out of Scope
- Any forward-authoring capability for md-generator (writing a design from a brief rather than measuring a real source). This routes to a separate future `design-spec` decision, not this phase.
- A second extraction backend or crawler, and any change to the existing extraction/write/validate/report pipeline.
- The interface, foundations, motion, and shared/audit additions from the earlier 009 phases (each is its own phase, and this is the final md-generator-and-cleanup phase).

### Inputs (read-only)
- The ranked deliverable and rationale: `../009-reference-asset-expansion/research/research.md` (section 3.6 "design-md-generator", section 7 "Open Questions / Divergences").
- The live `sk-design/` tree, to confirm the md-generator `references/` and `assets/` homes and the design-audit changelog state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md` | Created (121 lines) | Source-of-truth boundary: measured vs brief-provided vs inferred vs absent. Protects the cardinal fidelity rule, documentation only, no forward-authoring capability. Wired into the md-generator SKILL.md router |
| `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md` | Created (82 lines) | Quick routing card asking measured / brief-provided / inferred / missing to prevent fabricated values. Wired into the md-generator SKILL.md router |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Updated | Repointed the section 8 changelog reference from the removed `changelog/v1.0.0.1.md` to the existing `changelog/v1.0.0.0.md`. Zero stale refs remain |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The authoring-boundary reference documents the source-of-truth distinction without adding forward-authoring | `.opencode/skills/sk-design/design-md-generator/references/authoring_boundary.md` exists and labels values as MEASURED / BRIEF-PROVIDED / INFERRED / ABSENT, states the cardinal fidelity rule it protects, and explicitly excludes a forward-authoring capability |
| REQ-002 | The dangling design-audit changelog pointer is fixed | `design-audit/SKILL.md` section 8 no longer references `changelog/v1.0.0.1.md`, and the cited changelog file exists on disk (`changelog/v1.0.0.0.md`) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A quick routing card operationalizes the boundary at the point of use | `.opencode/skills/sk-design/design-md-generator/assets/source_of_truth_router_card.md` exists and asks measured / brief-provided / inferred / missing to prevent fabricated values |
| REQ-004 | The family closeout passes and is recorded as acceptance | `package_skill --check` passes (exit 0) on the hub and all five sk-design mode packets, and `validate.sh` passes across the family. The advisor rebuild is deferred on purpose because no mode advisor-routable identity changed, and the operator can run `advisor_rebuild` anytime. The results are recorded as the closeout acceptance evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The md-generator gained `references/authoring_boundary.md` (measured vs brief-provided vs inferred vs absent, fidelity-rule-protecting, documentation only) and `assets/source_of_truth_router_card.md` (the four-question card), both wired into the md-generator router, with no forward-authoring capability added.
- **SC-002**: The `design-audit/SKILL.md` changelog pointer resolves to an existing file, and the family closeout (`package_skill --check` on the hub and all five mode packets plus `validate.sh` across the family) passes and is recorded as the acceptance evidence. The advisor rebuild is deferred on purpose because no advisor-routable identity changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The authoring-boundary reference drifts into a forward-authoring capability | Cardinal fidelity rule weakens and scope leaks into the future `design-spec` decision | Keep the reference as documentation of the source-of-truth labels only and state the forward-authoring exclusion explicitly in the file |
| Risk | The router card invites invented values for "missing" backing | Fabricated tokens re-enter the pipeline | Card routes a missing backing to ABSENT, never to an inferred value presented as measured |
| Risk | The changelog repoint targets another removed file | Pointer stays dangling | Confirm `changelog/v1.0.0.0.md` exists on disk before editing the reference |
| Dependency | `../009-reference-asset-expansion/research/research.md` | Scope cannot be grounded | Read section 3.6 and section 7 as the rationale for the boundary reference, the card, and the changelog fix |
| Dependency | `../012-foundations-motion-audit/spec.md` (planned) | This is the final phase and runs after the others | Sequence after the predecessor phase, and this phase carries the family-wide validation closeout |
| Dependency | Live `sk-design/` tree and `package_skill` | Homes and packaging check unconfirmed | Confirm the md-generator `references/`/`assets/` homes and the five mode packets before authoring and packaging |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These two build-time decisions were flagged by the 009 research to be resolved before or within the earlier phases (not this final phase). The family closeout confirms they were settled in practice across 010-012.

- Three-dials ownership resolved: `VISUAL_DENSITY` went to foundations, `DESIGN_VARIANCE` to interface, `MOTION_INTENSITY` to motion. The dials intake lives in interface's `brief_to_dials.md`, which reads the shared register rather than re-authoring the posture.
- N1/N2 owning home resolved: interface-owned and authored once (`copy_and_mock_data.md` is N1, `mechanical_defaults.md` is N2 in 011), and audit references the gates by path rather than duplicating them.
- This phase's own boundary: the authoring-boundary documentation is in scope and is built. The forward-authoring capability stays out of scope and routes to a separate future `design-spec` decision.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
