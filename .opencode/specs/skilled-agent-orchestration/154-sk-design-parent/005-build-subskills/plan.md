---
title: "Implementation Plan: Phase 5: build-subskills"
description: "Authors the three net-new sk-design children (foundations, motion, audit) from their locked corpus clusters, each as a self-contained skill package gated behind per-child strict validation and a routing check."
trigger_phrases:
  - "build sk-design subskills plan"
  - "sk-design net-new children plan"
  - "foundations motion audit build approach"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/005-build-subskills"
    last_updated_at: "2026-06-25T12:41:17Z"
    last_updated_by: "claude-opus"
    recent_action: "Populated the Level-1 plan for the net-new sub-skill build phase"
    next_safe_action: "Author sk-design-foundations first, validate it, then proceed to motion and audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/005-build-subskills"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: build-subskills

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown skill packages (SKILL.md + references/feature_catalog/manual_testing_playbook/changelog) |
| **Framework** | system-spec-kit skill conventions; sk-doc templates; skill-advisor + skill-graph for discovery |
| **Storage** | None (filesystem skill packages under `.opencode/skills/`) |
| **Testing** | `validate.sh --strict` per child; advisor routing check per child |

### Overview
This phase authors three net-new design children from the corpus clusters the 001 research mapped and the 002 decision locked. Each child is a self-contained skill package (SKILL.md + references + feature_catalog + manual_testing_playbook + changelog) authored independently, validated independently with `validate.sh --strict`, and confirmed routable with a domain-representative advisor query. The build is purely additive; nothing in the umbrella, the onboarded children, or cross-repo references is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 003 umbrella router and 004 onboarded children exist and validate
- [ ] Locked taxonomy and per-child scope confirmed from `../002-architecture-decision/spec.md`
- [ ] Corpus source clusters for each child located in `../001-corpus-research/research/research.md` §4

### Definition of Done (this is the phase gate before 006)
- [ ] `sk-design-foundations` package complete and `validate.sh --strict` passes
- [ ] `sk-design-motion` package complete and `validate.sh --strict` passes
- [ ] `sk-design-audit` package complete (including the P0-P3 + 5-dimension `/20` contract) and `validate.sh --strict` passes
- [ ] A domain-representative routing query for each child resolves to that child at confidence >=0.8
- [ ] Each child has a changelog entry; spec/plan/tasks updated to reflect the built state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Umbrella router over a flat sibling family (locked at 002). Each net-new child is an independent top-level skill the advisor routes to directly; `sk-design` stays a thin router. `sk-design-foundations` uses hub-style internal structure (`color/`, `type/`, `layout/`) so a later split is mechanical.

### Key Components
- **`sk-design-foundations`**: the static visual system - color (OKLCH, palettes, contrast, theming, dark mode), typography (scale, pairing, measure), layout/spacing/grid, responsive.
- **`sk-design-motion`**: the temporal layer - purposeful animation, micro-interactions, transitions, reduced-motion.
- **`sk-design-audit`**: the cross-cutting MODE child - a11y, performance, critique, hardening, anti-slop detection, with a P0-P3 severity + 5-dimension `/20` scoring contract aligned with `sk-code-review`.

### Data Flow
A design request enters through the advisor, which matches trigger phrases and routes to the most specific child. Foundations/motion/audit own their domains; audit's motion-performance review references the motion child rather than re-owning it. Each child reads its own `references/` and is invoked standalone, so no child blocks another at runtime.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable (additive build; no bug fix). This phase only creates three new skill packages and does not change behavior in any existing surface, so there is no producer/consumer fan-out to inventory. Family-wide impact across existing references is validated in the terminal 006 phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

<!-- This phase MAY sub-divide into one sub-phase per skill during execution (e.g. 001-foundations, 002-motion, 003-audit). The phases below describe the per-child build loop applied to each. -->

### Phase 1: Setup
- [ ] Confirm 003 umbrella + 004 onboarded children validate (precondition)
- [ ] Pull each child's corpus source clusters from `../001-corpus-research/research/research.md` §4
- [ ] Stand up the package skeleton for each child (SKILL.md + references/ + feature_catalog/ + manual_testing_playbook/ + changelog/) from sk-doc templates

### Phase 2: Core Implementation
- [ ] Author `sk-design-foundations` (color/type/layout, split-ready internals) with frontmatter + trigger phrases + when-to-use boundaries
- [ ] Author `sk-design-motion` (animation, micro-interactions, transitions, reduced-motion) with frontmatter + boundaries
- [ ] Author `sk-design-audit` (a11y/perf/critique/harden + anti-slop) including the P0-P3 + 5-dimension `/20` contract aligned with `sk-code-review`
- [ ] Populate each child's references, feature_catalog, manual_testing_playbook, and changelog

### Phase 3: Verification
- [ ] Run `validate.sh --strict` on each child until it passes
- [ ] Run a domain-representative routing query per child and confirm it resolves to the right child at >=0.8
- [ ] Update spec/plan/tasks to reflect the built state; refresh the changelog
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural validation | Each net-new child package (frontmatter, required sections, package dirs) | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` |
| Routing fixture | One domain-representative query per child resolves to that child at >=0.8 | skill-advisor (`advisor_recommend` / `skill_advisor.py`) |
| Discovery rebuild (local check) | Each child is visible to the advisor and graph after authoring frontmatter + triggers | `advisor_rebuild`, `skill_graph_scan` (scoped to verify the new children appear; full family rebuild is 006) |
| Manual | Each child's manual_testing_playbook walked once | Reviewer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003 umbrella router + shared base | Internal | Green (planned-complete before this phase) | New children have no family to register into; routing gate unreachable |
| 004 onboarded children (interface, spec) | Internal | Green (planned-complete before this phase) | Sibling boundaries can't be tested; overlap risk unmitigated |
| 002 locked taxonomy + per-child scope | Internal | Green (complete) | Build target ambiguous; risk of building the wrong grain |
| 001 corpus clusters (`research.md` §4) | Internal | Green (complete) | Children lack sourced content; traceability (REQ-007) fails |
| skill-advisor + skill-graph | Internal | Green | Routing/discovery checks (REQ-004) cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A net-new child fails `validate.sh --strict` it cannot pass, misroutes against a sibling, or its corpus mapping proves wrong.
- **Procedure**: Because the build is purely additive, rollback is removing the offending child's `.opencode/skills/sk-design-<name>/` directory (and skipping its changelog entry); no existing skill or reference changed, so deleting the new package restores the prior state. Re-run discovery rebuild so the dropped child no longer appears.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

