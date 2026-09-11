---
title: "Tasks: Completion gate and catalog alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completion gate tasks"
  - "acceptance closure tasks"
  - "catalog alignment tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Completion gate and catalog alignment

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

- [x] T001 Census the fifteen round-two rows in the main checkout, including the 27-stamp count and the catalog path scan (../005-overengineering-simplification/research/confirmed-findings.md)
- [x] T002 Read the checker's status ordering, the sentinel's status set, the freshness code union and the links scan's rule path (.opencode/skills/system-spec-kit/runtime)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Count acceptance rows, add `AC_UNMET`, the JSON block, the text line and the help text (.opencode/skills/system-spec-kit/runtime/cli/spec/check-completion.sh)
- [x] T004 Advise on `AC_UNMET` with the acceptance counts (.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs)
- [x] T005 Report a present non-hex stamp as `malformed_fingerprint` (.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts)
- [x] T006 Strip the flag-gated rule path, fix the default directory, and correct the rules README inventory claim (.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh)
- [x] T007 Correct the references, assets, hook documents and seven catalog entries; re-point two moved files and mark eight removed ones (.opencode/skills/system-spec-kit/feature-catalog)
- [x] T008 Add the unmet and closed acceptance cases and the malformed fingerprint case (.opencode/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rebuild the CLI, run the check gate and dist freshness, smoke the checker on a real and a temporary packet (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T010 Run the four lanes; validate the program recursively; run the sk-doc validator on touched documents; regenerate metadata (../spec.md)
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md §6; commit 737926c666]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: bash -n on two scripts, node --check on the sentinel, npm run rebuild and npm run check exit 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: dist-freshness.cjs check-all reports every output fresh]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: check-completion.sh returns 0 from count_acceptance_rows when the document is absent]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: one new status branch in calculate_status and one in detailForChecklistStatus]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, four rows Met]
- [x] CHK-021 [P0] The runtime and CLI projects, the legacy and validation lanes pass [EVIDENCE: implementation-summary.md Verification]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: absent acceptance document, a waiver naming no decision record, a hex stamp, the zero stamp]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: the standalone links scan run over the skill reported memory-name links, which is why it stays a tool]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: confirmed-findings.md §6 dispositions]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: plan.md affected surfaces]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: the sentinel is the checker's one JSON consumer]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: the waiver cell is matched against an ADR id only]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md affected surfaces]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the freshness rule's opt-in flag case still passes]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md names the commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff reviewed]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: acceptance rows are matched on the AC-id cell]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: validate.sh --strict RESULT: PASSED]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: the acceptance block and the malformed branch each carry their why]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: rules, spec and hooks READMEs]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: smoke fixtures under the system temp directory]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: no scratch directory in this packet]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
