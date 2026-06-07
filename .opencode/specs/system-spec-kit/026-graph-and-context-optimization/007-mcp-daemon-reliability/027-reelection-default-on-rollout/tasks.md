---
title: "Tasks: Re-election default-on rollout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "re-election default-on tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/027-reelection-default-on-rollout"
    last_updated_at: "2026-06-07T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Enabled re-election in all 3 configs; ENV/README/changelog updated"
    next_safe_action: "Validate, commit, push, write release notes"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-027-reelection-default-on-rollout"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Re-election default-on rollout

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Survey the three runtime configs for alignment and current flag state
- [x] T002 Confirm the idle-timeout bound on an unadopted released daemon
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Add SPECKIT_DAEMON_REELECTION=1 + note to .claude/mcp.json (via .mcp.json symlink)
- [x] T004 [P] Add the flag + note to opencode.json
- [x] T005 [P] Add the flag + note to .codex/config.toml
- [x] T006 Remove the redundant machine-local flag from .env.local
- [x] T007 Reconcile ENV_REFERENCE + root README; add the v3.5.0.5 changelog
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 All three configs parse; the flag is present in all three
- [ ] T009 Fill spec docs and run validate.sh --strict
- [ ] T010 Commit, push, and write release notes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
