---
title: "Feature Specification: sk-code Motion.dev Cross-Stack Category and Playbook Refinement — Phase Parent"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase-parent for elevating motion.dev to a first-class cross-stack reference/asset category under sk-code (peer to webflow/, not nested) AND refining the existing manual_testing_playbook to extend coverage with motion.dev scenarios, animation regression checks, and cross-browser/perf gates aligned to sk-doc playbook standards. Cross-references and skill metadata are synchronized in a third sub-phase."
trigger_phrases:
  - "069 sk-code motion-dev"
  - "sk-code motion.dev category"
  - "motion-dev cross-stack"
  - "sk-code playbook refinement"
  - "motion.dev assets and references"
  - "playbook motion.dev integration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Phase 004 remediation complete; strict validation passed"
    next_safe_action: "Parent packet ready for commit"
    blockers: []
    key_files:
      - "spec.md"
      - "001-playbook/implementation-summary.md"
      - "002-motion-dev/implementation-summary.md"
      - "003-cross-ref-metadata-sync/implementation-summary.md"
      - "004-deep-review-remediation/implementation-summary.md"
      - ".opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/sk-code/references/motion_dev/quick_start.md"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/changelog/changelog-069-motion-dev-and-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q: Does sk-code use a discoverable surface manifest? A: No standalone manifest; uses SKILL.md narrative + 4 router docs. Packet 3 updated all 5 in-place."
      - "Q: Should motion_dev cite Webflow-CDN install patterns as primary? A: Both CDN module (+esm) and CDN legacy (window.Motion global) documented as parallel; npm path documented for non-Webflow stacks. Resolved in motion_dev/integration_patterns.md and assets/motion_dev/install_card.md."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This document is the PARENT spec for the 3-phase sk-code motion.dev + playbook work.
  All planning, tasks, checklists, decisions, and continuity live inside the child phase folders 001/002/003.
  This file declares ROOT PURPOSE, the SUB-PHASE MANIFEST, and WHAT NEEDS DONE — nothing else.
-->

# Feature Specification: sk-code Motion.dev Cross-Stack Category and Playbook Refinement — Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../` (skilled-agent-orchestration top-level) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | 068-sk-doc-organization |
| **Successor** | 070-sk-deep-rename |
| **Handoff Criteria** | All 3 sub-phases validate strict-pass; motion_dev/ category populated; webflow cross-refs added; metadata files refreshed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Motion.dev is currently referenced informally inside `sk-code/references/webflow/` (10 docs mention it) as a Webflow-specific animation library, even though the actual library is stack-agnostic and could be used in any future build (non-Webflow stacks: opencode tooling, future React/Next.js sites, electron apps, etc.). The dedicated `references/motion_dev/` and `assets/motion_dev/` folders exist but are EMPTY. Meanwhile, the existing `sk-code/manual_testing_playbook/` covers sk-code's surface routing (4 categories, 10 scenarios) but lacks motion.dev-specific scenarios, animation regression checks, and cross-browser/performance gates that operators need when validating animation-heavy work — and its alignment with the canonical sk-doc playbook standards (per `sk-doc/references/specific/manual_testing_playbook_creation.md`) needs reaffirmation.

### Purpose
Decompose this work into three independent sub-phases:
- **001-playbook** refines the existing manual_testing_playbook by adding motion.dev-specific scenarios, animation regression coverage, performance/CWV gates, and cross-browser checks — and reasserts alignment with sk-doc's `manual_testing_playbook_template.md` and `manual_testing_playbook_creation.md` standards.
- **002-motion-dev** populates `references/motion_dev/` and `assets/motion_dev/` from scratch using the official motion.dev docs (https://motion.dev/docs/quick-start and linked subpages) AND in-repo usage patterns from `a_nobel_en_zn/2_javascript/` (ES module imports + `window.Motion` CDN bundle pattern). Every API claim cites a source.
- **003-cross-ref-metadata-sync** preserves all existing `webflow/*` motion.dev mentions in place and adds "See also: ../motion_dev/<doc>" pointers; updates the sk-code surface manifest/router to expose motion_dev as a discoverable peer category; refreshes SKILL.md, README.md, description.json, graph-metadata.json, and changelog.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders 001/002/003. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refining `.opencode/skills/sk-code/manual_testing_playbook/` (root playbook + numbered category folders) with new motion.dev scenarios + animation regression + perf gates + cross-browser checks; aligning structure/headings/section discipline to sk-doc standards.
- Populating `.opencode/skills/sk-code/references/motion_dev/` and `.opencode/skills/sk-code/assets/motion_dev/` as a peer category (NOT under `webflow/`) with cited content from official motion.dev docs and in-repo `a_nobel_en_zn/2_javascript/` usage.
- Adding non-destructive "See also" cross-references in `.opencode/skills/sk-code/references/webflow/` and `.opencode/skills/sk-code/assets/webflow/` files that mention motion.dev.
- Refreshing sk-code metadata: SKILL.md, README.md, description.json, graph-metadata.json, changelog.
- Updating sk-code's smart-router/surface manifest so motion_dev is a discoverable category alongside webflow (audit existing mechanism first; do not invent new mechanisms).

### Out of Scope (at the parent level)
- Modifying sk-code system-code references (`references/opencode/`, `assets/opencode/`) or any unrelated sk-code surface.
- Modifying the `sk-doc` skill itself — this work CONSUMES sk-doc playbook standards as a reference; it does not edit sk-doc.
- Implementation of motion.dev animations in any actual build (this is a documentation/asset population task, not a feature build).
- Cross-stack motion.dev usage proofs in any non-Webflow project (motion_dev/ is documented as cross-stack-ready; usage in a non-Webflow project is a future deliverable outside this packet).
- Backwards-relocation of webflow/* motion.dev content into `motion_dev/` — content STAYS in webflow/* with cross-ref pointers; relocation would lose Webflow-CDN-specific context that is legitimately Webflow-scoped.

### Files to Change
This parent spec lists no files directly. Per-phase blast radius:

| Phase | Folder | Authoritative file ledger |
|-------|--------|---------------------------|
| 001 | `001-playbook/` | `manual_testing_playbook.md` + new category folders (e.g. `05--motion-dev-and-animation-regression/`, `06--cross-browser-and-performance-gates/`) under `.opencode/skills/sk-code/manual_testing_playbook/` |
| 002 | `002-motion-dev/` | 6 new docs in `references/motion_dev/` (quick_start, animate_and_timelines, scroll_and_gestures, performance_and_pitfalls, decision_matrix, integration_patterns) + `assets/motion_dev/install_card.md`, `assets/motion_dev/snippets/*`, `assets/motion_dev/playbook_entries.md` |
| 003 | `003-cross-ref-metadata-sync/` | "See also" pointers added to ~10 `references/webflow/*` and 1 `assets/webflow/*` files; refreshed `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, and `changelog/` entries; router/manifest updates if applicable |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | [001-playbook/](./001-playbook/) | Manual testing playbook refinement + sk-doc alignment | Complete |
| 002 | [002-motion-dev/](./002-motion-dev/) | Motion.dev assets + references (canonical, cross-stack) | Complete |
| 003 | [003-cross-ref-metadata-sync/](./003-cross-ref-metadata-sync/) | Webflow "See also" cross-refs + sk-code metadata sync + router/manifest update | Complete |
| 004 | [004-deep-review-remediation/](./004-deep-review-remediation/) | Deep-review remediation for P0/P1/P2 findings and final PASS restoration | Complete |
| 005 | [005-playbook-cross-cli-execution/](./005-playbook-cross-cli-execution/) | Cross-CLI playbook execution audit and finding ledger | Complete |
| 006 | [006-routing-precision-fixes/](./006-routing-precision-fixes/) | Routing precision remediation for Phase 005 findings | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins.
- Per the verification rider: each phase's cli-codex implementation pass is followed by an Opus sub-agent review (@review or general-purpose, model=opus). Issues flagged by the reviewer are remediated via cli-codex before the phase is marked complete.
- Parent spec tracks aggregate progress via this map.
- Use `/spec_kit:resume specs/skilled-agent-orchestration/069-sk-code-motion-dev-and-playbook/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Refined playbook validates strict-pass; new motion.dev scenarios are placeholder-linked but do not require motion_dev/ refs to exist yet (cross-link in 003) | `validate.sh --strict 001-playbook/`; sk-doc DQI score on new docs |
| 002 | 003 | All motion_dev/ references and assets exist with cited content; in-repo usage patterns mined from a_nobel_en_zn/2_javascript/ are referenced | `validate.sh --strict 002-motion-dev/`; opus reviewer confirms citation completeness |
| 003 | (done) | Every motion.dev mention in webflow/* has a "See also" pointer; sk-code metadata files refreshed; router/manifest exposes motion_dev as a discoverable category; changelog entry committed | `validate.sh --strict 003-cross-ref-metadata-sync/`; before/after grep audit on webflow/*; opus reviewer confirms cross-file consistency |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

No open questions remain.

Answered in continuity:
- `motion_dev/` is exposed through existing SKILL.md, README, router docs, description metadata, and graph metadata; no standalone manifest exists.
- Motion CDN/global and npm/ESM import modes are documented as parallel integration modes, with Webflow-specific CDN details staying in `webflow/` guidance and cross-stack API details in `motion_dev/`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-playbook/`, `002-motion-dev/`, `003-cross-ref-metadata-sync/`, and `004-deep-review-remediation/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../` (skilled-agent-orchestration)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **sk-doc playbook standards**: `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md`
- **sk-doc playbook templates**: `.opencode/skills/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`, `manual_testing_playbook_snippet_template.md`
- **Existing sk-code playbook**: `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md`
- **Motion.dev official docs**: https://motion.dev/docs/quick-start
- **In-repo motion.dev usage**: `a_nobel_en_zn/2_javascript/` (slider/testimonial.js, navigation/nav_dropdown.js, etc.)
