---
title: "Feature Specification: sk-interface-design"
description: "Establish and strengthen the sk-interface-design skill: install it into the framework (phase 001) and research how to improve it from external sources (phase 002)."
trigger_phrases:
  - "sk-interface-design"
  - "interface design skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design"
    last_updated_at: "2026-06-13T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phases 001-008 complete; skill docs realigned to the parity reality"
    next_safe_action: "Commit phase 008; exercise the previewImageUrl fidelity loop live"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-148-sk-interface-design"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-interface-design

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Handoff Criteria** | Each child phase ships and validates independently; the skill stays advisor-routable and house-conformant |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework needs a strong, advisor-routable skill for distinctive UI design so that design work does not default to templated, AI-generic output. Installing a capable base skill is the first step; making it genuinely better, with richer data, patterns, and automation, requires evaluating external sources before adopting anything.

### Purpose
Build `sk-interface-design` as a framework-native design skill and improve it through scoped, independently shippable phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the phase children listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `sk-interface-design` skill: its installation and its improvement phases.
- A vendored external repo under `external/` used as research input for improvements.

### Out of Scope
- Changes to other skills beyond the minimal integration edges this skill needs (for example the auto-use link from `mcp-magicpath`).
- The standalone `mcp-magicpath` skill (its own packet, `147-mcp-magicpath`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-install-claude-frontend-design/` | Install Anthropic's frontend-design as the house-conformant, advisor-routable `sk-interface-design` skill | Complete |
| 2 | `002-ui-ux-pro-max-merge-research/` | Deep research into how the vendored `ui-ux-pro-max` repo can merge into and improve `sk-interface-design` (recommendation only) | Complete |
| 3 | `003-ui-ux-pro-max-merge/` | Implement the merge in three internal phases: quality-floor data + licensing, search script, aesthetic critique-against inventory | Complete |
| 4 | `004-doc-alignment-catalog-playbook/` | Full sk-doc alignment: feature catalog, manual testing playbook, reference/asset/graph-metadata alignment | Complete |
| 5 | `005-claude-design-parity-research/` | Deep research into improving sk-interface-design + mcp-magicpath toward Claude Design parity (recommendation only) | Complete |
| 6 | `006-competitor-design-tools-research/` | Web-heavy deep research into adoptable ideas from competitor AI design tools (v0, Lovable, Figma Make, Subframe) (recommendation only) | Complete |
| 7 | `007-claude-design-parity-build/` | Implement the keystone: one shared claude_design_parity.md protocol + minimal hooks in both skills (reuse-before-generate, previewImageUrl fidelity check, revision grammar) | Complete |
| 8 | `008-doc-realignment/` | Realign feature catalog, playbook, READMEs to the post-007 reality (parity protocol, fidelity loop, helper) | Complete |
| 9 | `009-mobbin-refero-design-reference-integration/` | Wire the Mobbin and Refero design-reference MCPs into Code Mode and integrate them into the skill as a critique-against reference (name the real-world default, then deviate) | Review |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | next | Skill installed, advisor-routable, house-conformant; `package_skill.py` valid | `package_skill.py` + `validate.sh --strict` green |
| 008-doc-realignment | 009-mobbin-refero-design-reference-integration | MCPs wired into Code Mode; the skill integrates them as critique-against and passes `package_skill --check` | `package_skill --check` + endpoint probe + `validate.sh --strict` green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The set of improvements to adopt from external sources is determined per research phase before any merge into the skill.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: see sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **The skill itself**: `.opencode/skills/sk-interface-design/`.
- **Graph Metadata**: see `graph-metadata.json` for the `derived.last_active_child_id` pointer.
