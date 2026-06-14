---
title: "Feature Specification: Open Design terminal control and interface integration"
description: "Make the installed Open Design desktop app drivable from the terminal via a new mcp-open-design skill, then de-vendor and integrate sk-interface-design with it. Phases 001-007 are complete: research, the skill build, the de-vendor, live verification plus deep review, variation-diversity and prompt patterns, and the generation-flow correction to v1.1.0. Phase 008 then deprecated and removed the now-superseded mcp-magicpath skill, re-centering the shared parity protocol on mcp-open-design."
trigger_phrases:
  - "open design terminal control"
  - "mcp-open-design skill"
  - "sk-interface-design open design integration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-open-design-terminal-and-interface-integration"
    last_updated_at: "2026-06-14T19:15:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed deep-review findings, ran advisor rescan, pushed all work to 027"
    next_safe_action: "Consolidate Opus deep-review, retry rate-limited 151 run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-150-open-design-terminal-and-interface-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Open Design terminal control and interface integration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Handoff Criteria** | Each child phase ships and validates independently; both skills stay advisor-routable and house-conformant |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The installed Open Design desktop app (nexu-io/open-design) holds rich, local-first design systems and a generation engine, but the framework can only reach them through the in-app chat UI. There is no terminal path. Separately, the `sk-interface-design` skill still vendors data and scripts derived from the MIT `ui-ux-pro-max` repo, which carries license obligations and AI-default patterns the skill exists to resist. Both gaps want closing together: a terminal control surface for Open Design, and a de-vendored design skill that reads from the user's own app instead.

### Purpose
Make Open Design drivable from the terminal through a new `mcp-open-design` skill, then de-vendor `sk-interface-design` and integrate it with that skill so design work draws on live, locally owned sources under a clean license.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the phase children listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `mcp-open-design` skill that controls the Open Design desktop app from the terminal, modeled on `mcp-magicpath`.
- The `sk-interface-design` skill: de-vendoring it from `ui-ux-pro-max` and integrating it with `mcp-open-design`.
- The ordered licensing cleanup for the de-vendor: data first, MIT notices second, with the Apache-2.0 base retained.
- Validation, feature catalog, manual testing playbook, and changelog for the shipped work.

### Out of Scope
- Changes to the Open Design app itself or its upstream repo (it is read-only third-party input).
- The standalone `mcp-magicpath` skill (its own packet, `147-mcp-magicpath`), used here only as a structural model.
- Re-deriving or caching Open Design content into the repo; the skill reads live and caches nothing.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-terminal-control-and-integration-research/` | Research Open Design's terminal/MCP/CLI surface and design both skills plus the de-vendor/integration/licensing path | Complete |
| 2 | `002-mcp-open-design-skill-build/` | Build the `mcp-open-design` skill (terminal control of Open Design), modeled on `mcp-magicpath`. Shipped into the skill at `.opencode/skills/mcp-open-design/` (v1.0.0.0) | Complete |
| 3 | `003-sk-interface-design-evolution/` | De-vendor `sk-interface-design` from ui-ux-pro-max, integrate with `mcp-open-design`, remove the MIT notices (ordered: data then notices, keep the Apache-2.0 base). Shipped into the skill at `.opencode/skills/sk-interface-design/` (v1.1.0.0) | Complete |
| 4 | `004-validation-and-docs/` | Live verification (a real design rendered, `od artifacts create` only adds a file, generation is a multi-turn discovery-form flow) plus a 10-seat deep review with all P0/P1 and the P2 backlog remediated | Complete |
| 5 | `005-sk-interface-design-variation-diversity/` | Seed-of-thought variation-diversity logic in sk-interface-design (v1.2.0) so multiple directions break the median default | Complete |
| 6 | `006-sk-prompt-design-tool-usecases/` | Design-generation prompt patterns in sk-prompt (v2.2.0) for the magicpath and open-design usecases | Complete |
| 7 | `007-mcp-open-design-generation-flow-correction/` | Correct `mcp-open-design` (v1.1.0) to the live-verified reality: multi-turn generation via `od run start` plus a discovery form, `od artifacts create` adds a file only, HTTP API and ephemeral-port rotation, and `od run` verbs | Complete |
| 8 | `008-mcp-magicpath-deprecation/` | Deprecate `mcp-magicpath` completely now that `mcp-open-design` covers the usecase: delete the skill, re-center the Claude Design parity protocol and the sk-prompt design-generation patterns onto `mcp-open-design`, sweep all live references, and mark spec 147 superseded | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Research synthesized; terminal surface, skill design, and de-vendor sequence documented | `research/research.md` present; `validate.sh --strict` green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- The exact installer-written MCP entry and whether the daemon survives app close are verified live during phase 002 and phase 004 rather than assumed here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: see sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **The mcp-magicpath skill**: `.opencode/skills/mcp-magicpath/` (structural model for the new skill).
- **The sk-interface-design skill**: `.opencode/skills/sk-interface-design/`.
- **Graph Metadata**: see `graph-metadata.json` for the `derived.last_active_child_id` pointer.
