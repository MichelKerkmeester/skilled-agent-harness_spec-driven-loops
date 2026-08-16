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
    recent_action: "All 12 tasks completed with evidence."
    next_safe_action: "Phase complete; 009 consumes the catalog."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-008-feature-catalog"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Read the two template assets. Evidence: read `sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` + `feature-catalog-snippet-template.md` in full. (`feature-catalog-template.md`, `feature-catalog-snippet-template.md`)
- [x] T002 Read the shipped sources. Evidence: read `vision-runtime/src/providers/photon.ts`, `vision-runtime/python/runtime.py`, `pi/sk-vision.ts`, `vision-runtime/src/opencode/tools.ts` + `attachments.ts`, `photon.test.ts`, `runtime.test.ts`. for anchor accuracy (photon.ts, types.ts, runtime.py, pi factory, plugin files, tests)
- [x] T003 Create the five category folders. Evidence: `mkdir -p` created scene-understanding/, pixel-analysis/, system-health/, host-adapters/, runtime-core/. (`scene-understanding/`, `pixel-analysis/`, `system-health/`, `host-adapters/`, `runtime-core/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author root `feature-catalog/feature-catalog.md`. Evidence: root authored from template: H1 intro, numbered ALL-CAPS H2 sections, 16 H3 entries with Description/Current Reality/Source Files, links to all leaves; validate_document.py exit 0. from the template (H3 per feature, links to leaves, current-state wording)
- [x] T005 Author the 5 `scene-understanding/` leaves. Evidence: inspect.md, ocr.md, detect.md, point.md, segment.md authored with real source/test anchors; all validate_document.py exit 0. (inspect, ocr, detect, point, segment)
- [x] T006 Author the 6 `pixel-analysis/` leaves. Evidence: colors.md, diff.md, metadata.md, crop.md, zoom.md, annotate.md authored; all validate_document.py exit 0. (colors, diff, metadata, crop, zoom, annotate)
- [x] T007 Author the 2 `system-health/` leaves. Evidence: status.md, reverse.md authored; validate_document.py exit 0 both. (status, reverse)
- [x] T008 Author the 2 `host-adapters/` leaves. Evidence: opencode-plugin.md, pi-extension.md authored; validate_document.py exit 0 both. (opencode-plugin, pi-extension)
- [x] T009 Author the 1 `runtime-core/` leaf. Evidence: json-rpc-runtime.md authored; validate_document.py exit 0. (json-rpc-runtime)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Prove all 17 docs exist. Evidence: `find .opencode/skills/sk-vision/feature-catalog -name '*.md' | wc -l` = 17; anchor sweep resolved 142 backticked paths, all table anchors real (`test -f` equivalent). (`find feature-catalog -name "*.md" | wc -l` = 17); every anchor path `test -f`
- [x] T011 Run `check_no_hyphenated_catalog_content.py`. Evidence: guard exit 0 ('PASS: catalog/playbook content is kebab-case.'); validate_document.py exit 0 on root + all 16 leaves (LEAVES_FAIL=0). + `validate_document.py` on root and all leaves — all exit 0
- [x] T012 Run `validate_catalog_package.cjs` exit 0. Evidence: package validator `--package sk-vision --report-only` PASS 0 violations, strict PASS tier=fail violations=0 (exit 0); validate.sh --strict: RESULT PASSED, Errors 0 Warnings 0 (wrapper exit 2 = repo-wide COMMAND_TREE_PARITY drift only). (report-only first); run `validate.sh --strict` on this child; all tasks `[x]` with evidence
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
