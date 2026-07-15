---
title: "Tasks: Phase 8: cutover-and-rollout"
description: "Task list for the terminal gates and parent rollup that make mcp-tooling a canon-clean parent hub."
trigger_phrases:
  - "cutover rollout tasks"
  - "parent-skill-check strict tasks"
  - "final sweep tasks"
  - "phase 008 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout"
    last_updated_at: "2026-07-10T07:36:17Z"
    last_updated_by: "claude"
    recent_action: "Checked off terminal-gate tasks; added T011 visibility check"
    next_safe_action: "Complete deferred rollout items then close out"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-tooling-parent/008-cutover-and-rollout/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-cutover-and-rollout"
      parent_session_id: null
    completion_pct: 91
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: cutover-and-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 007 complete: benchmark passed, deep-review findings resolved or deferred — 007 did NOT formally complete (Lane-C benchmark deferred, `mcp-tooling/benchmark/` holds only the `.gitkeep` baseline); this phase proceeded on the core gates regardless, per operator direction
- [x] T002 Identify the current canon check set for `parent-skill-check.cjs` — checks 1a-9b, confirmed via a direct STRICT run against `.opencode/skills/mcp-tooling`
- [x] T003 [P] Prepare the final repo-wide stale-reference grep terms for the three old skill-folder paths — `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma` flat-path terms prepared for the T006 sweep
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `parent-skill-check.cjs .opencode/skills/mcp-tooling` at STRICT; fix any named gap to 0 warnings — `PARENT_HUB_CHECK_STRICT=1 node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling` reports "OK: parent-skill-check — all hard invariants passed, 0 warnings"
- [x] T005 Run `validate.sh --recursive --strict` on the track; fix to 0 errors / 0 warnings — `validate.sh .../008-mcp-tooling-parent --recursive --strict` reports 9/9 folders `PASSED`, `Errors: 0  Warnings: 0` across the board
- [x] T006 Run the final stale-reference grep sweep; confirm zero live hits outside historical text — repo-wide `ripgrep` sweep for the three old flat skill-folder paths returns only historical spec/changelog/playbook-fixture text outside this packet
- [x] T007 Confirm the known-deferred ClickUp auth/config drift (phase 005 scope) is still deferred, not silently dropped — `mcp-tooling/mcp-click-up/SKILL.md` still documents OAuth 2.1 + PKCE via `mcp-remote`, unchanged
- [x] T011 Confirm the known-deferred advisor skill-graph DB rebuild and CLAUDE.md/AGENTS.md figma-transport prose restatement (phase 006 scope) are still deferred, not silently dropped — `mcp-tooling/benchmark/` and `graph-metadata.json` show no DB re-key artifact; `CLAUDE.md:65` and `AGENTS.md:65` still read "`mcp-figma` is the external sibling Figma transport", confirming both stay visibly open
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Roll up the parent `graph-metadata.json` (status, `last_active_child_id`, children back-references) — parent `derived.status` and `derived.last_active_child_id` set by direct edit after `backfill-graph-metadata.js`, `children_ids` reconciled against the 8 on-disk phase folders
- [x] T009 Re-run recursive validation after the rollup; confirm still 0/0 — `validate.sh .../008-mcp-tooling-parent --recursive --strict` confirmed 9/9 `PASSED`, `Errors: 0  Warnings: 0` after the rollup
- [x] T010 Confirm `mcp-tooling` is a canon-clean parent hub alongside the existing five — `parent-skill-check.cjs` STRICT 0 warnings is the same structural canon gate sk-code/sk-design/system-deep-loop/sk-doc/sk-prompt pass; rollout completeness (advisor DB rebuild, CLAUDE.md prose) is a separate, tracked axis per the sk-code/sk-doc/sk-prompt follow-on-tail precedent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — T001 stays open (phase 007 precondition not literally met, proceeded per operator direction)
- [x] No `[B]` blocked tasks remaining
- [x] STRICT parent-hub check 0 warnings; recursive validation 0/0; stale-reference sweep clean; parent rolled up; known-deferred ClickUp drift confirmed still-deferred
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
