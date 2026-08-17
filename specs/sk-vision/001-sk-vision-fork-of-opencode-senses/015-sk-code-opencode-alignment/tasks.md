---
title: "Tasks: sk-vision adapter code alignment"
description: "Task ledger for documenting the three sk-vision adapters to the sk-code-opencode standard."
trigger_phrases:
  - "sk-vision code alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-opencode-alignment"
    last_updated_at: "2026-08-17T12:49:01.000Z"
    last_updated_by: "claude"
    recent_action: "Added component headers, JSDoc, and inline comments to the three sk-vision adapters."
    next_safe_action: "Author the phase spec docs and commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/015-sk-code-opencode-alignment/tasks.md"
      - ".opencode/skills/sk-vision/hooks/pi/sk-vision.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-015-sk-code-opencode-alignment"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision adapter code alignment

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

- [x] T001 Read the sk-code-opencode JS/TS standard and the house exemplar. Evidence: JSDoc §5 in `overview-modules-and-docs.md`; `mk-skill-advisor.js` banner style.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Document `hooks/pi/sk-vision.ts` (banner, 5 sections, JSDoc on 6 functions, inline comments). Evidence: 104 comment lines.
- [x] T003 Document `hooks/opencode/sk-vision.ts` (banner, sections, plugin JSDoc). Evidence: 30 comment lines.
- [x] T004 Document `vision-runtime/src/mcp/server.ts` (banner, sections, helper JSDoc, loop comment). Evidence: 42 comment lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm no behavior change. Evidence: `bun test` → 9 pass / 0 fail.
- [x] T006 Confirm types valid. Evidence: `bun run typecheck` exits 0.
- [x] T007 Confirm the build still emits. Evidence: `bun run build` emits plugin, mcp-server, and the opencode adapter.
- [x] T008 Confirm comment hygiene. Evidence: `grep` for ephemeral labels in the three files found none.
- [ ] T009 Commit the sk-vision-scoped changes on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T008.
- [ ] Commit task T009 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
