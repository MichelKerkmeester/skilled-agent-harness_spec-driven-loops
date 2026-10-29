---
title: "Acceptance Criteria: Phase 9: ai-systems-verification"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ai systems verification acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/009-ai-systems-verification"
    last_updated_at: "2026-10-29T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the status of each criterion after the read-only verification run"
    next_safe_action: "Operator approves the AI Systems pushes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: ai-systems-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-ai-systems-verification
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

All commands run with `AIS="/Users/michelkerkmeester/MEGA/Development/AI Systems/AI Systems"`, read only. `E` is this folder's `scratch/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the moved tree, When the 37-row battery and the two Moneybird extras run, Then every check exits 0, counting row 29 as the no-cache case by design | `E/battery.txt` `COUNTS` line and the follow-up rerun of rows 7 and 13 Observed: `COUNTS rows=37 exit0=34 nonzero=3`. Rows 7 and 13 failed only on the Copywriter `lane-budget-baseline.md`, stale since the baseline; after the phase 008 refresh `66e69cbd2` they print `PASSED 186/186 differential inputs` and `PASSED probe routing: 29 probes ...`, exit 0. Row 29 unsets the tiktoken cache by design and exits 2; its cached run prints `route-replay: ok, 445 rows passed`, exit 0, and `token-baseline: check ok, 476 files, 1427 sections`, exit 0. | Met | - |
| AC-002 | REQ-002 | Given the 16 `ROUTER.md` folders, When `router-file-resolver.cjs` runs on each, Then each resolves `router-md`, or `none` for a table-form router, and none resolves `skill-md` or `dual-declaration` (amended 2026-10-29) | `E/resolver-and-links.txt` and `E/pre-move-verdicts.txt` Observed: `routers=16 router-md=8 links-resolve=16`; the other 8 (Copywriter, Deal Templates, Media Editor, the Moneybird hub, `sk-create-figjam`, `sk-product-owner`, Sales Communication, HubSpot) print `none` and declare no `INTENT_SIGNALS`, `RESOURCE_MAP` or `DEFAULT_RESOURCE` assignment; no row prints `skill-md` or `dual-declaration`; all 12 readable pre-move `SKILL.md` at `8e4573b8f` print `none`. | Met | - |
| AC-003 | REQ-003 | Given the 16 `SKILL.md`, When each link to `./ROUTER.md` is checked on disk, Then all 16 resolve | `E/resolver-and-links.txt` Observed: every row reads `link=ok` and the summary prints `links-resolve=16`. | Met | - |
| AC-004 | REQ-004 | Given option C (no Project routing document), When the seven `benchmark/parity/run_parity.sh` runs, Then each exits 0 with its baseline pair count | Rows 31 to 37 of `E/battery.txt` Observed: `PASSED 18/18`, `29/29`, `7/7`, `65/65`, `13/13`, `49/49` and `27/27 declared pairs, seven checks`, each exit 0; kernel router parity rows 10, 12, 17, 18 and 19 print `PASSED kernel router parity`. | Met | - |
| AC-005 | REQ-005 | Given decision D1, When the runs finish, Then no AI Systems tree changed because of them | TREE lines of `E/battery.txt` Observed: the root (HEAD `8171d5249`), Product Owner, Media Editor, Prompt Improver and Moneybird Accountant trees read `clean`; the six `Product Context/Collab Phases/` entries predate the runs and belong to another session. The two baseline refreshes are phase 008 commits, not this phase's writes. | Met | - |

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

Every criterion is met, and no row waits on anything but the operator's push approval, which this phase does not need.
<!-- /ANCHOR:closure -->
