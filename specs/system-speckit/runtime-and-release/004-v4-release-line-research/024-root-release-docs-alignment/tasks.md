---
title: "Tasks: Align the root release, contributing and security docs with the current repository"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "root release docs alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align the root release, contributing and security docs with the current repository

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`V` is `python3 .skilled/skills/sk-doc/scripts/validate_document.py`. `H` is `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Take the baselines (`PUBLIC-RELEASE.md`, `CONTRIBUTING.md`, `SECURITY.md`). Verify: `H PUBLIC-RELEASE.md` printed 9 hard blockers.
- [x] T002 Collect the current facts: tags, layout, commit rules, adoption steps. Verify: `git tag --sort=-v:refname | head -1` prints `v4.0.2.0`.
- [x] T003 [P] Fact-check `CONTRIBUTING.md` and `SECURITY.md` with two read-only agents. Verify: both reports returned, and each finding used was re-read at its source.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite `PUBLIC-RELEASE.md`. Verify: `V PUBLIC-RELEASE.md` prints `VALID`.
- [x] T005 Rewrite `CONTRIBUTING.md`. Verify: `rg -ci voyage CONTRIBUTING.md` prints nothing.
- [x] T006 Correct `SECURITY.md`. Verify: `rg -c 'thirteen of them' SECURITY.md` prints 1.
- [x] T007 Add this child to the parent `spec.md` and `graph-metadata.json`. Verify: `rg -c '024-root-release-docs-alignment' ../spec.md` prints 2.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the validator on all three files. Verify: `VALID` for `PUBLIC-RELEASE.md` and `SECURITY.md`.
- [x] T009 Rerun the voice scanner on all three files. Verify: hard blockers 1, 0 and 0.
- [x] T010 Run strict packet validation. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
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

---
