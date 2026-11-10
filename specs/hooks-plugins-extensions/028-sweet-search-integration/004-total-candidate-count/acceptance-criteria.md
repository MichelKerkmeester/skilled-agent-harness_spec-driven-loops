---
title: "Acceptance Criteria: Phase 4: report total candidates in the trigger lookup"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "total candidate count acceptance"
  - "trigger lookup totalCandidates criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-total-candidate-count"
    last_updated_at: "2026-11-09T17:02:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-total-candidate-count"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 4: report total candidates in the trigger lookup

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count
**Level:** 2
**Status:** Draft
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fixture index, When `lookup(loaded, 'spec folder question', { limit: 2 })` runs, Then it returns 2 results, `truncated: true` and `totalCandidates: 6` | `npx vitest run trigger-index.vitest.ts` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given a default-limit run that does not truncate, When its human output is compared with the before run, Then the two are byte-identical and the `candidates :` line contains no ` of ` | Benchmark per-query rows, untruncated set | Unmet | - |
| AC-003 | REQ-002 | Given `retrieval-conventions.md`, When `rg -n 'specs/\*\*/research' retrieval-conventions.md` runs, Then section 9 lists the research-folder row and the parity suite passes | `npx vitest run retrieval-coverage-parity.vitest.ts` exits 0 | Unmet | - |
| AC-004 | REQ-003 | Given the phase is built, When `validate_catalog_package.py` and `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` run, Then both exit 0 and scenario 489 has a row in section 7.8 | Both commands' output and exit status, pasted in `implementation-summary.md` | Unmet | - |
| AC-005 | REQ-004 | Given the uncommitted phase change, When `/local-skilled-alignment --recheck=<run folder>` runs, Then `recheck.md` shows 0 open P0 and P1 findings | `alignment/recheck.md` in this folder | Unmet | - |
| AC-006 | REQ-005 | Given `benchmark/before.json` and `benchmark/after.json`, When both are compared, Then their index sha256 and git status counts match and every metric row in `benchmark/results.md` has a measured value that meets its target | `benchmark/results.md` | Unmet | - |

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

**Closeable:** No

Nothing is built yet, so every criterion is unmet; closure waits on the build, the alignment recheck and the after benchmark.
<!-- /ANCHOR:closure -->
