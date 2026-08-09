---
title: "Tasks: Dist Staleness Rebuild-on-Drift"
description: "Ordered tasks: unblock the sweep, add fail-open auto-rebuild, verify with a stale-then-fresh control."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist staleness rebuild tasks"
  - "check-dist-staleness tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/022-dist-staleness-rebuild-on-drift"
    last_updated_at: "2026-08-09T05:41:05Z"
    last_updated_by: "claude"
    recent_action: "Completed sweep-unblock and auto-rebuild tasks with a verified control"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:ca8311460932abdaf770cb8eaf3ba9f6a134aa7e5d5be4cc0e67258c0052311d"
      session_id: "2026-08-09-sk-code-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Dist Staleness Rebuild-on-Drift

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Reproduce the crash and identify the orphaned entry. Evidence: `dist-freshness.cjs check-all` threw `paths[1]... undefined` at `packageRoot`; the entry at the old line 143 had `distEntries` but no `id`/`root`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Delete the orphaned code-graph `DIST_PACKAGES` entry. Evidence: `node --check dist-freshness.cjs` passes; `dist-freshness.cjs check-all --json` returns 6 packages.
- [x] T-003 Add bounded, fail-open `try_rebuild` + `auto_rebuild_enabled`, auto-rebuilding only from `--all`; keep `check-file` warn-only. Evidence: `check-dist-staleness.sh:63-116` and the `check-file` call site passing no `auto_rebuild`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-004 Run the stale-then-fresh control. Evidence: `DIST REBUILT: @spec-kit/mcp-server` then a fresh re-check; `STALE DIST WARNING: @utcp/code-mode-mcp` with exit 0; `SPECKIT_DIST_AUTO_REBUILD=0` warns only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The `--all` sweep enumerates the valid packages without throwing.
- A stale package self-heals at session start; a failing build fails open with exit 0; the kill-switch reverts to warn-only.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
<!-- /ANCHOR:cross-refs -->
