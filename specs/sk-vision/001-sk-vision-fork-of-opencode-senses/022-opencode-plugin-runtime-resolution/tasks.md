---
title: "Tasks: OpenCode plugin runtime resolution"
description: "Task ledger for repointing the OpenCode load-path symlink to dist/plugin.js and correcting the load-path docs."
trigger_phrases:
  - "sk-vision opencode plugin runtime resolution tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution"
    last_updated_at: "2026-08-18T18:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Repointed the OpenCode plugin symlink to dist/plugin.js; docs fixed."
    next_safe_action: "Restart OpenCode to confirm the spawn, then commit."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/022-opencode-plugin-runtime-resolution/tasks.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-022-opencode-plugin-runtime-resolution"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OpenCode plugin runtime resolution

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

- [x] T001 Repoint `.opencode/plugins/sk-vision.js` → `vision-runtime/dist/plugin.js` and rebuild `dist/`. Evidence: `readlink` shows the dist target; `bun run build` ran.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Correct the OpenCode load-path claim in `SKILL.md` (load target, acceptance row, source map, host-load-path note). Evidence: residual grep clean.
- [x] T003 Correct `README.md` (source table row, host-load-path line, OpenCode bullet). Evidence: residual grep clean.
- [x] T004 Correct `feature-catalog/host-adapters/opencode-plugin.md` ("re-exports/real file" → "symlink resolves to"; add the self-location reason). Evidence: catalog validator PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Replicate `repoRoot()` for both symlink targets. Evidence: hooks bundle → missing `runtimeScript` (spawn fails); `dist/plugin.js` → existing `runtimeScript` (spawns).
- [x] T006 Confirm no feature loss + other hosts untouched. Evidence: both sources register 13 tools + same `attachments.js`; Pi/Cursor/Devin paths unchanged.
- [ ] T007 Confirm a live OpenCode spawn after restart. Evidence: pending (not testable from a Claude session).
- [ ] T008 Commit on v4. Evidence: pending the operator's go-ahead.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Symlink repointed, docs corrected, resolution verified. Evidence: T001-T006 above.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [ ] Live-spawn (T007) and commit (T008) complete. Evidence: pending restart + operator go-ahead.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
