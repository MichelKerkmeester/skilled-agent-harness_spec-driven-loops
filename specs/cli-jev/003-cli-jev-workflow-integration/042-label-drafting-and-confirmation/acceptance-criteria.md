---
title: "Acceptance Criteria: Phase 42: label-drafting-and-confirmation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "labeling card criteria"
  - "two draft criteria"
  - "operator-confirmed labels"
  - "label gate criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation"
    last_updated_at: "2026-10-01T12:59:08Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Met or superseded every criterion at closure"
    next_safe_action: "Offer each open gate a live Jev or Deem run, one yes at a time"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-042-label-drafting-and-confirmation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 42: label-drafting-and-confirmation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The seven rows map onto the five completion criteria in `goal.md`. The Verification cell names the command or artifact that proves the row and the inventory lines the check reads against. Every row records what was observed on 2026-10-01. AC-003 is superseded by ADR-001, because the operator replaced row-by-row chat confirmation with a delegated arbiter. The facts each cell plans against come from `scratch/evidence/label-inventory-1.md` to `-4.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-012 | Given the eleven fillable features and the inventories that describe each one, When the phase starts, Then every feature holds a card stating the rubric from its own spec, its allowed label values, its row source and the exact label file its scorer reads, written before any draft is requested | Seventeen cards under `scratch/evidence/`: the eleven fillable features (003, 006, 023, 026, 027, 029, 030, 031, 032, 034, 035), each naming its rubric, label values, row source, exact label file, zero-call command and gate constant, and the six record cards 020, 022, 024, 025, 028 and 033, each ending in its unblock condition. Observed: every draw and every label file write used the path its card names (`scratch/evidence/labels/gates.md` Draws and Baselines tables), and no draft started before its card existed | Met | - |
| AC-002 | REQ-002, REQ-003, REQ-008 | Given every row of the eleven fillable features, When the two labelers draft, Then every row carries two blind drafts or a recorded reason, one compare split per feature separates the agreed rows from the disagreed rows, and no labeler wrote a file a scorer reads | Drafts: `scratch/drafts/NNN-luna.jsonl` and `NNN-swe.jsonl` for 006, 023, 027, 032, 034 and 035, `031-author-luna.jsonl` and `031-label-swe.jsonl`, and the private features' drafts beside their labels in `~/.skilled/.labels/drafts/` (003, 029 in two parts, 030). Observed agreement with every row's two drafts matched, recorded in each `scratch/evidence/labels/NNN-decisions.md`: 027 4 of 5 with one split, 023 101 of 168 cells, 030 57 of 60, 034 95 of 100 and 50 of 50, 003 and 026 48 of 50 on one shared draft, 029 86 of 95, 032 29 of 40, 006 74 of 98, 035 60 of 60, 031 12 of 36. Recorded reason for the 12 rows `scratch/compare/summary.txt` marks `single-draft`: the parser skipped SWE's first row in seven drafts because SWE printed it on the same line as its progress text, and Luna rewrote four 006 ids. Both drafts exist for all 12, matched by hand in `gates.md` Single-draft rows. Neither labeler wrote a file a scorer reads: every label file matched its pre-label baseline in `scratch/evidence/labels/gates.md` until the session wrote it | Met | - |
| AC-003 | REQ-004, REQ-005, REQ-009 | Given the two blind drafts and the drafted content, When the operator confirms in chat, Then every row carries the operator's answer, agreed rows were put in batches of 10 to 15, or in one batch holding the remainder when a feature had fewer than 10, with one approve-all or flip-some question per batch, disagreed rows were asked one per question with both picks shown, the 035 planted sentences and 031 fixture rows were approved, edited or rejected, and every label file holds only values the operator confirmed, each traceable in its feature's decisions log | `scratch/decisions/` read against every label file: each row names its two draft labels and the operator's answer, no agreed batch holds more than 15 rows, and every label file line matches an answered row. Expected: no label file line without an answer, no answered row missing from its file, and the operator-confirm rule holds (`scratch/evidence/label-inventory-1.md:141` for 006, `scratch/evidence/label-inventory-3.md:144` for 029, `scratch/evidence/label-inventory-4.md:288` for 035) | Superseded | ADR-001 |
| AC-004 | REQ-006 | Given the confirmed label files, When each feature's zero-call command runs with no `--jev` and no `--deem`, Then its gate line prints, or its shortfall is recorded with the exact reason | `scratch/evidence/labels/gates.md` Zero-call gate results, one row per fillable feature, each command run with no `--jev` and no `--deem`, exit 0. Gate open on 023, 029, 030, 031, 032 and 035. Recorded stop on 003 (`stop: no headroom`), 026 (`stop: fewer than 5 labeled yes rows`) and 034 (`stop: fewer than 2 categories can pass`). 006 printed its rates (`labeled=98`, no numeric gate). 027's gate is consulted only on a switched run, and its written reads disagree with the derived gold on 3 of 5 | Met | - |
| AC-005 | REQ-007, REQ-010, REQ-011 | Given the six remaining label gates, When they cannot be filled from today's corpus, Then 020, 022, 024, 025 and 033 are recorded as blocked, each with the exact condition that would unblock it, 028 is recorded as following 027's `gate.label.passed` with no labels of its own, no synthetic row is drawn for any of the five, and no live arm ran without a separate operator yes | `spec.md` blocked records and the six record cards: 020, 022, 024, 025 and 033 each name their unblock condition, and 028 follows 027's `gate.label.passed`. Observed: the draw list in `scratch/evidence/labels/gates.md` names no blocked feature, no synthetic row was written for any of the five, and no command passed `--jev` or `--deem` | Met | - |
| AC-006 | REQ-013 | Given the final state, When the phase closes, Then every gate result is recorded and `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent | `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation --apply`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation --strict`, the same strict run on the parent, then `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation`. Expected: `RESULT: PASSED` for this phase and the parent, and `RESULT: PASSED (5/5 checks)` for the goal. The parent's own derived files are re-derived by the orchestrator's sweep outside this phase's write scope, as 041's close records (`specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment/acceptance-criteria.md:66`) | Met | - |
| AC-007 | REQ-004, REQ-005, REQ-009 | Given the operator's delegation in chat (ADR-001), When each feature's rows are settled, Then a fresh Opus 5.5 medium arbiter run alone judged every row from its source with both blind drafts as claims, the session spot-checked the arbiter's load-bearing claims, each label file was written only from the arbiter's parsed output, and each decisions log names the arbiter, its boundary rulings and the checks | Ten decisions logs under `scratch/evidence/labels/` (027, 023, 030, 034, 003 and 026 together, 029, 032, 006, 035, 031) and the arbiter outputs under `scratch/drafts/` and `~/.skilled/.labels/drafts/`. Observed: one arbiter at a time after the operator's switch, 027 redone under Opus medium with the same five values, every label file written by parser from the arbiter output, and each `labeler` field the arbiter set reading `operator-delegated:opus-5.5-medium`. Rows built by a draw keep their construction labeler: 032's 20 constructed rows read `construction`, except five the arbiter relabeled `partial` under `relabel:operator-delegated:opus-5.5-medium`, and 035's 30 planted rows in `labels.jsonl` read `construction` | Met | - |

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

Six rows are `Met` and AC-003 is `Superseded` by ADR-001 in `decision-record.md`. The operator replaced row-by-row chat confirmation with a delegated Opus 5.5 medium arbiter, run alone, and AC-007 records that method in its place. Every cell names the command or artifact that proves its row and what was observed on 2026-10-01. The DeepSeek V4.1 Flash cross-family review found 1 P0 and 4 P1, all fixed, and its P2 findings are fixed or recorded in `goal.md`'s log. No live Jev or Deem arm ran. Each open gate's live run needs the operator's separate yes.
<!-- /ANCHOR:closure -->

---
