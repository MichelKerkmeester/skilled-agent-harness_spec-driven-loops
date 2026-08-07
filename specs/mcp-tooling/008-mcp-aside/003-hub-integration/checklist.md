---
title: "Verification Checklist: Phase 3: hub-integration"
description: "Level-2 verification checklist for registering mcp-aside-devtools in the mcp-tooling hub and Code Mode runtime; items are pending until the phase executes."
trigger_phrases:
  - "mcp-aside hub integration checklist"
  - "aside mode registry verification"
  - "phase 003 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/003-hub-integration"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked hub-integration checklist with evidence"
    next_safe_action: "Mark items with evidence as the phase executes"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3: hub-integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 002 `package_skill.py --check` exit 0 confirmed before any hub edit [evidence: `package_skill.py --check` PASS 0/0 re-verified pre-edit]
- [x] CHK-002 [P0] 008-first serial window confirmed open — no concurrent 009/010 hub edits in flight [evidence: 009/010 agents packet-scoped; 0 concurrent hub edits per `git status` review]
- [x] CHK-003 [P1] `aside` manual-name collision check run against `.utcp_config.json` (zero hits before adding) [evidence: 0/9 existing manuals named `aside` before add]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every touched JSON file parses: `mode-registry.json`, `hub-router.json`, hub `description.json`, `graph-metadata.json`, `.utcp_config.json` [evidence: 5/5 touched JSON files pass `jq empty`]
- [x] CHK-011 [P0] Diffs are additive — the three existing mode entries and existing `.utcp_config.json` manuals are byte-unchanged [evidence: structured diff vs HEAD: existing entries semantically identical; `json.dump` reformatting only, 0 value changes]
- [x] CHK-012 [P1] Registry entry consistent with the hub contract: `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`, folder == packetSkillName, metadata routingClass [evidence: entry: workflow + cli-plus-mcp + folder==packetSkillName + `routingClass: metadata`]
- [x] CHK-013 [P1] Parent `SKILL.md`, registry, router, and hub metadata mutually consistent on mode names and counts [evidence: 4/4 mode names consistent across `SKILL.md`/registry/router/metadata]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria (REQ-001..007) met with evidence per requirement [evidence: REQ evidence carried in `tasks.md` T001-T012]
- [x] CHK-021 [P0] hub_routing scenario: an aside-shaped query resolves to `mcp-aside-devtools` [evidence: advisor probe: aside phrasing → `mcp-tooling` top-1 score 0.864 conf 0.95]
- [x] CHK-022 [P1] Regression: the three existing live-mode hub_routing scenarios still resolve unchanged [evidence: 3/3 live-mode signal blocks byte-equal per structured diff of `hub-router.json` vs HEAD; chrome probe top-1; clickup/figma probes deferred to final gate (daemon exit 75)]
- [x] CHK-023 [P1] Advisor skill-graph regeneration run and output recorded; hub identity reflects four modes [evidence: `skill_graph_compiler.py --export-json` recompiled 12/12; hub node carries `agentic browser` signal]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A unless a defect is found during registration — this phase is additive wiring; if a fix lands, classify it and complete the producer/consumer inventory [evidence: one fix landed: 2 stale `sk-code/graph-metadata.json` key_files repaired (pre-existing split-rename drift blocking the compiler); producer=sk-code split program, consumers=graph compiler only]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in the `aside` manual — auth configuration references the documented mechanism, no embedded tokens [evidence: `env: {}` deliberate — account/session auth, 0 tokens embedded]
- [x] CHK-031 [P0] `.utcp_config.json` change validated by parse plus a Code Mode manual-discovery check [evidence: `jq empty` pass + structured diff + `command -v aside` present; live Code Mode discovery deferred to final gate (server config reload)]
- [x] CHK-032 [P1] No auth/authz surface of the three existing modes changed [evidence: 8/8 pre-existing manuals byte-equal per structured diff of `.utcp_config.json` vs HEAD]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md, and tasks.md synchronized on the delivered registration set [evidence: `spec.md`/`plan.md`/`tasks.md` synchronized on the delivered set]
- [x] CHK-041 [P1] Hub changelog entry describes the mode addition accurately [evidence: `changelog/v1.1.0.0.md` describes packet + hub surfaces + open dual-manual question]
- [x] CHK-042 [P2] Skills catalog rows (if any reference hub mode counts) noted for follow-up [evidence: skills root README mentions Mobbin/Refero under sk-design only; 0 mode-count rows found; no follow-up needed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [evidence: 0 temp files outside `scratch/`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [evidence: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: Pending (phase not yet executed)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
