---
title: "Acceptance Criteria: Phase 23: deep-review-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/023-deep-review-remediation"
    last_updated_at: "2026-10-27T07:26:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-023-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 23: deep-review-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `023-deep-review-remediation`
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
| AC-001 | REQ-001 | Given a v2.3 doc with a ``` line inside a ~~~ fence and a token after it, When `validate.sh --strict` and the shell rule run, Then both report the token | `placeholder-token-gate.vitest.ts`: 8 failed of 64 before the fix, passing after; full suite 301 files passed | Met | - |
| AC-002 | REQ-002 | Given `--path` naming an existing symlink to a folder outside the repository, When `create.sh` runs, Then it exits non-zero and the outside folder stays empty | `create-path-containment.vitest.ts`: the escape case failed before the fix with `expected +0 not to be +0`, passes after, and no longer skips where the temp folder is `/tmp` | Met | - |
| AC-003 | REQ-001 | Given a CRLF v2.3 doc with a closed fence and a token after it, When both scanners run, Then both report the token | The CRLF rows print `2 failed` with the awk strip line removed and pass with it | Met | - |
| AC-004 | REQ-003 | Given a Draft repair run, When it snapshots the packet, Then it holds sha256 digests of the top-level `.md` and `.json` files only | `draft-auto-repair.vitest.ts` passes; every file `repair-derived.cjs` writes is a top-level `.md` or `.json` (reviewer read of its write sites) | Met | - |
| AC-005 | REQ-004 | Given the shell placeholder rule, When a reader opens it, Then the header names what runs it and no unreachable Draft-token branch remains in it or in the TS legacy path | `rg -n 'CLARIFICATION_MARKER_RE' runtime/lib/validation/orchestrator.ts` prints nothing; `test-validation-extended.sh` PLACEHOLDER_FILLED 8/8 | Met | - |
| AC-006 | REQ-005 | Given the docs, When a reader looks up the Draft repair and the warn-only rules, Then `validation-rules.md` says a recursive run repairs each Draft child and no `/speckit:*` doc says "now include" | `rg -n 'calls now include' .skilled/commands/speckit` prints nothing; `rg -n 'A recursive run' references/validation/validation-rules.md` prints one line | Met | - |
| AC-007 | REQ-006 | Given the packet records, When a reader resumes the packet, Then phase 010 REQ-001 matches the `--track` code, the parent goal and spec name 23 phases and the latest push, phase 021 names its commit, and every phase 020 audit finding has a disposition | `goal.cjs packet` prints `packet_budget=ok`; `findings.json` count prints `46 {"fixed":46}`; strict validation of the parent, 010 and 021 prints `RESULT: PASSED` | Met | - |

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

Every criterion is Met, and recursive strict validation of the packet decides the close.
<!-- /ANCHOR:closure -->
