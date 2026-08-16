---
title: "Tasks: sk-vision OpenCode plugin re-export"
description: "Executable tasks for sk-vision OpenCode plugin re-export."
trigger_phrases:
  - "sk-vision opencode plugin"
  - "sk-vision.js re-export"
  - "sk-vision plugin file"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/001-plugin-reexport"
    last_updated_at: "2026-08-16T08:20:00.000Z"
    last_updated_by: "cursor-code"
    recent_action: "Created .opencode/plugins/sk-vision.js thin re-export; copy-pack proofs passed."
    next_safe_action: "002-readme-and-proof"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/plugins/sk-vision.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-004-opencode-adapter-001-plugin-reexport"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision OpenCode plugin re-export

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

- [x] T001 test -f dist/plugin.js — evidence: `test -f .opencode/skills/sk-vision/vision-runtime/dist/plugin.js` exit 0
- [x] T002 Read analog `.opencode/plugins/mk-communication-projection.js` — evidence: read confirms real file importing skill dist/
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write `.opencode/plugins/sk-vision.js` as a regular file — evidence: file exists, 3 lines, preferred copy-pack bytes
- [x] T004 Keep GPU logic in the skill package — evidence: `.opencode/plugins/sk-vision.js` is re-export only; `rg -n 'gpu|mps|cuda' .opencode/plugins/sk-vision.js` exit 1 (no matches)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 test -f and test ! -L — evidence: `test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js` exit 0; `file` reports ASCII text
- [x] T006 rg the dist/plugin.js import — evidence: `rg -n "from '../skills/sk-vision/vision-runtime/dist/plugin.js'" .opencode/plugins/sk-vision.js` exit 0, line 3
- [x] T007 Run validate.sh --strict on this child — evidence: folder RESULT PASSED errors=0 warnings=0 before closeout; post-closeout refresh pending graph-metadata fingerprint
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
