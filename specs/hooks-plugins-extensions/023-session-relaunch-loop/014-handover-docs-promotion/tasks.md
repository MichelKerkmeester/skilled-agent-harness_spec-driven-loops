---
title: "Tasks: Phase 14: handover-docs-promotion"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "handover docs promotion tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: handover-docs-promotion

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

- [x] T001 Read the source docs: the session-relaunch README, the `bin/` README, the catalog entry and the playbook index rows (`.skilled/hooks/session-relaunch/README.md`)
- [x] T002 Grep every markdown surface for the feature and for wording that says the wrapper starts by hand or a handoff is manual by default
- [x] T003 Take the `validate_document.py` and `hvr_scan.py` baselines on the three markdown docs to be touched
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Summary bullet, Endless Sessions subsection and the Quick Start setup section (`README.md`)
- [x] T005 `/speckit:handoff` command entry and the corrected command counts, 40 and 37 (`README.md`)
- [x] T006 `session-relaunch` in the shared hook cores, the Hermes plugin note, the FAQ entry and the related-documents link (`README.md`)
- [x] T007 [P] Session relaunch row: automatic runtimes and the note versus `handover.md` (`.skilled/skills/system-spec-kit/README.md`)
- [x] T008 [P] Shim sentence and the note versus `handover.md` (`.skilled/commands/speckit/handoff.md`)
- [x] T009 [P] `handoff.md` tree line and group description (`.skilled/commands/README.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 `validate_document.py` on the three markdown docs (rc 0 each)
- [x] T011 `hvr_scan.py` against the baseline, and fix the new soft findings (root README back to 85/100)
- [x] T012 `audit_readmes.py` and remove the one broken reference it found in the system-spec-kit README
- [x] T013 `sync-runtime-mirrors.cjs --check` (rc 0)
- [x] T014 Strict recursive validation of the parent packet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (each fact read back against the session-relaunch README)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected-surfaces table)
- [x] CHK-003 [P1] Dependencies identified and available (phase 013 evidence, sk-doc validators)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (no code changed, and `validate_document.py` rc 0 on the three touched docs outside `specs/`)
- [x] CHK-011 [P0] No console errors or warnings (validators rc 0, mirror check PASS)
- [x] CHK-012 [P1] Error handling implemented (not applicable, documentation only)
- [x] CHK-013 [P1] Code follows project patterns (headings and bullets follow the root README's existing sections)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 6/6)
- [x] CHK-021 [P0] Manual testing complete (each fact read back against the session-relaunch README)
- [x] CHK-022 [P1] Edge cases tested (no shim, linked repository, stalled hop and no bound packet are each stated)
- [x] CHK-023 [P1] Error scenarios validated (the README audit found one unresolvable path, which was removed)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The missing command entry and the stale count are instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. `rg -n "39 command|36 across"` found only the two root README lines.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. The surface grep in `plan.md` lists every doc that names the feature.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not applicable, documentation only.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. One axis, the doc surface, with the rows in the affected-surfaces table.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable, no code read.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence cites file and line in the uncommitted worktree diff.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (not applicable, documentation only)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable, documentation only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (no code changed)
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (baselines went to the session scratchpad)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-20
<!-- /ANCHOR:summary -->

---
