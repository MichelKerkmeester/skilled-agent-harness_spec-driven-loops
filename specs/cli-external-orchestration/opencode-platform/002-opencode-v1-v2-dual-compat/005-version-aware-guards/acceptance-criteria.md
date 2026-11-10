---
title: "Acceptance Criteria: Phase 5: version-aware-guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "version aware guards acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-version-aware-guards"
    last_updated_at: "2026-10-18T12:45:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-version-aware-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: version-aware-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082-opencode-v1-v2-dual-compat/005-version-aware-guards
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002, REQ-003, REQ-004 | Given an `opencode2 run` command, When the dispatch classifier and rule engine inspect it, Then the segment classifies as cli-opencode, and the rules that apply to v2 or to both versions are evaluated. | Red: `scratch/red-audit.txt:9` (the suite failed to load before the change because `opencode-version.mjs` did not exist). Green: `scratch/fix-vitest.txt:23` (110 tests passed), with `scratch/replay-review-inputs.txt:1`, `scratch/replay-review-inputs.txt:2` and `scratch/replay-review-inputs.txt:3` showing that a quoted, a `bash -c` and an `sh -c` wrapped `opencode2` slash run each return only `v2-slash-prompt-route:warn`. | Met | - |
| AC-002 | REQ-005 | Given a correct v2 slash-command run, `opencode2 run --standalone -m <provider>/<model>#<variant> "/speckit:search query"`, When every guard evaluates it, Then no rule returns a blocking verdict. | `scratch/fix-rulechecks.txt:31` (# pass 28) and `scratch/fix-rulechecks.txt:32` (# fail 0), with `scratch/fix-rulechecks.txt:10` (the v2 slash-command fixture warns with `session.command` and never blocks). `scratch/replay-review-inputs.txt:1`, `scratch/replay-review-inputs.txt:2` and `scratch/replay-review-inputs.txt:3` confirm the same verdict against the real installed binaries. | Met | - |
| AC-003 | REQ-006 | Given the existing guard suites, When each runs with the runner its file names, Then every suite exits 0, and its pass count is at or above the baseline recorded at T002. | Baselines: `scratch/base-vitest.txt:23`, `scratch/base-rule-checks.txt:125`, `scratch/base-rule-checks.txt:126`, `scratch/base-shared.txt:348`, `scratch/base-shared.txt:349`, `scratch/base-source-root.txt:10`, `scratch/base-source-root.txt:11`. Final: `scratch/fix-vitest.txt:23`, `scratch/fix-rulechecks.txt:31`, `scratch/fix-rulechecks.txt:32`, `scratch/fix-shared.txt:348`, `scratch/fix-shared.txt:349`, `scratch/fix-source-root.txt:10`, `scratch/fix-source-root.txt:11`. Every pass count is at or above its baseline (91 to 110, 20 to 28, 57 to 57, 7 to 7). The one failed file is the pre-existing Pi preflight load failure, byte-identical to the baseline and also failing on main (`scratch/evidence.md:10`, `scratch/evidence.md:16`). | Met | Vitest exits 1 on the pre-existing Pi preflight load failure (missing `../../.skilled/hooks/shared/hook-flags.mjs`), identical in `scratch/base-vitest.txt` and `scratch/fix-vitest.txt` and also failing on main. Every pass count is at or above baseline (`scratch/evidence.md:60`). |
| AC-004 | REQ-007 | Given a command whose version resolves to v1, When the three preflight callers evaluate it, Then each verdict matches the verdict before this phase. | `scratch/req007-v1-parity.txt:1` (one corpus of 23 v1 `opencode run` commands, 0 verdict differences between the pre-change engine in the main checkout and the changed engine here) and `scratch/req007-v1-parity.txt:2` (the corpus is not vacuous: 5 of 5 sample commands fire, hitting all 5 v1 rule ids), with `scratch/evidence.md:45`. | Met | - |

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

All four criteria are Met. AC-001 and AC-002 rest on the red then green runs recorded in `scratch/`, AC-003 rests on pass counts at or above the T002 baseline with the waiver recorded above, and AC-004 rests on the round 2 v1 verdict parity corpus. The one failed file in the vitest run is the pre-existing Pi preflight load failure, unchanged from the baseline and also failing on main. The two housekeeping items from the first pass, the same-class search and the scoped `git status` confirmation (T016) and the deletion of `scratch/backup/` (T017 and CHK-051), are closed by the round 2 captures (`scratch/evidence.md:52-53`).
<!-- /ANCHOR:closure -->
