---
title: "Tasks: Decouple Cursor MCP config; drop sk-vision from Claude"
description: "Task ledger for the Cursor MCP config split and the sk-vision Claude de-registration."
trigger_phrases:
  - "sk-vision cursor mcp decoupling tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling"
    last_updated_at: "2026-08-18T15:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Decoupled Cursor MCP config; dropped sk-vision from .claude/mcp.json."
    next_safe_action: "Commit + push the config split once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/020-cursor-mcp-decoupling/tasks.md"
      - ".claude/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-020-cursor-mcp-decoupling"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Decouple Cursor MCP config; drop sk-vision from Claude

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

- [x] T001 Replace the `.cursor/mcp.json` symlink with a real four-server file. Evidence: `.cursor/mcp.json` parses with four servers incl. `sk-vision`.
- [x] T002 Remove the `sk-vision` entry from `.claude/mcp.json`. Evidence: parse shows three servers; repo-root `.mcp.json` mirrors it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Update the sk-vision topology docs. Evidence: `hooks/README.md`, `SKILL.md`, `README.md` describe the Cursor-owned config.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Per-endpoint JSON parse + presence check. Evidence: Claude/root no `sk-vision`; Cursor/Devin yes; in-process symlinks present.
- [ ] T005 Commit + push on v4 and main. Evidence: pending.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Config split + docs complete. Evidence: T001-T004 above.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [ ] Commit task T005 complete. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
