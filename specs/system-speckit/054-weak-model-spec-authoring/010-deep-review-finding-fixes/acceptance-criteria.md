---
title: "Acceptance Criteria: Phase 10: deep-review-finding-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review finding fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes"
    last_updated_at: "2026-10-25T20:40:00Z"
    last_updated_by: "conductor"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-010-deep-review-finding-fixes-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 10: deep-review-finding-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `054-weak-model-spec-authoring/010-deep-review-finding-fixes`
**Level:** 3
**Status:** Draft
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sandbox copy of the repository, When `create.sh --skip-branch --track ../../escaped --short-name probe "Probe"` runs, Then it exits non-zero and no folder exists outside `specs/`, while `--track demo` still creates `specs/demo/001-probe` | `create-track-containment.vitest.ts` passes; `scratch/evidence/lane-a/AC-001-sandbox.txt` shows `escaped-exit=1`, no folder outside `specs/`, `demo-exit=0` | Met | - |
| AC-002 | REQ-002 | Given a v2.3 doc at status In Progress whose line holds a backticked example token and then an unfilled token, When `validate.sh --strict` runs, Then `PLACEHOLDER_FILLED` fails, and the same line passes once the second token is filled | 42/42 matrix cells pass; `scratch/evidence/lane-a/AC-002-fixture.txt` shows `x PLACEHOLDER_FILLED: 1` and the filled copy `RESULT: PASSED` | Met | - |
| AC-003 | REQ-003 | Given a folder holding only `Owner: [YOUR_VALUE_HERE: owner name]`, When `spec/check-placeholders.sh <folder> --json` runs, Then it prints `"placeholders":1`, and on `specs/system-speckit/054-weak-model-spec-authoring` it prints `"placeholders":0` | `scratch/evidence/lane-a/T016-after.txt` (token folder `"placeholders":1`) and `scratch/evidence/conductor/AC-003-054-final.txt` (`"placeholders":0`) | Met | - |
| AC-004 | REQ-004 | Given a v2.3 copy of a passing Level 3 packet with its required `requirements` section removed, When `validate.sh --strict` runs, Then it fails on the required-section check, and a v2.2 doc with the same section removed keeps its earlier verdict | `scratch/evidence/lane-a/T018-sandbox-after.txt`: the v2.3 copy fails ANCHORS_VALID on `requirements`; the v2.2 copy keeps its earlier verdict (`T018-before.txt`) | Met | - |
| AC-005 | REQ-005 | Given the recursive baseline over `specs/` taken before the first edit, When recursive strict validation reruns on the final tree, Then the pass and fail counts are equal | `scratch/baseline/specs-counts-before.txt` and `scratch/baseline/specs-counts-after.txt`: both read 192 FAIL and 4,527 PASS, and every row of `b-after.tsv` equals `b-before.tsv` sorted by folder | Met | - |
| AC-006 | REQ-006 | Given the speckit assets and entry points, When `rg -l spec-authoring-card .skilled/commands/speckit/` runs, Then it lists `speckit-plan.yaml` and `speckit-implement.yaml` beside `speckit-complete.yaml`, and the runtime mirror parity check passes | `rg -l spec-authoring-card .skilled/commands/speckit/` lists `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`; mirror sync OK (lane B) | Met | - |
| AC-007 | REQ-007 | Given the four example `tasks.md` files, When the card's task check runs on each, Then every task line, open or done, ends with a `Verify:` clause, so the two counts it prints are equal | Task lines and `Verify:` lines: Level 1 16/16, Level 2 27/27, Level 3 48/48, Level 3+ 50/50 | Met | - |
| AC-008 | REQ-008 | Given the system-spec-kit docs, When `rg -n '\[PLACEHOLDER\]' .skilled/skills/system-spec-kit --glob '*.md'` runs, Then no doc teaches it as the marker to replace, and `template-mapping.md` shows the v2.3 token form | `rg` finds `[PLACEHOLDER]` only in test fixtures and one catalog line that lists what `calculate-completeness.sh` scans; `template-mapping.md:232` shows the v2.3 token | Met | - |
| AC-009 | REQ-009 | Given scenario 483, When its Pass rule is read, Then a `git status --porcelain` containment check runs before the cleanup step and fails the scenario on any path outside the scratch packet | `level-1-packet-authored-from-card.md:86` and `:109` capture `git status --porcelain` before and after, ahead of cleanup | Met | - |
| AC-010 | REQ-010 | Given the 57 P2 entries in the registry and the six P1 entries adjudication moved to P2, When `scratch/p2-ledger.md`: 63 rows, 59 Fixed with evidence and 4 Not reproduced, 0 Pending is read, Then every entry reads Fixed with evidence or Not reproduced with the check that showed it | `scratch/p2-ledger.md`: 63 rows, 59 Fixed with evidence and 4 Not reproduced, 0 Pending | Met | - |
| AC-011 | REQ-011 | Given the three tooling gaps, When their tests run, Then a fan-out root skips the root resource-map reducer, a first sentence over 150 characters is cut at a clause boundary and the trigger index generator's git calls carry `core.fsmonitor=false` | `fanout-root-resource-map.vitest.ts` 4/4, `generated-metadata-drift.vitest.ts` and `trigger-index.vitest.ts` 82/82. The clause cut runs for v2.3 specs only, since an unconditional cut moved 39 drift verdicts (`scratch/evidence/lane-a/T025-before.txt`, `T025-after.txt`) | Met | - |
| AC-012 | REQ-012 | Given the phase diff, When cli-devin and then cli-codex luna review it read-only, Then neither reply reports a P0 or a P1 | `scratch/review/cli-devin.md` (P1 refuted: `cli-devin-p1-verdict.md`; P2s in `cli-devin-p2-outcomes.md`) and `scratch/review/cli-codex-luna.md` (P1 and P2 fixed, P0 refuted by the reviewer's own recheck, `cli-codex-luna-recheck.md`: `NEW: none`). No P0 or P1 stands after verification | Met | - |

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

All 12 rows are Met with observed evidence as of 2026-10-25. The strict census and the six-rule census match their baselines row for row, both suites match theirs, and no P0 or P1 from the two closing reviews stands after verification.
<!-- /ANCHOR:closure -->
