---
title: "Feature Specification: mcp-figma with direct CLI support"
description: "Make Figma Desktop drivable from the terminal through a new mcp-figma skill built on the silships figma-cli (npm figma-ds-cli), with an optional Figma MCP via Code Mode. Phases 001-002 are complete: a 5-iteration deep research into the CLI and MCP landscape, then the skill build, install/safety scripting, graph registration, and live verification."
trigger_phrases:
  - "mcp-figma skill"
  - "figma terminal control"
  - "figma-ds-cli direct cli support"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/003-mcp-figma-with-direct-cli-support"
    last_updated_at: "2026-06-14T17:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Took over figma work: fixed token placeholder, dropped deleted-magicpath refs"
    next_safe_action: "Allow figma token placeholder on GitHub, then push 027"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-146-mcp-figma-with-direct-cli-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: mcp-figma with direct CLI support

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Handoff Criteria** | Each child phase ships and validates independently; the mcp-figma skill stays advisor-routable and house-conformant |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Figma Desktop holds a project's real design systems, tokens, variables, and components, but a coding agent could only reach them through the Figma UI or a remote-API workflow. There was no terminal control path that drives the live Figma Desktop session directly. The framework needed a house-conformant skill that wires a coding agent into Figma from the terminal, names the safe and the gated commands, and avoids the common npm naming trap (the npm package literally named `figma-cli` is an unrelated tool and must never be installed).

### Purpose
Make Figma Desktop drivable from the terminal through a new `mcp-figma` skill built on the silships **figma-cli** (published to npm as `figma-ds-cli`), with an **optional** Figma MCP (the community Framelink `figma` manual) reachable via this project's Code Mode. The CLI is the primary surface; the MCP is opt-in for pulling design context into the agent for codegen.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the phase children listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `mcp-figma` skill that drives Figma Desktop from the terminal via the silships figma-cli, modeled on the sibling terminal-control skills (`mcp-open-design`, `mcp-chrome-devtools`).
- The install and safety scripting that selects the full CLI surface (repo build) over the minimal npm build, plus the safe and yolo connect modes and their rollback.
- The optional Figma MCP path through Code Mode (the Framelink `figma` manual, exposing `get_figma_data` and `download_figma_images`).
- Graph registration (skill graph metadata and reciprocal sibling edges) and live install plus verification.

### Out of Scope
- The Figma Desktop app and the silships upstream repo themselves (read-only third-party input).
- The unrelated npm `figma-cli` package (unic/figma-cli); it is named only as a trap to avoid, never installed.
- Re-deriving or caching Figma content into the repo; the skill reads the live session and caches nothing beyond explicit user exports.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-figma-cli-and-mcp-research/` | A 5-iteration deep research into the silships figma-cli capabilities, the Figma MCP landscape, the skill architecture, the install and safety path, and the convergence | Complete |
| 2 | `002-skill-build-and-registration/` | Author the `mcp-figma` skill, the install and safety scripts, register graph metadata plus reciprocal sibling edges, and live-install plus verify (folds in the live install and verification work) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- The parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | CLI surface, MCP landscape, skill design, and install/safety path synthesized | `research/research.md` present; `validate.sh --strict` green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. The live install confirmed figma-ds-cli 1.2.0 from the repo build and the Code Mode `figma` manual; both children are complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: see sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **The mcp-figma skill**: `.opencode/skills/mcp-figma/` (the shipped deliverable).
- **Sibling terminal-control skills**: `.opencode/skills/mcp-open-design/`, `.opencode/skills/mcp-chrome-devtools/`.
- **Graph Metadata**: see `graph-metadata.json` for the `derived.last_active_child_id` pointer.
