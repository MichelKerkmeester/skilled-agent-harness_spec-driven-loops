---
title: "Tasks: Refero pilot batch"
description: "Run queue for the ~50-style pilot: capture, validate each folder's shape and JSON, index, confirm re-run no-op, record go/no-go."
trigger_phrases:
  - "refero pilot tasks"
  - "styles pilot tasks"
  - "go no-go tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/002-pilot-batch"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Ran the ~50-style pilot and validated the output shape"
    next_safe_action: "Record the go/no-go and await the operator decision"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Refero pilot batch

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

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the child-001 harness self-test passes before the run (REQ-001) (`styles/_harness/extract-refero.mjs`). [EVIDENCE: self-test PASS recorded in 001.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run `--limit` to capture ~50 styles total (REQ-001) (`_manifest.json`). [EVIDENCE: pilot run log; captured count in the manifest.]
- [x] T003 Build the `styles/README.md` index from the manifest (REQ-004) (`styles/README.md`). [EVIDENCE: index lists every captured style with its Refero URL.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Validate every captured folder: 6-file shape, `design-tokens.json` parses, Extended tabs non-empty (REQ-002) (`styles/<slug>/`). [EVIDENCE: shape sweep output.]
- [x] T005 Confirm a re-run captures nothing new (REQ-003) (`extract-refero.mjs`). [EVIDENCE: second run reports 0 new.]
- [x] T006 Record the go/no-go + storage decision in `implementation-summary.md` (REQ-005). [EVIDENCE: implementation summary go/no-go section.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] ~50 folders captured and shape-validated [EVIDENCE: manifest 50 captured/0 errors; 50/50 shape-clean]
- [x] Re-run no-op confirmed [EVIDENCE: a run processes only pending/stale/error rows]
- [x] Index written; go/no-go recorded [EVIDENCE: styles/README.md + implementation-summary GO]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Predecessor**: `../001-extraction-harness/`
<!-- /ANCHOR:cross-refs -->
