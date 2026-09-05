---
title: "Tasks: Decommission debt fixes and runtime alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Decommission debt fixes and runtime alignment

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

- [x] T001 Read the debt rows in packet 052's goal log and the review reports that raised them
- [x] T002 Open this packet under the system-speckit track
- [x] T003 [P] Inventory the code folders and README coverage of `runtime/` and `scripts/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Freshness: exclude the generator fixtures from the scripts sources; walker test (`1200c71f22`)
- [x] T005 Fan-out: retain bounded lineage stderr and write `logs/fanout-lineage.err`; runner test (`1200c71f22`)
- [x] T006 Review leaf: contract rule to resolve review paths against the dispatched artifact directory, all agent mirrors in sync (`c34ccfeb47`)
- [x] T007 Delete the rollback runbook with its README, alias and manifest entries; drop the unused MCP response type; rename the stale test (`1200c71f22`, `c34ccfeb47`)
- [x] T008 Move the trigger index to `runtime/data/`, remove the retired search-decisions file, rewrite every reference and the architecture topology (`1200c71f22`, `c34ccfeb47`)
- [x] T009 Align `runtime/` and `scripts/` with `sk-code-opencode` and write or refresh every code README: five Sonnet agents on disjoint folder sets (`9e759d06cf`, `588be3fc00`, `923f4e966d`, `e5b414cbae`); 87 code READMEs, 0 validator issues, no code folder without one
- [x] T009a Restore the eleven session-lifecycle hook registrations and mirror links the memory sweep dropped (`273767431d`); repair the two stale session-stop tests and the stdout scan exclusions (`6698bcc80b`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Typecheck shared, scripts and runtime exit 0; touched suites unchanged or improved per agent report; 87 READMEs validated
- [x] T011 Gates at `e0ae6d7063`: freshness stays green across two index runs without a re-stamp; sweep live 0; doctor routes 9; audits 14 of 14; routing guard fresh; validate strict PASSED on 052, 053 and this packet
- [x] T014 Act on the Grok lineage: remove the code that still targeted the retired store (extractor storage half, transaction manager, shared row types, folder-detector session-learning lookup, three-arm parity harness, importer-less better-sqlite3 and sqlite-vec, tests bound to deleted modules, absent-playbook allowlist) at `159c036502` and `9141353b0d`; validate.sh fails closed when its freshness helper cannot run (`171465b256`); Devin fallback text and a retired doctor path fixed (`4333c4d7b4`)
- [ ] T013 Two-executor review-angle deep research (gpt-5.6-luna max fast via Codex, grok-4.6 xhigh fast via Cursor, 20 iterations each) under `research/`; act on its findings
- [ ] T012 Close this packet and record the outcome in packet 052's goal log
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---



