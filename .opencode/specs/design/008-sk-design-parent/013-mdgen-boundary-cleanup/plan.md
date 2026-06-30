---
title: "Plan: sk-design md-generator authoring boundary and family cleanup"
description: "Execution plan for the final 009 phase: added the md-generator authoring-boundary reference and source-of-truth router card, fixed the stale design-audit changelog pointer, and ran the family-wide packaging and validation closeout. Documentation and cleanup only, executed, the family --check passes clean and the advisor rebuild is deferred on purpose."
trigger_phrases:
  - "sk-design md-generator boundary plan"
  - "design family validation closeout plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/013-mdgen-boundary-cleanup"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the build plan and wired the two md-gen files into the SKILL.md router"
    next_safe_action: "Family build complete pending commit, advisor rebuild deferred and run anytime"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-013-mdgen-boundary-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design md-generator authoring boundary and family cleanup

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown authoring (sk-doc) plus a one-line SKILL.md cleanup edit |
| **Framework** | sk-design mode packets with the `package_skill` packaging check, advisor rebuild deferred |
| **Storage** | `.opencode/skills/sk-design/design-md-generator/{references,assets}/` and `design-audit/SKILL.md` |
| **Testing** | `package_skill --check` on the hub and five packets and `validate.sh` across the family, advisor rebuild deferred |

### Overview
This is the final phase of the 009 deliverable and the leanest by design: md-generator needs only the source-of-truth boundary documented, not expanded. One reference labels values as measured / brief-provided / inferred / absent to protect the cardinal fidelity rule, and one quick card asks the same four questions at the point of use. The one dangling changelog pointer the research flagged in `design-audit/SKILL.md` is fixed. Then the family-wide closeout package-checks the hub and all five mode packets and validates the family, with the advisor rebuild deferred on purpose. No forward-authoring capability is built, since that routes to a separate future `design-spec` decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `../009-reference-asset-expansion/research/research.md` section 3.6 and section 7 read as the grounding rationale
- [x] The md-generator `references/` and `assets/` homes confirmed on the live tree
- [x] `design-audit/SKILL.md` section 8 confirmed to cite the removed `changelog/v1.0.0.1.md`, and `changelog/v1.0.0.0.md` confirmed present

### Definition of Done
- [x] `references/authoring_boundary.md` documents the four source-of-truth labels and excludes forward-authoring
- [x] `assets/source_of_truth_router_card.md` asks measured / brief-provided / inferred / missing
- [x] The design-audit changelog pointer resolves to an existing file
- [x] `package_skill --check` passes on the hub and all five mode packets and `validate.sh` passes across the family, with the advisor rebuild deferred on purpose because no advisor-routable identity changed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-and-cleanup phase: author two md-generator docs, apply one surgical SKILL.md pointer fix, then run the family-wide packaging and validation closeout. No pipeline or capability change.

### Key Components
- **authoring_boundary.md** (reference): the source-of-truth boundary (measured vs brief-provided vs inferred vs absent) protecting the cardinal fidelity rule, documentation only.
- **source_of_truth_router_card.md** (asset): the four-question fill-in card that routes a value to the right label and a missing backing to ABSENT, never to a fabricated value.
- **design-audit/SKILL.md** (cleanup): the section 8 changelog reference repointed from `v1.0.0.1.md` to `v1.0.0.0.md`.
- **Family closeout**: `package_skill --check` across the hub and the five mode packets and `validate.sh` across the family, with the advisor rebuild deferred on purpose.

### Data Flow
`009 research/research.md` (section 3.6, section 7) plus the live md-generator tree and the design-audit changelog state → author the two md-generator docs and the one cleanup edit → run the family packaging, advisor rebuild, and validation → record the closeout acceptance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase added two md-generator documentation files and applied one surgical changelog-pointer fix in `design-audit/SKILL.md`, with no pipeline, schema, or capability behavior change. The family-wide packaging and validation run is read-only verification over the existing packets.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-md-generator/references/authoring_boundary.md` | created (121 lines) | create | file present, documents the four labels, excludes forward-authoring, wired into the router |
| `design-md-generator/assets/source_of_truth_router_card.md` | created (82 lines) | create | file present, asks the four source-of-truth questions, wired into the router |
| `design-audit/SKILL.md` (section 8) | repointed to `v1.0.0.0.md` | edit | cited changelog file exists on disk, zero stale refs |
| hub plus five sk-design mode packets | shipped skills | verify | `package_skill --check` exit 0 and `validate.sh` pass, advisor rebuild deferred on purpose |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read `../009-reference-asset-expansion/research/research.md` section 3.6 and section 7 as the rationale
- [x] Confirm the md-generator `references/` and `assets/` homes on the live tree
- [x] Confirm `design-audit/SKILL.md` section 8 cites the removed `v1.0.0.1.md` and that `changelog/v1.0.0.0.md` exists

### Phase 2: Core Implementation
- [x] Author `references/authoring_boundary.md` (measured vs brief-provided vs inferred vs absent, documentation only, no forward-authoring) and wire it into the md-generator router
- [x] Author `assets/source_of_truth_router_card.md` (the four-question routing card) and wire it into the md-generator router
- [x] Repoint the `design-audit/SKILL.md` section 8 changelog reference to `changelog/v1.0.0.0.md`

### Phase 3: Verification
- [x] Run `package_skill --check` on the hub and all five sk-design mode packets (exit 0, design content across 010-013 HVR-clean)
- [x] Run `validate.sh` across the family, with the skill-advisor rebuild deferred on purpose because no advisor-routable identity changed and to avoid colliding with concurrent advisor work on this branch
- [x] Record the closeout acceptance evidence and confirm the two flagged build-time decisions (three-dials ownership, N1/N2 owning home) were settled in the earlier phases
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Two new md-generator docs and the changelog pointer | sk-doc review plus on-disk path resolution |
| Packaging | Hub plus five sk-design mode packets | `package_skill --check` (exit 0) |
| Manual | Family-wide closeout | `validate.sh` across the family, advisor rebuild deferred on purpose |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../009-reference-asset-expansion/research/research.md` | Internal | Green | Scope cannot be grounded |
| `../012-foundations-motion-audit` (planned predecessor) | Internal | Planned | This final phase runs after the earlier phases |
| `package_skill` packaging check | Internal | Green | Family closeout cannot be recorded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The boundary reference reads as a forward-authoring capability, the changelog repoint targets another missing file, or the family closeout fails.
- **Procedure**: The two new md-generator docs are additive, so deleting them reverts the additions. The changelog edit is a one-line pointer change, so restoring the prior string reverts it. No pipeline, schema, or capability state was mutated, so rollback is a file delete plus a one-line revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
