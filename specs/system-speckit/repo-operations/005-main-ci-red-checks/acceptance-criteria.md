---
title: "Acceptance Criteria: Repair the five checks that fail on main"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "main ci red checks acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/repo-operations/005-main-ci-red-checks"
    last_updated_at: "2026-11-11T07:47:57Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "None, the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "main-ci-red-checks-2026-11-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Repair the five checks that fail on main

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/repo-operations/005-main-ci-red-checks
**Level:** 2
**Status:** Complete
**Date:** 2026-11-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Node v22.23.4, When the mutation suite command of each corpus workflow runs, Then every test file runs and the command exits 0 | `.github/workflows/chart-corpus.yml:55` and `.github/workflows/diagram-corpus.yml:70`. `node --test 'scripts/tests/*.test.cjs'` printed `# pass 88` for chart and `# pass 21` for diagram, `# fail 0` for both | Met | - |
| AC-002 | REQ-002 | Given the refreshed baselines, When `run-script-tests.sh` runs, Then it prints `all sk-doc script tests passed` | `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:1`. The runner exited 0 with 57 `PASS` lines and no `FAIL` | Met | - |
| AC-003 | REQ-003 | Given the phrase in the harness intent, When the vocabulary guard and the other routing workflow steps run, Then the guard prints `drift=0` and every step exits 0 | `.skilled/skills/cli-external-orchestration/ROUTER.md:119`. The guard printed `checked=7 hub(s), drift=0` and `RESULT: PASSED`. The parity suites passed 22 tests and the scorer gates 53 | Met | - |
| AC-004 | REQ-004 | Given the three repairs, When the three test files run in the CLI vitest project, Then all pass | `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:106`. The run printed `Test Files 3 passed (3)` and `Tests 18 passed (18)` | Met | - |
| AC-005 | REQ-005 | Given the fixes on main, When the workflows run on that commit, Then all five conclude `success` | `.github/workflows/spec-kit-check.yml:1`. Chart Corpus run 42986319009 and Diagram Corpus run 42986318839 on `68359fb3b6`, Spec-Kit Check on `4207a2b4a5`, sk-doc Script Tests and Routing Registry Drift Guard on `5524f2ee48`, all `success` | Met | - |
| AC-006 | REQ-006 | Given the lock pause and the 25 ms poll, When the full CLI vitest project runs locally, Then no test times out | `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:890`. Three full runs in a row printed `Tests 2520 passed`. The longest traced lock wait fell from 26236 ms to 6363 ms | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is Met, and the five workflows pass on main.
<!-- /ANCHOR:closure -->
