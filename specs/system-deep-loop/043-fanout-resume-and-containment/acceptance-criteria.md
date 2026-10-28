---
title: "Acceptance Criteria: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fanout resume and containment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-fanout-resume-and-containment"
    last_updated_at: "2026-10-28T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Met the contested call-site criteria with observed evidence"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-session-01RCAMP9Fh9tTcF2m9K6DLzj"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 043-fanout-resume-and-containment
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a lineage whose effect ledger holds an earlier dispatch (confirmed, left unconfirmed, or run with a different prompt), When `dispatchExecutorEffect` runs again under the same session id, Then the executor is called and its result is returned | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-effect-dispatch.vitest.ts:55` and the fix at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:456`: `npx vitest run --no-coverage tests/unit/fanout-effect-dispatch.vitest.ts` printed `Tests  4 passed (4)` after printing `Tests  4 failed (4)` on the unfixed source | Met | - |
| AC-002 | REQ-002 | Given a path that was dirty at the baseline and changes again during the run, When `enforceWriteContainment` runs under the default remedy, Then it is in `contested` with a note, and `violations`, `advisories`, `event`, `quarantinePath` and `revertResult` hold nothing for it while the file keeps its bytes | `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:2681` and the rule at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1900`, block "a path that was already dirty and changed again is contested": 5 passed after 4 failed on the unfixed source | Met | - |
| AC-003 | REQ-002 | Given the same pass also contains a write to a path that was clean at the baseline, When the guard runs, Then that path is still a violation with a quarantine entry and the contested path has none | `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:2713` reads the quarantine manifest and finds only `deep/file.txt` | Met | - |
| AC-004 | REQ-003 | Given a stored session id and an earlier dispatch on disk, When `fanout-run.cjs` is run three times for the one lineage, Then all three exit 0, reach the stub executor and the ledger holds three `completed` events and no `failed` | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:5056` case "dispatches an interrupted lineage again": failed with `run 2: expected 3 to be +0` before the fix, passes after | Met | - |
| AC-005 | REQ-003 | Given a stub lane that waits while the test edits a file that was dirty before dispatch, When the lane then writes its own stray file, Then the ledger holds one `containment_contested` event for the operator file and one `containment_advisory` event for the stray file, and the operator file keeps the new bytes | `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3740` case "reports the operator edit as contested and still reports the lane's own stray write as an advisory": failed with `expected undefined` before the fix, passes after | Met | - |
| AC-006 | REQ-004 | Given `mode: 'restore'`, When a baseline-dirty path changes, Then it is still a violation and is restored from the baseline bytes | `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts:2781` passes | Met | - |
| AC-007 | REQ-004 | Given the final tree, When the runtime suite, contract-drift check, documentation-drift check, type check and strict validation run, Then each passes | `npm test`: `Test Files  170 passed (170)`, `Tests  2834 passed \| 8 skipped (2842)`, exit 0 (baseline `169` and `2823 passed \| 8 skipped (2831)`); `check-contract-drift.cjs` exit 0; `check-documentation-drift.cjs` exit 0; `npm run typecheck` exit 0; `validate.sh --strict` `RESULT: PASSED` | Met | - |
| AC-008 | REQ-004 | Given the unit-test and library READMEs, When the follow-up rows are added, Then `check_readme_references.py` and `check_derived_readme_counts.py` report no failure the README did not already have | Tests README: `unresolved=1` before and after (the existing `scripts/runtime-bootstrap.cjs` line), counts check PASS; library README: references PASS `unresolved=0`, counts PASS | Met | - |
| AC-009 | REQ-004 | Given both loop protocols state the contested rule, When the three deep command contracts are recompiled, Then the drift checks pass | `check-contract-drift.cjs`: `[CONTRACT DRIFT] OK commands=3`, exit 0; `check-documentation-drift.cjs`: `"errors": []`, exit 0 | Met | - |
| AC-010 | REQ-004 | Given the runtime and hub changelog entries and the bumped hub carriers, When the document and version checks run, Then each passes | `validate_document.py`: `Total issues: 0` on `v1.9.13.0.md` and `v1.6.13.0.md`; `hvr_scan.py` hard blockers 0 on each; `frontmatter-version.mjs verify`: `454 files \| ok=454`, exit 0; `parent-skill-check.cjs`: `all hard invariants passed, 0 warnings`, exit 0 | Met | - |
| AC-011 | REQ-002 | Given a single-lineage /deep:research or /deep:review dispatch whose pass has a contested path, When the step's containment code runs, Then it prints the contested paths and their note | `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment-yaml-call-sites.vitest.ts` passes over all ten call sites; the same matching rules flag 10 of 10 call sites in the HEAD YAML and 0 of 10 in the working tree | Met | - |
| AC-012 | REQ-002 | Given a caller that passes `stateLogPath`, When a pass has a contested path, Then the log gains one `containment_contested` event with its paths and note, apart from any `containment_violation` event | `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`, cases "records a contested path in the state log even when there is no violation" and "logs the contested path apart from the violation event": both pass | Met | - |
| AC-013 | REQ-004 | Given the call-site follow-up, When the runtime suite, drift checks, type check, mirror checks and strict validation run, Then each passes | `npx vitest run` in the runtime: `Test Files  171 passed (171)`, `Tests  2838 passed \| 8 skipped (2846)`, exit 0, four tests and one file more than the last clean count of `2834 passed \| 8 skipped (2842)`; `check-contract-drift.cjs` `[CONTRACT DRIFT] OK commands=3`; `check-documentation-drift.cjs` `"errors": []`; `npm run typecheck` exit 0; runtime-mirror, Codex and Pi prompt checks PASS; `sync-skills-hermes.cjs --check` PASS; `validate.sh --strict` `RESULT: PASSED` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with evidence observed in this packet's run, and none is waived.
<!-- /ANCHOR:closure -->
