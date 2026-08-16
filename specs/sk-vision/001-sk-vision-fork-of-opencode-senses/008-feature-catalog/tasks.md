---
title: "Tasks: sk-vision 008 feature catalog"
description: "Executable tasks for the feature catalog child."
trigger_phrases:
  - "sk-vision 008 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/008-feature-catalog"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 008 task list."
    next_safe_action: "Complete T001-T012 with evidence."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-008-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-vision 008 feature catalog

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

- [ ] T001 Read the two template assets (`feature-catalog-template.md`, `feature-catalog-snippet-template.md`)
- [ ] T002 Read the shipped sources for anchor accuracy (photon.ts, types.ts, runtime.py, pi factory, plugin files, tests)
- [ ] T003 Create the five category folders (`scene-understanding/`, `pixel-analysis/`, `system-health/`, `host-adapters/`, `runtime-core/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author root `feature-catalog/feature-catalog.md` from the template (H3 per feature, links to leaves, current-state wording)
- [ ] T005 Author the 5 `scene-understanding/` leaves (inspect, ocr, detect, point, segment)
- [ ] T006 Author the 6 `pixel-analysis/` leaves (colors, diff, metadata, crop, zoom, annotate)
- [ ] T007 Author the 2 `system-health/` leaves (status, reverse)
- [ ] T008 Author the 2 `host-adapters/` leaves (opencode-plugin, pi-extension)
- [ ] T009 Author the 1 `runtime-core/` leaf (json-rpc-runtime)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Prove all 17 docs exist (`find feature-catalog -name "*.md" | wc -l` = 17); every anchor path `test -f`
- [ ] T011 Run `check_no_hyphenated_catalog_content.py` + `validate_document.py` on root and all leaves — all exit 0
- [ ] T012 Run `validate_catalog_package.cjs` exit 0 (report-only first); run `validate.sh --strict` on this child; all tasks `[x]` with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
