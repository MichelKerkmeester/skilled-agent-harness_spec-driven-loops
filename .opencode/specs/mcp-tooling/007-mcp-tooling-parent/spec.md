---
title: "Feature Specification: Bring mcp-chrome-devtools mcp-click-up and mcp-figma under one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure"
description: "Phase parent for bringing mcp-chrome-devtools, mcp-click-up, and mcp-figma under one parent hub mcp-tooling with two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure."
trigger_phrases:
  - "007-mcp-tooling-parent"
  - "phase parent"
  - "mcp-tooling parent hub"
  - "mcp tool bridges hub"
  - "figma transport axis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent"
    last_updated_at: "2026-07-10T07:36:17Z"
    last_updated_by: "claude"
    recent_action: "Reconciled phase map; core work done, 2 items deferred"
    next_safe_action: "Complete deferred rollout items then close out"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-mcp-tooling-parent"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions:
      - "Three hub members: mcp-chrome-devtools, mcp-click-up, mcp-figma; mcp-code-mode excluded and flat"
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

# Feature Specification: Bring mcp-chrome-devtools mcp-click-up and mcp-figma under one parent hub mcp-tooling with three modes: two workflow bridges and one figma transport; mcp-code-mode stays flat standalone infrastructure

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partial |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | mcp-tooling/007-mcp-tooling-parent |
| **Predecessor** | None |
| **Successor** | None (a follow-on canon-hardening tail may follow, per the sk-code/sk-doc/sk-prompt precedent, but is not pre-scoped here) |
| **Handoff Criteria** | `parent-skill-check.cjs .opencode/skills/mcp-tooling` passes STRICT (0 warnings) and `validate.sh --recursive --strict` passes on this whole track |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mcp-chrome-devtools`, `mcp-click-up`, and `mcp-figma` are three flat, independently advisor-routable MCP tool-bridge skills, all `family: mcp`, that already share a router-and-gating pattern and reach external tools through the shared Code Mode substrate — but have no structural relationship: no shared registry, no single advisor identity, no hub. This split-but-coupled shape is exactly what this repo's "parent hub with nested mode packets" canon exists to fix, already applied to `sk-code`, `sk-design`, `system-deep-loop`, `sk-doc`, and `sk-prompt`.

### Purpose
Bring the three bridges under one hub, `mcp-tooling`, with three modes: two `packetKind: "workflow"` bridges (`mcp-chrome-devtools`, `mcp-click-up`, which both mutate the local workspace) and one `packetKind: "transport"` bridge (`mcp-figma`, which writes only to Figma Desktop) declared on a `transport-axis` extension. `mcp-code-mode` is deliberately excluded and stays a flat standalone skill because it is a live `opencode.json` native-MCP server serving manuals beyond this set. This phased decomposition tracks the fold-in across independently executable child phase folders, mirroring the mixed workflow-plus-transport shape `sk-design` already runs live.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for bringing the three bridges under one `mcp-tooling` hub.
- The high-level outcome: one advisor identity, two workflow modes plus one figma transport on a transport-axis extension, the `mcp-` prefix kept, and every live referrer repointed.
- Per-phase implementation detail in the child folders.

### Out of Scope
- Detailed per-phase implementation plans at the parent level (they live in child `plan.md`/`tasks.md`).
- Any change to `mcp-code-mode`, which is excluded and stays flat.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/mcp-tooling/{SKILL.md,mode-registry.json,hub-router.json}` | Create | 003 | New hub routing skeleton |
| `.opencode/skills/mcp-chrome-devtools/*` → hub packet | Move | 004 | Relocate the chrome-devtools workflow tree |
| `.opencode/skills/{mcp-click-up,mcp-figma}/*` → hub packets | Move | 005 | Relocate the click-up workflow tree and the figma transport tree |
| `.opencode/skills/mcp-tooling/graph-metadata.json` + referrers | Create/Modify | 006 | Union hub graph identity and referrer repoint sweep |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-and-context/ | Research gate (no writes): verify the three bridges' state and allowed-tools postures, classify workflow vs transport, and inventory every referrer | Planned |
| 2 | 002-architecture-decision/ | Decision gate: six ADRs freezing topology, figma transport plus cross-hub pairing, naming, identity dissolution, code-mode exclusion, and versioning | Planned |
| 3 | 003-scaffold-hub/ | Additive-only hub skeleton: mode-registry.json (with transport-axis), hub-router.json, thin SKILL.md, empty packet dirs — zero content moved | Complete |
| 4 | 004-onboard-chrome-devtools/ | git mv the chrome-devtools workflow tree under the hub; rewrite internal self-paths | Complete |
| 5 | 005-foldin-clickup-and-figma/ | git mv the click-up workflow tree and the figma transport tree under the hub; preserve figma's transport surface and sk-design pairing | Complete |
| 6 | 006-advisor-and-integration/ | Author the union hub graph identity, delete the three child graph files, repoint every functional referrer, retarget the advisor corpus | Complete — advisor DB rebuild and CLAUDE.md/AGENTS.md prose stay deferred |
| 7 | 007-routing-benchmark-and-review/ | Lane-C routing benchmark plus an independent deep-review; resolve the figma-transport routing question empirically | Deferred — Lane-C benchmark not run; review substituted via cross-check |
| 8 | 008-cutover-and-rollout/ | Terminal gates (parent-skill-check STRICT, recursive strict validation, final sweep) and parent rollup | Partial — core gate passed (STRICT 0, validate 0/0); rollout items from phase 6 remain |

| 9 | 009-incumbent-inventory-parity/ | [Phase 9 scope] | Pending |
| 10 | 010-routing-corpus-and-holdouts/ | [Phase 10 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-and-context | 002-architecture-decision | Verified skill-state snapshot, transport-eligibility evidence, and a fresh referrer inventory are ready | Human review (research gate stops here) |
| 002-architecture-decision | 003-scaffold-hub | Six ADRs accepted; frozen `mode-registry.json`/`hub-router.json` target recorded | Human approval required |
| 003-scaffold-hub | 004-onboard-chrome-devtools | Hub skeleton exists; zero content relocated | `parent-skill-check.cjs` with `PARENT_HUB_CHECK_STRICT=0` structural checks pass, empty-packet warnings acceptable |
| 004-onboard-chrome-devtools | 005-foldin-clickup-and-figma | chrome-devtools resolves under the hub with corrected self-paths | Grep for the old path returns zero live hits inside the moved tree |
| 005-foldin-clickup-and-figma | 006-advisor-and-integration | click-up and figma resolve under the hub; figma's transport surface preserved | figma `allowed-tools` byte-unchanged; self-path greps clean |
| 006-advisor-and-integration | 007-routing-benchmark-and-review | One hub graph identity; three child graph files deleted; functional referrers repointed | Grep for the old flat paths returns zero live hits outside historical text |
| 007-routing-benchmark-and-review | 008-cutover-and-rollout | Benchmark report generated; deep-review findings resolved or explicitly deferred | Benchmark report + review sign-off |
| 008-cutover-and-rollout | 009-incumbent-inventory-parity | [Criteria TBD] | [Verification TBD] |
| 009-incumbent-inventory-parity | 010-routing-corpus-and-holdouts | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Owned by phase 007: whether the figma transport needs any lexical routing carve-out, or hub-membership metadata routing suffices.
- All other structural questions are frozen by phase 002's six ADRs.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
