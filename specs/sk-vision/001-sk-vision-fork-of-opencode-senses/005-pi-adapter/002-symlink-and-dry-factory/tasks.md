---
title: "Tasks: sk-vision Pi symlink and dry factory"
description: "Executable tasks for sk-vision Pi symlink and dry factory."
trigger_phrases:
  - "sk-vision pi symlink"
  - "sk-vision pi dry factory"
  - "sk-vision pi --offline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/005-pi-adapter/002-symlink-and-dry-factory"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".pi/extensions/sk-vision.ts"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-005-pi-adapter-002-symlink-and-dry-factory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision Pi symlink and dry factory

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

- [x] T001 Confirm owner factory exists — evidence: `test -f .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0; `export default function skVision` at line 46
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Create relative symlink (`.pi/extensions/sk-vision.ts`) — evidence: `readlink .pi/extensions/sk-vision.ts` = `../../.opencode/skills/sk-vision/pi/sk-vision.ts`; `test -L` exit 0
- [x] T003 Add README rows (`.pi/extensions/README.md`) — evidence: overview table, directory tree, and KEY FILES rows include `sk-vision.ts`
- [x] T004 Optional P1 input.images with 2s bound, or record the gap — evidence: gap recorded in `implementation-summary.md` §Known Limitations; no `pi.on("input")` in owner
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 readlink equals locked relative target — evidence: `test "$(readlink .pi/extensions/sk-vision.ts)" = "../../.opencode/skills/sk-vision/pi/sk-vision.ts"` exit 0
- [x] T006 pi --offline --approve — evidence: `pi --offline --approve` exit code 0; sk-vision extension loads (unrelated deep-pi lock timeout logged, session not fail-closed)
- [x] T007 Run validate.sh --strict on this child — evidence: post-closeout run exit 0 recorded in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — evidence: T001–T007 all `[x]` with inline evidence above
- [x] No `[B]` blocked tasks remaining — evidence: no `[B]` entries in tasks.md
- [x] Manual verification passed — evidence: `pi --offline --approve` exit 0; readlink proof exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
