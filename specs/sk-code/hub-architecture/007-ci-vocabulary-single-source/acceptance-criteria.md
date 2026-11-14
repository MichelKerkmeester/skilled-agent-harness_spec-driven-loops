---
title: "Acceptance Criteria: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci vocabulary single source acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/007-ci-vocabulary-single-source"
    last_updated_at: "2026-11-14T17:56:14Z"
    last_updated_by: "scaffold"
    recent_action: "Marked every criterion with observed evidence"
    next_safe_action: "None, the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-ci-vocabulary-single-source"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Make hub-router.json the authority for the sk-code-ci keywords and guard the copies

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `007-ci-vocabulary-single-source`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The first 2 rows are the P0 blockers.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|---|---|---|---|---|---|
| AC-001 | REQ-001 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `grep -c '"vocabularyMirrors": \\["sk-code-frontend", "sk-code-ci"\\]' .skilled/skills/sk-code/hub-router.json` prints 1, and `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `PASS check 2` and exits 0. Observed: `1`, then `PASS check 2`, exit 0, on 2026-11-14 at `4becdb1e35`. | Met | - |
| AC-002 | REQ-002 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` prints `all 4 guards PASSED` and exits 0. Observed: `all 4 guards PASSED`, exit 0. | Met | - |
| AC-003 | REQ-003 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The keyword count command in `spec.md` Measured Behavior still prints 72, and `git diff` of `hub-router.json` for this packet's code commit changes the `vocabularyMirrors` line and the `version` line only. Observed: `72`, and `git show 4becdb1e35` changes two lines of `hub-router.json`. | Met | - |
| AC-004 | REQ-004 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | `bash specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/scratch/replay.sh` prints the same lines after the edit as before it, so `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing. Observed: `diff` printed nothing and exited 0 over 30 lines. | Met | - |
| AC-005 | REQ-005 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | With one keyword removed from the packet row, `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 2` prints `FAIL check 2` and exits 1, and it passes again after the restore. Observed: `FAIL check 2` with exit 1, then `PASS` with exit 0, saved in `scratch/failure-path.txt`. | Met | - |
| AC-006 | REQ-006 | Given this packet's tasks are complete, When the command in the next cell runs from the repository root, Then it prints what the cell states | The newest file in `.skilled/skills/sk-code/changelog/` matches the `version` in `.skilled/skills/sk-code/SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json`, and the newest file in `.skilled/skills/sk-code/sk-code-ci/changelog/` matches the `version` in `.skilled/skills/sk-code/sk-code-ci/SKILL.md`. Observed: `v3.12.1.0.md` matches the four hub sites, and `v1.1.16.0.md` matches the packet `SKILL.md`. | Met | - |

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

Six criteria are met with the outputs observed on 2026-11-14 at commit `4becdb1e35`.
<!-- /ANCHOR:closure -->
