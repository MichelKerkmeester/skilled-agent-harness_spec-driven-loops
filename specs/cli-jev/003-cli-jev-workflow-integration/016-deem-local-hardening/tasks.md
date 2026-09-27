---
title: "Tasks: Phase 16: deem-local-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deem hardening tasks"
  - "deem access log tasks"
  - "deem cors decision tasks"
  - "deem-ctl backup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: deem-local-hardening

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

- [ ] T001 Read the tail of `update.log` and run `deem-ctl status`, record the model and source commits and confirm no scheduled update is running (`~/.local/share/deem/update.log`)
- [ ] T002 Reopen `deem_server.py:794-800`, `:809`, `:837` and `deem-ctl:109-125` at the live commits and correct any moved citation (`spec.md` section 10)
- [ ] T003 Ask Q1 to Q4 in one message and write each answer in place of `Operator answer: pending` (`spec.md` section 10, `goal.md` log)
- [ ] T004 [B] Copy `deem-ctl` to `deem-ctl.bak-<date>` with `cp -p`, only once T003 approves any change (`~/.local/share/deem/bin/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 [B] On a yes to Q2, add `DEEM_ACCESS_LOG=1` to `start_server`'s environment and change `>"$SERVER_LOG"` to `>>"$SERVER_LOG"`. Write to a temp file, then `mv` it into place (`~/.local/share/deem/bin/deem-ctl:118-120`)
- [ ] T006 [B] Q1 option A or B: first run one Node `fetch` against `nc -l 9999` and record whether it sends `Origin`, then write the launcher or the proxy and point `start_server` at it. Option C: record the acceptance and its revisit trigger (`spec.md` section 10)
- [ ] T007 [P] Q3: record the hold at 1 and confirm `grep -c DEEM_N_ORDERS deem-ctl` prints 0 (`spec.md` section 10)
- [ ] T008 [B] Q4: place the reviewed copy the operator chose, or record the choice to leave `deem-ctl` unversioned (`../007-classifier-deep-research/context/deem-ctl` under option B)
- [ ] T009 Add one pointer line after the Exposure paragraph (`../007-classifier-deep-research/context/deem-local.md:73`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run `shellcheck` on the edited `deem-ctl` and read its output and exit status (`~/.local/share/deem/bin/deem-ctl`)
- [ ] T011 Access log: send one `GET /health` and restart with `deem-ctl stop` then `deem-ctl start`. The first line is still in `server.log` (`~/.local/share/deem/server.log`)
- [ ] T012 [B] Q1 option A or B: `curl` with no `Origin` gets 200, and `POST` and `OPTIONS` with a foreign `Origin` get 403 with no `Access-Control-Allow-Origin` (`127.0.0.1:8300`)
- [ ] T013 Time 50 `choice` calls after the change and compare the p50 with 60 to 65 ms. Revert the log if it rose more than 5 ms (`deem-local.md:36`, `:85`)
- [ ] T014 Rehearse the rollback: restore the backup, restart, `deem-ctl status` prints backend `torch`, then put the new version back (`~/.local/share/deem/bin/`)
- [ ] T015 Run `validate.sh --strict` and `check-goal.cjs` on this folder and read both results (`016-deem-local-hardening/`)
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
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---



