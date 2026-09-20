---
title: "Feature Specification: mcp-aside-devtools nested mode: Aside browser automation bridge for the mcp-tooling hub"
description: "Phase parent for adding mcp-aside-devtools — an Aside AI-automation-browser bridge (Aside CLI primary, Aside MCP through Code Mode fallback) — as a new nested workflow mode of the mcp-tooling parent hub, across four child phases: research, skill authoring, hub integration, and validation/handoff."
trigger_phrases:
  - "008-mcp-aside"
  - "phase parent"
  - "mcp-aside-devtools"
  - "aside browser bridge"
  - "aside cli mcp mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase-parent spec and all four child phase packets"
    next_safe_action: "Execute phase 001-research (/deep:research fan-out) when the packet is approved"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-mcp-aside"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does Aside ship a real standalone CLI, or only the MCP server? (owned by phase 001)"
      - "What is Aside's auth model (login/session/API key) and is it viable for unattended automation? (owned by phase 001)"
    answered_questions: []
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

# Feature Specification: mcp-aside-devtools nested mode: Aside browser automation bridge for the mcp-tooling hub

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
| **Parent Packet** | mcp-tooling/008-mcp-aside |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All four phase gates exit 0: `package_skill.py --check --strict` on the new `mcp-aside-devtools` mode, `validate_skill_package.py` on the hub, and `validate.sh --strict --recursive` on this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-tooling` parent hub bridges Chrome DevTools debugging (`mcp-chrome-devtools`), ClickUp orchestration (`mcp-click-up`), and a Figma Desktop transport (`mcp-figma`) — but it has no AI-browser-automation bridge. Aside, an AI-automation browser, exposes a developer surface (CLI plus an MCP server, per https://docs.aside.com/help/developers#use-mcp) that this repo cannot reach today, and that surface is unverified: whether a real standalone CLI exists, what tools the MCP server exposes, and how auth works are all unconfirmed.

### Purpose
Add `mcp-aside-devtools` as a new nested mode of the `mcp-tooling` hub — `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`, driving the Aside browser via the Aside CLI as primary with the Aside MCP server through Code Mode as fallback, the 1:1 analog of the existing `mcp-chrome-devtools` mode — with a new `aside` manual in `.utcp_config.json`, full hub registry/router/advisor alignment, and every gate green.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for the `mcp-aside-devtools` nested mode: research, skill authoring, hub integration, and validation/handoff.
- The high-level outcome: a fourth `mcp-tooling` mode (third workflow bridge) with verified Aside CLI + MCP grounding, a `.utcp_config.json` `aside` manual, and aligned hub metadata.
- Per-phase implementation detail in the child folders.

### Out of Scope
- Detailed per-phase implementation plans at the parent level (they live in child `plan.md`/`tasks.md`).
- Any change to the three existing hub modes' own content beyond hub-level registration files.
- Sibling packets 009 and 010 (their hub-integration phases run SERIAL after this packet's phase 003).

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/**` | Create | 001 | Workflow-owned /deep:research state packet plus `research.md` synthesis |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/**` | Create | 002 | New nested mode tree per sk-doc create-skill-parent standards, exemplar `mcp-chrome-devtools` |
| `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md,description.json,graph-metadata.json}` | Modify | 003 | Register the new mode and align hub routing/identity |
| `.opencode/skills/mcp-tooling/{changelog/**,manual_testing_playbook/hub_routing/**}` | Modify | 003 | Hub changelog entry and hub_routing scenario for the new mode |
| `.utcp_config.json` | Modify | 003 | New name-keyed `aside` manual for Code Mode |
| Advisor skill-graph artifacts | Regenerate | 003 | Skill-graph regeneration after the hub identity change |
| This packet's checklists and implementation summaries | Create/Modify | 004 | Terminal gate evidence, completion reconciliation, memory save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | /deep:research fan-out (10 iterations across three executor lineages) verifying Aside's real CLI and MCP surface; synthesis lands as workflow-owned `research/research.md` | Complete |
| 2 | 002-skill-authoring/ | Author `.opencode/skills/mcp-tooling/mcp-aside-devtools/` per create-skill-parent standards and the `mcp-chrome-devtools` exemplar inventory, grounded in `research.md`; gate `package_skill.py --check` | Complete |
| 3 | 003-hub-integration/ | Register the mode in the hub (mode-registry, hub-router, parent SKILL.md, hub metadata, changelog, hub_routing scenario), add the `.utcp_config.json` `aside` manual, regenerate the advisor skill-graph; SERIAL across sibling packets 008, then 009, then 010 | Complete |
| 4 | 004-validation-and-handoff/ | Terminal gates (`package_skill.py --check --strict`, hub `validate_skill_package.py`, packet `validate.sh --strict --recursive`), checklist evidence, implementation summaries, memory save | Complete |

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
| 001-research | 002-skill-authoring | `research/research.md` synthesis converged under the stop policy, answering the CLI-vs-MCP question with cited findings; findings registry verified | Human review of the synthesis plus the workflow's convergence/state artifacts |
| 002-skill-authoring | 003-hub-integration | The `mcp-aside-devtools` packet passes `package_skill.py --check` with the full exemplar inventory present | `package_skill.py --check` exit 0 |
| 003-hub-integration | 004-validation-and-handoff | Hub valid: mode-registry/hub-router/parent SKILL.md/hub metadata aligned on the new mode; `.utcp_config.json` `aside` manual parses; advisor skill-graph regenerated | JSON parse + grep of registry/router entries; skill-graph regeneration output |
| 004-validation-and-handoff | (done) | All gates exit 0: `package_skill.py --check --strict`, hub `validate_skill_package.py`, packet `validate.sh --strict --recursive`; checklists carry evidence | Recorded command exits in phase 004 docs |
| 004-validation-and-handoff | 005-inventory-parity-and-doc-truth | [Criteria TBD] | [Verification TBD] |
| 005-inventory-parity-and-doc-truth | 006-live-verification-capture | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does Aside ship a real standalone CLI, or only the MCP server? (owned by phase 001; if no CLI exists, the `backendKind: "cli-plus-mcp"` posture needs an amendment decision before phase 002)
- What is Aside's auth model (login/session/API key) and is it viable for unattended automation? (owned by phase 001)
- Exact serialization mechanics with sibling packets 009/010 for the hub-integration window (owned by phase 003; the ordering constraint 008 first, then 009, then 010 is fixed, the coordination mechanics are not)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
