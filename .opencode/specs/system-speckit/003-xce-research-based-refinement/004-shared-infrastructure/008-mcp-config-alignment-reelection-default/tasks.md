---
title: "Tasks: MCP Config 1:1 Alignment and Daemon Re-election Default-On"
description: "Tasks for the re-election default flip and the four-config sort/clean/align."
trigger_phrases:
  - "mcp config alignment tasks"
  - "reelection default on tasks"
  - "config 1:1 align tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default"
    last_updated_at: "2026-06-14T09:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete"
    next_safe_action: "None; complete"
---
# Tasks: MCP Config 1:1 Alignment and Daemon Re-election Default-On

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm `daemonReelectionEnabled` is the only flag read site (3 launchers + shared lib)
- [x] T002 Verify both stress tests set `SPECKIT_DAEMON_REELECTION` explicitly (no unset-default reliance)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Flip default-on in `mk-spec-memory-launcher.cjs`; rewrite the comment (no ids/paths/dates)
- [x] T004 Invert the unit test's default assertion (`launcher-daemon-reelection.vitest.ts`)
- [x] T005 [P] Sync 5 docs to code-default-on (ENV_REFERENCE, README, feature_catalog ×2, playbook)
- [x] T006 Rewrite `.claude/mcp.json` (canonical) + `opencode.json` + `.codex/config.toml`: fix JSON, strip notes, drop reelection entry, rename legacy env, align doc-triggers, alphabetise

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 vitest 5/5; `node -e` truth table; `node --check` launcher
- [x] T008 Parse-and-compare: 4 files parse + env 1:1 per server + zero banned keys
- [x] T009 Doc-sync grep clean; comment-hygiene clean; scoped commit `c67a972b88`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]`, no `[B]`
- [x] Default-on effective on next launcher respawn; configs 1:1 and valid
- [x] Spec-folder doc authored after the concurrent 027 restructure landed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->
