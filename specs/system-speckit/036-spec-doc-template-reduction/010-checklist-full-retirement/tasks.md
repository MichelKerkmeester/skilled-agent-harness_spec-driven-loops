---
title: "Tasks: Checklist Full Retirement"
description: "Retire the standalone verification checklist across producers, contract, read-paths, templates and packets, with a fingerprint generation marker so no repository needs a repair to pull it."
trigger_phrases:
  - "ac coverage evidence source"
  - "traceability precedence"
  - "canonical criteria read"
  - "checklist deprecation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/010-checklist-full-retirement"
    last_updated_at: "2026-08-30T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the canonical evidence read, the source precedence and the unit suite"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:7ad7e4375b0e4a9dd8237b158a1baec55e70e1601cd85a3dafc6ddc0e51b3fb8"
      session_id: "2026-08-30-036-010-checklist-full-retirement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One parser serves the count and the evidence read, so they cannot disagree"
---

# Tasks: Checklist Full Retirement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read what the tasks/checklist merge said it would do with the template - its files-to-change table records `Delete/retire` (`specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/spec.md`)
- [x] T002 Inventory every producer, read-path and artifact still naming the document - 2,270 tracked packet copies, the template, 3 worked examples, and references across rules, server modules and scripts
- [x] T003 Capture a validation baseline before any edit - fixed 12-packet sample recorded as 10 PASSED / 2 FAILED
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Stop the producer creating the document on a level upgrade - `scripts/spec/upgrade-level.sh:798`; a live run now reports `Created: acceptance-criteria.md` only
- [x] T005 Remove every contract entry - document, version, section gates and optional listings at three levels (`templates/spec-kit-docs.json`, 0 remaining references)
- [x] T006 Remove the read-paths across rules, server modules and scripts - 35 files; 0 remaining in `scripts/rules/`
- [x] T007 Delete the template, its 3 worked examples and the 2,270 tracked packet copies - confined to git-tracked in-repo paths, 0 staged under the symlinked repositories
- [x] T008 Record the document-set generation with each digest so retirement does not invalidate every stored fingerprint - `mcp-server/lib/graph/graph-metadata-parser.ts` `SOURCE_FINGERPRINT_DOCSET`, read at `mcp-server/lib/validation/generated-metadata-integrity.ts:168`
- [x] T009 Hold verification-shaped ids to the evidence standard, which the retirement would otherwise have exempted - `scripts/rules/check-evidence.sh:89`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirm an untouched packet needs no repair after the change - 12-packet sample identical to its pre-change baseline with no repair run
- [x] T011 Confirm real content drift is still reported - editing a current-generation packet's spec.md reports 1 mismatch; restoring returns 0
- [x] T012 Confirm the evidence rule reports an uncited verification item - three fixtures report warn / pass / warn as specified (`scripts/tests/check-ac-coverage.sh`)
- [x] T013 Confirm the fixture suite did not regress - HEAD 16 failed / 23 passed, now 13 failed / 22 passed
- [x] T014 Confirm the retirement invariants hold - 0 tracked copies, 0 live template references, 0 rule read-paths
- [x] T015 Close the deep-review findings, including the handlers directory the first sweep missed - `mcp-server/handlers/`, `mcp-server/tool-schemas.ts`, `mcp-server/scripts/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` - T001-T012
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed - 16/16 suite, live run across five packets
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent spec**: See `../spec.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001..REQ-007 (`spec.md`)
- [x] CHK-002 [P0] Technical approach defined in plan.md - producer-first ordering (`plan.md`)
- [x] CHK-003 [P1] Dependencies identified - none; merged tasks already carries verification
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` clean on all rules; `tsc --noEmit` 0 errors
- [x] CHK-011 [P0] No console errors or warnings - both dist trees rebuilt clean
- [x] CHK-012 [P1] Error handling implemented - absent verification section skips rather than fails
- [x] CHK-013 [P1] Code follows project patterns - status cell read mirrors `scripts/rules/check-ac-closure.sh:80`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - 8/8 in acceptance-criteria.md, AC_CLOSURE closeable
- [x] CHK-021 [P0] Manual testing complete - live upgrade produced acceptance-criteria only, no checklist
- [x] CHK-022 [P1] Edge cases tested - stray copy and unanchored tasks both resolve to no source (`scripts/tests/check-ac-coverage.sh:141`)
- [x] CHK-023 [P1] Error scenarios validated - three evidence fixtures report warn/pass/warn
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding classed by the review: test-isolation, class-of-bug, cross-consumer, algorithmic, matrix/evidence, instance-only
- [x] CHK-FIX-002 [P0] Producer inventory by grep across rules, server modules and scripts; the review found `mcp-server/handlers/` was missed and it was then swept
- [x] CHK-FIX-003 [P0] Consumer inventory across ~118 referencing files; every live read-path removed, data and taxonomy deliberately retained
- [x] CHK-FIX-004 [P0] Adversarial cases in `scripts/tests/check-ac-coverage.sh`: column-before-id, Incomplete substring, fenced example, stray copy, unanchored tasks
- [x] CHK-FIX-005 [P1] Axes listed: id shape (T/CHK) x source document x fingerprint generation; 16 suite rows cover them
- [ ] CHK-FIX-006 [P1] DEFERRED: no hostile env/global-state variant executed. The changed rules read files and env flags already covered by the suite; no process-wide state was introduced
- [x] CHK-FIX-007 [P1] Evidence pinned to the retirement commit rather than a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - no credentials touched
- [x] CHK-031 [P0] Input validation implemented - deletions confined to git-tracked in-repo paths
- [x] CHK-032 [P1] Auth/authz - not applicable; no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - reconciled after the review findings
- [x] CHK-041 [P1] Code comments adequate - each removal carries the durable reason
- [x] CHK-042 [P2] README updated - templates README and worked examples repointed at tasks.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - stray sweep reports 0
- [x] CHK-051 [P1] scratch/ cleaned before completion - contains only .gitkeep
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 0 | 0/0 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet
<!-- /ANCHOR:summary -->

---



