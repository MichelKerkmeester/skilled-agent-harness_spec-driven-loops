---
title: "Feature Specification: mcp-mobbin nested mode: Mobbin design-research MCP transport for the mcp-tooling hub"
description: "Phase parent for adding mcp-mobbin, a read-only Mobbin app/screen/flow design-research MCP transport mode, to the mcp-tooling parent hub: research the Mobbin MCP tool surface, author the transport packet, integrate it into hub routing plus .utcp_config.json, and validate."
trigger_phrases:
  - "010-mcp-mobbin"
  - "mcp-mobbin"
  - "mobbin transport"
  - "mobbin mcp server"
  - "mobbin design research"
  - "mcp-tooling mobbin mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored parent spec and all four child phase packets"
    next_safe_action: "Execute phase 001-research when the packet is approved"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-mcp-mobbin"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Mobbin API key / auth model: what credential does mobbin-mcp-server require and where does it live?"
      - "Are any Mobbin MCP tools gated behind a Pro plan, and how should the transport document degraded behavior?"
    answered_questions:
      - "mcp-mobbin is a packetKind 'transport' mode like mcp-figma: mutatesWorkspace:false, forbids Write/Edit/Task, mandatory cross-hub judgment pairing with sk-design"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: mcp-mobbin nested mode: Mobbin design-research MCP transport for the mcp-tooling hub

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | mcp-tooling/010-mcp-mobbin |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All four phase gates exit 0: research.md synthesis converged (001), `package_skill.py --check` passes on the new packet (002), hub registry/router/manual aligned (003), and the terminal validation suite plus memory save complete (004) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-tooling` hub has two workflow bridges (`mcp-chrome-devtools`, `mcp-click-up`) and one transport (`mcp-figma`), but no app-design-research transport: there is no routed way to query Mobbin's library of real-world app screens, flows, and UI patterns from this repository. Mobbin ships an official MCP server (github.com/mobbin/mobbin-mcp-server) and official skills (github.com/mobbin/skills), but its tool surface, auth model, and plan gating are unverified against this repo's Code Mode substrate and transport-packet contract.

### Purpose
Add `mcp-mobbin` as a second `packetKind: "transport"` mode under `.opencode/skills/mcp-tooling/`: a read-only Mobbin design-research surface reached through Code Mode (`mutatesWorkspace:false`, forbids Write/Edit/Task, mandatory cross-hub judgment pairing with `sk-design`), with a `mobbin` manual registered in `.utcp_config.json`, mirroring the shape `mcp-figma` already runs live.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for adding the `mcp-mobbin` transport mode to the `mcp-tooling` hub
- Deep-research verification of the Mobbin MCP server tool surface before any authoring (phase 001)
- Authoring the transport packet, hub integration, `.utcp_config.json` manual, and terminal validation in the child phases

### Out of Scope
- Any change to the existing `mcp-chrome-devtools`, `mcp-click-up`, or `mcp-figma` mode packets — the new mode is additive
- Design judgment content — taste and design decisions stay in `sk-design`; `mcp-mobbin` is pure transport
- A dedicated slash command for the mode — hub-membership metadata routing is the baseline, matching the existing three modes

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research/research/**` | Create | 001 | Workflow-owned deep-research state packet + `research.md` synthesis on the Mobbin MCP tool surface |
| `.opencode/skills/mcp-tooling/mcp-mobbin/**` | Create | 002 | New transport packet tree (SKILL.md, README.md, INSTALL_GUIDE.md, assets, references, playbooks, mcp-servers) |
| `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md}` | Modify | 003 | Register the mode, transport-axis entry, cross-hub pairing, and router signals/vocab |
| `.opencode/skills/mcp-tooling/{description.json,graph-metadata.json,changelog/**,manual_testing_playbook/**}` | Modify | 003 | Hub identity edge to sk-design, hub changelog, hub_routing scenario |
| `.utcp_config.json` | Modify | 003 | Add the `mobbin` manual for Code Mode |
| `.opencode/specs/mcp-tooling/010-mcp-mobbin/**` | Modify | 004 | Checklists with evidence, implementation summaries, memory save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | /deep:research fan-out (10 iterations across cli-codex sol/luna and cli-opencode glm executors) verifying the Mobbin MCP tool surface, auth model, plan gating, and transport eligibility; synthesis lands as `research/research.md` | Complete |
| 2 | 002-skill-authoring/ | Author `.opencode/skills/mcp-tooling/mcp-mobbin/` per sk-doc create-skill standards, mirroring the mcp-figma transport inventory minus its CLI machinery, grounded in research.md; gate `package_skill.py --check` | Complete |
| 3 | 003-hub-integration/ | Register the mode in mode-registry.json (transport-axis + crossHubPairing to sk-design), hub-router.json signals/vocab/tieBreak, parent SKILL.md, hub metadata/changelog/playbook, add the `mobbin` manual to `.utcp_config.json`, regenerate the advisor skill graph; SERIAL across sibling packets 008 then 009 then 010 | Complete |
| 4 | 004-validation-and-handoff/ | Terminal gates: `package_skill.py --check --strict`, `validate_skill_package.py` on the hub, `validate.sh --strict --recursive` on this packet, checklists with evidence, implementation summaries, memory save | Complete |

| 5 | 005-inventory-parity-and-doc-truth/ | [Phase 5 scope] | Pending |
| 6 | 006-live-verification-capture/ | [Phase 6 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research | 002-skill-authoring | `research/research.md` synthesis converged with cited findings covering the Mobbin tool surface, auth model, plan gating, and transport eligibility | Deep-research state packet complete in `001-research/research/` with a consistent findings registry; human review of the synthesis |
| 002-skill-authoring | 003-hub-integration | The `mcp-mobbin` packet passes `package_skill.py --check` and states the transport rules (no Write/Edit/Task, `mutatesWorkspace:false`, sk-design pairing) | `package_skill.py --check` exit 0 on `.opencode/skills/mcp-tooling/mcp-mobbin/` |
| 003-hub-integration | 004-validation-and-handoff | Hub valid with registry/router aligned: mode-registry.json, hub-router.json, parent SKILL.md, hub metadata, and the `.utcp_config.json` `mobbin` manual all reference the new mode consistently; sibling packets 008 and 009 have completed their serial hub edits first | JSON parse + cross-reference sweep of the hub files; advisor skill-graph regeneration succeeds |
| 004-validation-and-handoff | (close) | All gates exit 0: `package_skill.py --check --strict`, `validate_skill_package.py` on the hub, `validate.sh --strict --recursive` on this packet; checklists marked with evidence; memory saved | Recorded gate output in the phase 004 implementation summary |
| 004-validation-and-handoff | 005-inventory-parity-and-doc-truth | [Criteria TBD] | [Verification TBD] |
| 005-inventory-parity-and-doc-truth | 006-live-verification-capture | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Mobbin API key / auth model: what credential does `mobbin-mcp-server` require, where is it stored, and how is it referenced from the `.utcp_config.json` manual? (owned by phase 001)
- Pro-plan gating: are any Mobbin MCP tools restricted to paid plans, and how should the transport document degraded behavior for free-tier keys? (owned by phase 001)
- Does the mobbin transport need any lexical routing carve-out in hub-router.json beyond hub-membership metadata routing? (owned by phase 003, informed by the mcp-figma precedent)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
