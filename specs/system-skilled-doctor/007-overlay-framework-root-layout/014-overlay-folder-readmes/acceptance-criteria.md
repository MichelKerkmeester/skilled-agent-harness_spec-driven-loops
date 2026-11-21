---
title: "Acceptance Criteria: Phase 14: overlay-folder-readmes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "overlay folder readmes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/014-overlay-folder-readmes"
    last_updated_at: "2026-11-20T22:06:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-overlay-folder-readmes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: overlay-folder-readmes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 014-overlay-folder-readmes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an overlay folder with a folder lacking a README, When `status --audit` runs, Then it prints `DOCS     missing-readme <label>/<F>`, `docs=<n>`, and a `docs` key under `--json` | `overlay-engine-readmes.test.cjs`: "status --audit prints one missing-readme line per folder without one" and "--json carries the docs key under --audit only", both placements, pass in the 354-test engine suite | Met | - |
| AC-002 | REQ-002 | Given an adopter with no READMEs, When `status` runs with and without `--audit`, Then `RESULT:`, `result` and the exit code are the same | `overlay-engine-readmes.test.cjs`: "the docs leg never changes RESULT or the exit code", plus the Barter run: both engines `RESULT: PASSED`, exit 0, non-DOCS lines identical | Met | - |
| AC-003 | REQ-003 | Given a documentation-only README, When apply, adopt, capture, `repin --stage`, status, pre-commit or relayout runs, Then none writes, takes or names it outside the docs leg | `overlay-engine-readmes.test.cjs`: the apply, capture, guard and pre-commit, relayout, repin --stage and three adopt tests, both placements and both README names | Met | - |
| AC-004 | REQ-004 | Given a manifest listing one layout-link path twice, When `apply` runs, Then it is refused before any write and the tree is byte-identical | `overlay-engine-fixes.test.cjs`: the duplicate table, one subtest per spelling incl. `ext/.`, `x/../ext`, `a//b` and the case pair, `apply`, `status`, `apply --relayout` and `apply --adopt` exit 2 with the tree byte-identical | Met | - |
| AC-005 | REQ-005 | Given an invalid README, When `status --audit` runs, Then sk-doc's validator reports it as `invalid-readme`; Given no validator, Then one `DOCS     skipped:` line prints | `overlay-engine-readmes.test.cjs`: "the real sk-doc validator names a rejected README and passes a valid one" and "a missing python3 prints one skipped line" | Met | - |
| AC-006 | REQ-006 | Given `repin-runs/`, a dot folder, `node_modules` and a linked folder, When the walk runs, Then none of them is reported | `overlay-engine-readmes.test.cjs`: "the docs walk skips the run folders, dot folders and node_modules, and never follows a link", and the unreadable and too-long folder tests | Met | - |
| AC-007 | REQ-007 | Given the overlay docs, When read, Then they name the README roles, the DOCS lines and the duplicate refusal | `rg -n "DOCS" overlays.md doctor-overlay-presentation.txt` prints lines in both; `rg -n "listed twice"` prints the refusal in both | Met | - |

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

Every criterion is met, with the engine suite at 354 of 354. The review ran its five allowed rounds: the last one failed on a single P1, fixed in `fcc8df4983f` and covered by a red-first test, with no further review round.
<!-- /ANCHOR:closure -->
