---
title: "Feature Specification: sk-design parent skill"
description: "Establish sk-design as the parent for a family of focused design sub-skills, with the family's composition determined by research before any build."
trigger_phrases:
  - "sk-design parent skill"
  - "design skill family"
  - "sk-design sub-skills"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Reconciled parent phase map with the on-disk child phases"
    next_safe_action: "Continue planned child work from the active or planned phase packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + outcome only; no merge/migration/consolidation history; heavy docs live in children. -->

# Feature Specification: sk-design parent skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Active |
| **Created** | 2026-06-25 |
| **Branch** | `main` |
| **Parent Spec** | None (root) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | `143-sk-design-interface` |
| **Successor** | Active child phases listed below |
| **Handoff Criteria** | Each child phase validates independently; parent validates under recursive phase-parent policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Design capability today lives in one strong interface skill (`sk-design-interface`) plus a sibling style-reference extractor (`sk-design-md-generator`), while a large external corpus of design skills (interface, color/tokens, motion, interaction, accessibility, QA, design systems, process) sits unorganized in `external/`. There is no parent that organizes the design-skill family under one identity or routes between focused design sub-skills, so coverage is uneven and discovery is ad hoc.

### Purpose
Establish `sk-design` as the parent for a family of focused, independently-invokable design sub-skills — one of which remains the interface skill. The composition of that family (which sub-skills exist, and whether the parent is a single hub or an umbrella over a sibling family) is **decided by evidence first**: a deep-research pass over the corpus precedes any build, and the build phases are gated behind a human review of the research output.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A research-driven taxonomy for the `sk-design` family (which design sub-skills it contains).
- A structural decision for the parent (single hub with nested packets vs. umbrella router over a sibling family).
- Standing up the `sk-design` parent and the design sub-skills the research finalizes.
- Bringing `sk-design-interface` and `sk-design-md-generator` into the family.
- Family-wide routing, validation, advisor + skill-graph integration.

### Out of Scope
- The design-judgment content authored inside each sub-skill is owned by that sub-skill's own phase, not this parent.
- Transports (`mcp-figma`, `mcp-open-design`) remain separate; they are not design-judgment sub-skills.

### Files to Change
Per-phase detail lives in each child's `plan.md`. Summary for audit trail only:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-corpus-research/research/` | Create | corpus-research | Deep-research artifacts (fan-out config, state, research.md) |
| `.opencode/skills/sk-design/` | Create | scaffold | New parent skill (structure per architecture decision) |
| `.opencode/skills/sk-design-*/` | Create | build-sub-skills | Net-new design sub-skills the research finalizes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-corpus-research/` | Phase 1 - corpus research | complete |
| 002 | `002-architecture-decision/` | Phase 2: architecture-decision | complete |
| 003 | `003-scaffold-parent/` | Phase 3: scaffold-parent | complete |
| 004 | `004-onboard-existing/` | Phase 4: onboard-existing | complete |
| 005 | `005-build-subskills/` | Phase 5: build-subskills | complete |
| 006 | `006-integration-validation/` | Phase 6: integration-validation | complete |
| 007 | `007-family-deep-review/` | Phase 7: family-deep-review | complete |
| 008 | `008-nested-parent-conversion/` | Phase 8: nested-parent-conversion | planned (plan-only; not implemented) |
| 009 | `009-reference-asset-expansion/` | sk-design sub-skill reference and asset expansion | complete |
| 010 | `010-shared-register/` | sk-design shared Brand-vs-Product operating register | complete |
| 011 | `011-interface-audit-core/` | sk-design interface and audit core asset build | complete |
| 012 | `012-foundations-motion-audit/` | sk-design foundations, motion, and audit-depth expansion | complete |
| 013 | `013-mdgen-boundary-cleanup/` | sk-design md-generator authoring boundary and family cleanup | complete |
| 014 | `014-routing-benchmark/` | sk-design routing-efficiency benchmark across the five design modes | complete |
| 015 | `015-per-skill-improvement-research/` | sk-design per-skill improvement research across the five design modes | complete |
| 016 | `016-register-loader-contract/` | sk-design shared-register loader contract | planned (not started) |
| 017 | `017-real-bugs/` | sk-design two real bugs (md-generator manifest and audit router) | planned (not started) |
| 018 | `018-routing-wiring/` | sk-design routing and resource-loading wiring | planned (not started) |
| 019 | `019-handoff-card/` | sk-design unified sk-code handoff schema | planned (not started) |
| 020 | `020-benchmark-fixtures/` | sk-design checked-in routing-benchmark fixtures | complete |
| 021 | `021-content-topups/` | sk-design targeted per-mode content top-ups | complete |
| 022 | `022-mifb-design-research/` | make-interfaces-feel-better corpus to sk-design improvement research | complete |
| 023 | `023-mifb-design-adoption/` | adopt the make-interfaces-feel-better backlog into sk-design | complete |
| 024 | `024-designer-skills-research/` | designer-skills-main corpus to sk-design improvement research | complete |
| 025 | `025-audit-adoption/` | adopt the designer-skills-main audit findings into sk-design | complete |
| 026 | `026-interface-motion-adoption/` | adopt the designer-skills-main interface and motion findings into sk-design | complete |
| 027 | `027-foundations-adoption/` | adopt the designer-skills-main foundations findings into sk-design | complete |
| 028 | `028-impeccable-design-research/` | research the impeccable design skill for sk-design adoption | complete |
| 029 | `029-design-context-loading/` | preventing sk-design sub-skill context under-loading | complete (research phase) |
| 030 | `030-design-context-adoption/` | adopt the sk-design context-loading contract | complete |
| 031 | `031-foundations-impeccable-adoption/` | design-foundations impeccable adoption into sk-design | complete |
| 032 | `032-interface-impeccable-adoption/` | design-interface impeccable adoption into sk-design | complete |
| 033 | `033-audit-impeccable-adoption/` | design-audit impeccable adoption into sk-design | complete |
| 034 | `034-motion-mdgen-impeccable-adoption/` | design-motion and design-md-generator impeccable adoption into sk-design | complete |
| 035 | `035-design-context-benchmark/` | deep review and empirical benchmark of the context-loading contract | complete |
| 036 | `036-design-context-hardening/` | harden the context-loading contract | complete |
| 037 | `037-design-context-enforcement/` | deterministic enforcement for the context-loading contract | complete |
| 038 | `038-design-context-router/` | per-mode router auto-load of the context-loading contract | complete |
| 039 | `039-design-enforcement-build/` | design enforcement build | documented |
| 040 | `040-design-playbook-filename-denumbering/` | Phase 40: design-playbook-filename-denumbering | complete |
| 041 | `041-sk-design-overview-conformance/` | sk-design OVERVIEW Conformance | complete |
| 042 | `042-design-work-deep-review/` | design work deep review | complete |
| 043 | `043-design-review-remediation/` | design-review remediation (042 findings) | complete |
| 044 | `044-design-routing-and-integration-research/` | research sk-design routing/utilization guarantees, command specificity, and cross-surface enforcement | complete |
| 045 | `045-design-command-upgrade/` | design command upgrade | planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Research gate:** phases 002–006 begin only after a human reviews the 001 research output

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `001-corpus-research/` documented and validation-ready before `002-architecture-decision/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 002 | 003 | `002-architecture-decision/` documented and validation-ready before `003-scaffold-parent/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 003 | 004 | `003-scaffold-parent/` documented and validation-ready before `004-onboard-existing/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 004 | 005 | `004-onboard-existing/` documented and validation-ready before `005-build-subskills/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 005 | 006 | `005-build-subskills/` documented and validation-ready before `006-integration-validation/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 006 | 007 | `006-integration-validation/` documented and validation-ready before `007-family-deep-review/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 007 | 008 | `007-family-deep-review/` documented and validation-ready before `008-nested-parent-conversion/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 008 | 009 | `008-nested-parent-conversion/` documented and validation-ready before `009-reference-asset-expansion/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 009 | 010 | `009-reference-asset-expansion/` documented and validation-ready before `010-shared-register/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 010 | 011 | `010-shared-register/` documented and validation-ready before `011-interface-audit-core/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 011 | 012 | `011-interface-audit-core/` documented and validation-ready before `012-foundations-motion-audit/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 012 | 013 | `012-foundations-motion-audit/` documented and validation-ready before `013-mdgen-boundary-cleanup/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 013 | 014 | `013-mdgen-boundary-cleanup/` documented and validation-ready before `014-routing-benchmark/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 014 | 015 | `014-routing-benchmark/` documented and validation-ready before `015-per-skill-improvement-research/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 015 | 016 | `015-per-skill-improvement-research/` documented and validation-ready before `016-register-loader-contract/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 016 | 017 | `016-register-loader-contract/` documented and validation-ready before `017-real-bugs/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 017 | 018 | `017-real-bugs/` documented and validation-ready before `018-routing-wiring/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 018 | 019 | `018-routing-wiring/` documented and validation-ready before `019-handoff-card/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 019 | 020 | `019-handoff-card/` documented and validation-ready before `020-benchmark-fixtures/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 020 | 021 | `020-benchmark-fixtures/` documented and validation-ready before `021-content-topups/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 021 | 022 | `021-content-topups/` documented and validation-ready before `022-mifb-design-research/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 022 | 023 | `022-mifb-design-research/` documented and validation-ready before `023-mifb-design-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 023 | 024 | `023-mifb-design-adoption/` documented and validation-ready before `024-designer-skills-research/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 024 | 025 | `024-designer-skills-research/` documented and validation-ready before `025-audit-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 025 | 026 | `025-audit-adoption/` documented and validation-ready before `026-interface-motion-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 026 | 027 | `026-interface-motion-adoption/` documented and validation-ready before `027-foundations-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 027 | 028 | `027-foundations-adoption/` documented and validation-ready before `028-impeccable-design-research/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 028 | 029 | `028-impeccable-design-research/` documented and validation-ready before `029-design-context-loading/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 029 | 030 | `029-design-context-loading/` documented and validation-ready before `030-design-context-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 030 | 031 | `030-design-context-adoption/` documented and validation-ready before `031-foundations-impeccable-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 031 | 032 | `031-foundations-impeccable-adoption/` documented and validation-ready before `032-interface-impeccable-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 032 | 033 | `032-interface-impeccable-adoption/` documented and validation-ready before `033-audit-impeccable-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 033 | 034 | `033-audit-impeccable-adoption/` documented and validation-ready before `034-motion-mdgen-impeccable-adoption/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 034 | 035 | `034-motion-mdgen-impeccable-adoption/` documented and validation-ready before `035-design-context-benchmark/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 035 | 036 | `035-design-context-benchmark/` documented and validation-ready before `036-design-context-hardening/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 036 | 037 | `036-design-context-hardening/` documented and validation-ready before `037-design-context-enforcement/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 037 | 038 | `037-design-context-enforcement/` documented and validation-ready before `038-design-context-router/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 038 | 039 | `038-design-context-router/` documented and validation-ready before `039-design-enforcement-build/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 039 | 040 | `039-design-enforcement-build/` documented and validation-ready before `040-design-playbook-filename-denumbering/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 040 | 041 | `040-design-playbook-filename-denumbering/` documented and validation-ready before `041-sk-design-overview-conformance/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 041 | 042 | `041-sk-design-overview-conformance/` documented and validation-ready before `042-design-work-deep-review/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 042 | 043 | `042-design-work-deep-review/` documented and validation-ready before `043-design-review-remediation/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 043 | 044 | `043-design-review-remediation/` documented and validation-ready before `044-design-routing-and-integration-research/` work is claimed | predecessor child strict validation plus parent recursive validation |
| 044 | 045 | `044-design-routing-and-integration-research/` documented and validation-ready before `045-design-command-upgrade/` work is claimed | predecessor child strict validation plus parent recursive validation |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Final sub-skill taxonomy (4–7 children) — resolved by 001 research.
- Structural model (hub + nested packets vs. umbrella + sibling family) — 002 defaulted to umbrella + siblings, superseded at 008 by the nested-packet parent (Model A) that the family now ships.
- Whether `sk-design-md-generator` folds in as a packet or remains a sibling under the umbrella — decided at 002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Predecessor packet**: `../143-sk-design-interface/` (matured the interface skill)
- **Research corpus**: `external/` (41 design-skill docs + designer-skills-main + apple-bento-grid)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
