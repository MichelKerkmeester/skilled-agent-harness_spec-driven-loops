---
title: "Feature Specification: mcp-refero nested mode: Refero design-reference MCP transport for the mcp-tooling hub"
description: "Phase parent for adding mcp-refero, a read-only Refero design-reference MCP transport mode, to the mcp-tooling parent hub: research the Refero MCP surface, author the transport packet, integrate it into hub routing, and validate end to end."
trigger_phrases:
  - "009-mcp-refero"
  - "mcp-refero"
  - "refero transport"
  - "refero design reference"
  - "mcp-tooling refero mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase-parent spec and all four child phase docs"
    next_safe_action: "Execute phase 001-research deep-research fan-out when approved"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-mcp-refero"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Refero auth model and rate limits over mcp-remote (owned by phase 001)"
      - "Free vs paid tool-surface differences on the Refero MCP (owned by phase 001)"
    answered_questions:
      - "A refero manual already exists in .utcp_config.json (npx -y mcp-remote https://api.refero.design/mcp); phase 003 verifies it rather than adding it"
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

# Feature Specification: mcp-refero nested mode: Refero design-reference MCP transport for the mcp-tooling hub

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
| **Parent Packet** | mcp-tooling/009-mcp-refero |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All four phases complete: research synthesis converged, `mcp-refero` packet passes `package_skill.py --check --strict`, hub registry/router/graph aligned, and `validate.sh --strict --recursive` on this packet exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-tooling` hub has no design-reference research transport: when UI work needs real-world design examples (screens, flows, patterns from shipping products), there is no routed skill surface for Refero, even though a `refero` manual already exists in `.utcp_config.json` (`npx -y mcp-remote https://api.refero.design/mcp`) and is reachable through Code Mode. The Refero MCP tool surface itself is unverified — tool names, parameters, auth expectations, rate limits, and free-vs-paid gating have never been researched or documented in this repo.

### Purpose
Add `mcp-refero` as a new nested mode of the `.opencode/skills/mcp-tooling/` parent hub: a `packetKind: "transport"` bridge (like the existing `mcp-figma` mode) that reaches the Refero MCP through Code Mode as a read-only UI-design-reference search surface. Transport rules apply throughout: `mutatesWorkspace:false`, forbids Write/Edit/Task, and mandatory cross-hub judgment pairing with `sk-design` (the transport never decides taste).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for the `mcp-refero` transport mode program.
- The high-level outcome: a verified Refero MCP tool-surface research base, an authored `mcp-refero` transport packet under the hub, hub registry/router/graph integration, and end-to-end validation gates.
- Per-phase implementation detail in the child folders.

### Out of Scope
- Detailed per-phase implementation plans at the parent level (they live in child `plan.md`/`tasks.md`).
- Any change to the existing hub modes (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`) beyond the shared hub files phase 003 touches.
- Adding a new UTCP manual — the `refero` manual already exists in `.utcp_config.json`; phase 003 verifies it rather than adding it.
- Any Refero write surface — the mode is read-only by contract.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/**` | Create | 001 | Workflow-owned deep-research state packet plus `research.md` synthesis |
| `.opencode/skills/mcp-tooling/mcp-refero/**` | Create | 002 | New transport packet tree (SKILL.md, README, install guide, references, playbooks, assets) |
| `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md,description.json,graph-metadata.json}` | Modify | 003 | Register the fourth mode on the transport axis and align hub routing and graph identity |
| `.opencode/skills/mcp-tooling/changelog/**` + hub_routing playbook scenario | Modify | 003 | Hub changelog entry and routing-recall scenario for the new mode |
| `.utcp_config.json` (`refero` manual) | Verify | 003 | Verify the existing name-keyed manual; no change expected |
| Advisor skill-graph artifacts | Regenerate | 003 | Skill-graph regeneration so the advisor sees the updated hub membership |
| `.opencode/specs/mcp-tooling/009-mcp-refero/**` (checklists, summaries) | Modify | 004 | Evidence-backed checklists, implementation summaries, and memory save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | /deep:research fan-out (10 iterations across three executor lanes) over the Refero MCP surface: tool inventory, auth/rate limits, free-vs-paid gating, official skill-repo conventions; synthesis in `research/research.md` | Complete |
| 2 | 002-skill-authoring/ | Author `.opencode/skills/mcp-tooling/mcp-refero/` per sk-doc create-skill-parent standards, mirroring the mcp-figma transport inventory minus CLI machinery, grounded in research.md; gate with `package_skill.py --check` | Complete |
| 3 | 003-hub-integration/ | Register mcp-refero in mode-registry.json (transport-axis + sk-design crossHubPairing), hub-router.json signals/vocab/tieBreak, parent SKILL.md, hub description/graph metadata, changelog, hub_routing scenario; verify the existing refero UTCP manual; regenerate the advisor skill graph. SERIAL across sibling packets: 008 first, then 009, then 010 | Complete |
| 4 | 004-validation-and-handoff/ | Terminal gates: `package_skill.py --check --strict`, `validate_skill_package.py` on the hub, `validate.sh --strict --recursive` on this packet, evidence-backed checklists, implementation summaries, memory save | Complete |

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
| 001-research | 002-skill-authoring | `research/research.md` synthesis converged with cited findings and a verified findings registry covering tool surface, auth, and limits | Deep-research state packet complete under `001-research/research/`; human review of the synthesis |
| 002-skill-authoring | 003-hub-integration | The `mcp-refero` packet passes `package_skill.py --check` with the full transport inventory present | `package_skill.py --check` exit 0 on `.opencode/skills/mcp-tooling/mcp-refero/` |
| 003-hub-integration | 004-validation-and-handoff | Hub valid: registry, router, parent SKILL.md, and graph metadata aligned on four modes; existing `refero` UTCP manual verified; advisor skill graph regenerated | Registry/router JSON parse clean and cross-agree; grep confirms mcp-refero in every hub routing surface |
| 004-validation-and-handoff | (done) | All gates exit 0: `package_skill.py --check --strict`, hub `validate_skill_package.py`, and packet `validate.sh --strict --recursive`; checklists marked with evidence | Recorded gate outputs in the phase 004 folder plus memory save |
| 004-validation-and-handoff | 005-inventory-parity-and-doc-truth | [Criteria TBD] | [Verification TBD] |
| 005-inventory-parity-and-doc-truth | 006-live-verification-capture | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- What auth does the Refero MCP expect through `mcp-remote` (anonymous, OAuth flow, API key), and what rate limits apply? (owned by phase 001)
- Does the free tier expose the same tool surface as paid Refero accounts, and how should the packet document degraded behavior? (owned by phase 001)
- Does the hub's tie-break ordering or vocabulary need a refero-specific class, or does hub-membership metadata routing suffice for the fourth mode? (owned by phase 003, informed by 001)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
