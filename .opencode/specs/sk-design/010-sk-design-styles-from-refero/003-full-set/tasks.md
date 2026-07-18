---
title: "Tasks: Refero full-set extraction"
description: "Run queue for the full-set extraction: capture all pending styles, shape-sweep every folder, rebuild the index."
trigger_phrases:
  - "refero full set tasks"
  - "all styles tasks"
  - "complete library tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/010-sk-design-styles-from-refero/003-full-set"
    last_updated_at: "2026-07-18T10:25:46Z"
    last_updated_by: "claude"
    recent_action: "Extracted all 1,290 styles with 0 errors and re-indexed"
    next_safe_action: "Commit the library and sync to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-refero-010-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Refero full-set extraction

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

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm pilot GO before the full run (`../002-pilot-batch/implementation-summary.md`). [EVIDENCE: `implementation-summary.md` records GO.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run the harness with no `--limit` over all pending rows (`_manifest.json`). [EVIDENCE: run log `1240/1240 captured, 0 errors`.]
- [x] T003 Reconcile the cursor slug row and add its uuid to the canonical (`styles/cursor/cursor-canonical.json`). [EVIDENCE: `cursor` row slug fixed; `uuid` added to `cursor-canonical.json`.]
- [x] T004 Rebuild the full index (`styles/README.md`). [EVIDENCE: `styles/README.md` lists 1,290 entries.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Manifest tally = 1,290 captured, 0 errors (`_manifest.json`). [EVIDENCE: `Counter` over `_manifest.json` = {captured: 1290}.]
- [x] T006 Shape sweep all folders (`styles/<slug>/`). [EVIDENCE: sweep `clean 1290 / 1290, issues 0`.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 1,290 captured, 0 errors
- [x] Shape sweep 1,290/1,290 clean
- [x] Full index rebuilt
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Predecessor**: `../002-pilot-batch/`
<!-- /ANCHOR:cross-refs -->
