---
title: "Tasks: Phase 15: verification-and-closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/015-verification-and-closeout"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-015-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: verification-and-closeout

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

- [x] T001 Confirm all prior phases complete — evidence: `scratch/closeout-facts.md`
- [x] T002 Confirm the pre-work baseline was captured before phase 003 began — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `rg --hidden --no-ignore` live-surface sweep with archival exclusions (50 residual hits, all string literals)
- [x] T004 Run spec-kit typecheck (0 errors)
- [x] T005 Run spec-kit test suite (418 tests green across changed files) — evidence: `scratch/closeout-facts.md`
- [x] T006 Run mcp-route-guard (16/16 assertions pass)
- [x] T007 Confirm no `mk-code-index` process and no `/tmp/mk-code-index` socket
- [x] T008 Confirm 0 tracked files under the old skill path (`git ls-files`)
- [x] T009 Confirm no `mk_code_index` in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.pi/mcp.json`
- [x] T010 Rebuild advisor and confirm the removed skill is unroutable
- [x] T011 Reconcile completion metadata across packet documents — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Confirm live-surface sweep uses `--hidden --no-ignore` (REQ-001)
- [x] T013 Confirm only intended references survive (REQ-002: tombstone + archival paths) — evidence: `scratch/closeout-facts.md`
- [x] T014 Confirm results reported as deltas (REQ-003: before/after numbers recorded) — evidence: `scratch/closeout-facts.md`
- [ ] T015 Full-suite run complete — still in flight at authoring time; 3 accounted-for failures (2 pre-existing unrelated, 1 timeout artifact that passes in isolation)
- [x] T016 Confirm completion metadata reconciled across packet documents (REQ-005) — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — T015 pending (full-suite run in flight)
- [ ] No `[B]` blocked tasks remaining — T015 is not blocked; the run is in progress
- [x] Manual verification passed (sweep + typecheck + 418 tests + route-guard + process/socket/tree/config)
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
