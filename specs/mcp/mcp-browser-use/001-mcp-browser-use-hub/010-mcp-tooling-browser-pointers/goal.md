---
title: "Goal: Phase 10: mcp-tooling-browser-pointers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mcp tooling browser pointers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/010-mcp-tooling-browser-pointers"
    last_updated_at: "2026-11-23T11:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pointed four mcp-tooling modes at the browser hub"
    next_safe_action: "Commit and push once the operator says so"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-23-mcp-tooling-browser-pointers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: mcp-tooling-browser-pointers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every browser pointer in the mcp-tooling modes land on the `mcp-browser-use` hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Generic browser work names the hub, not one mode, because each user may have a different browser mode installed. |
| D2 | A line about one specific browser names that mode's path inside the hub. |
| D3 | No tool, program, route or advisor signal changes; only the pointers do. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The stale-pointer grep in spec.md prints 0 on the working tree
- [x] `parent-skill-check.cjs .skilled/skills/mcp-tooling` prints `OK` with 0 warnings and exits 0
- [x] `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --recursive --strict` prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Stale pointers rewritten in 12 mode docs | Done | Stale-pointer grep: 22 at HEAD, 0 on the working tree |
| ClickUp names the hub | Done | `rg -c 'mcp-browser-use'` on `mcp-tools.md` prints 3 |
| Mode changelogs | Done | Hub check: `13d-packet-version: 6 mode packet(s) match their newest changelog entry` |
| mcp-tooling hub check | Done | `OK: parent-skill-check — all hard invariants passed, 0 warnings` |

### Deviations and findings

| Item | Note |
|------|------|
| Worktree provisioning | sk-git's provisioning counted `system-spec-kit` as present from a partial `node_modules`, so its builds failed. `npm ci` there and the runtime and CLI builds completed it, inside the worktree only |
<!-- /ANCHOR:log -->
