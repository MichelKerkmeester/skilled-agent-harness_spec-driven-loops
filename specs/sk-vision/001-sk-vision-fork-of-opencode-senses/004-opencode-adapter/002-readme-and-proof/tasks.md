---
title: "Tasks: sk-vision OpenCode README and proof"
description: "Executable tasks for sk-vision OpenCode README and proof."
trigger_phrases:
  - "sk-vision plugins readme"
  - "sk-vision opencode.json proof"
  - "sk-vision plugin inventory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/004-opencode-adapter/002-readme-and-proof"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/plugins/README.md"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-004-opencode-adapter-002-readme-and-proof"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision OpenCode README and proof

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

- [x] T001 Confirm plugin file exists and is not a symlink — evidence: `test -f .opencode/plugins/sk-vision.js && test ! -L .opencode/plugins/sk-vision.js` exit 0 (FILE_OK)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add README CONTENTS row (`.opencode/plugins/README.md`) — evidence: `.opencode/plugins/README.md:39` lists sk-vision.js row
- [x] T003 Do not add a plugin array to opencode.json — evidence: `rg -n 'plugin' opencode.json` exit 1 (no matches)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 rg import path and rg plugin opencode.json — evidence: `.opencode/plugins/sk-vision.js:3` import match; `rg -n 'plugin' opencode.json` exit 1
- [x] T005 Record GPU attach SKIP unless 003 load passed — evidence: `implementation-summary.md:91` GPU attach smoke SKIP row
- [x] T006 Run validate.sh --strict on this child — evidence: validate.sh RESULT PASSED after metadata refresh
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
